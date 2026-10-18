import {getInstructor} from '@/lib/instructor-auth';
import {getSupabaseAdmin} from '@/lib/supabase';

export const runtime='nodejs';

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function json(body:Record<string,unknown>,status=200){return Response.json(body,{status,headers:{'Cache-Control':'no-store'}})}
function rows(data:Array<{student_email:string;personal_token:string;has_completed:boolean}>|null){return (data??[]).map(row=>({studentEmail:row.student_email,personalToken:row.personal_token,hasCompleted:row.has_completed}))}

async function ownedClass(classId:string){
  const instructor=await getInstructor();
  if(!instructor)return {error:json({error:'Instructor authentication is required.'},401)};
  const admin=getSupabaseAdmin();
  const {data,error}=await admin.from('diagnostic_classes').select('id').eq('id',classId).eq('instructor_id',instructor.id).maybeSingle();
  if(error)return {error:json({error:'The class could not be checked.'},500)};
  if(!data)return {error:json({error:'This class does not belong to your instructor account.'},403)};
  return {admin};
}

export async function GET(request:Request){
  const classId=new URL(request.url).searchParams.get('classId')??'';
  if(!UUID.test(classId))return json({error:'A valid class ID is required.'},400);
  const owner=await ownedClass(classId);
  if(owner.error)return owner.error;
  const {data,error}=await owner.admin.from('class_roster').select('student_email,personal_token,has_completed').eq('class_id',classId).order('student_email');
  if(error)return json({error:'The roster could not be loaded.'},500);
  return json({roster:rows(data)});
}

export async function POST(request:Request){
  const origin=request.headers.get('origin');
  if(origin&&origin!==new URL(request.url).origin)return json({error:'Cross-site submissions are not allowed.'},403);
  let body:Record<string,unknown>;
  try{body=await request.json() as Record<string,unknown>}catch{return json({error:'Invalid roster request.'},400)}
  const classId=typeof body.classId==='string'?body.classId:'';
  if(!UUID.test(classId))return json({error:'A valid class ID is required.'},400);
  if(!Array.isArray(body.emails))return json({error:'Provide a list of student emails.'},400);
  const emails=[...new Set(body.emails.map(value=>typeof value==='string'?value.trim().toLowerCase():'').filter(Boolean))];
  if(!emails.length||emails.length>500)return json({error:'Provide between 1 and 500 student emails.'},400);
  const invalid=emails.find(email=>!EMAIL.test(email)||email.length>320);
  if(invalid)return json({error:`Invalid student email: ${invalid}`},400);
  const owner=await ownedClass(classId);
  if(owner.error)return owner.error;
  const {error:insertError}=await owner.admin.from('class_roster').upsert(emails.map(student_email=>({class_id:classId,student_email})),{onConflict:'class_id,student_email',ignoreDuplicates:true});
  if(insertError)return json({error:'The invitations could not be generated. Confirm the roster migration has been applied.'},500);
  const {data,error}=await owner.admin.from('class_roster').select('student_email,personal_token,has_completed').eq('class_id',classId).order('student_email');
  if(error)return json({error:'The roster was saved, but could not be reloaded.'},500);
  return json({roster:rows(data)},201);
}
