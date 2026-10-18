import {randomBytes} from 'node:crypto';
import {getInstructor} from '@/lib/instructor-auth';
import {lessonIds} from '@/lib/lessons';
import {getSupabaseAdmin} from '@/lib/supabase';

export const runtime='nodejs';

const CODE=/^[A-HJ-NP-Z2-9]{6}$/;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function json(body:Record<string,unknown>,status=200){return Response.json(body,{status,headers:{'Cache-Control':'no-store'}})}
function configured(value:string|undefined){return Boolean(value&&!value.includes('placeholder')&&!value.includes('your_')&&!value.includes('your-'))}
function classCode(){return Array.from(randomBytes(6),byte=>alphabet[byte%alphabet.length]).join('')}
function databaseReference(error:{code?:string;message?:string}){const message=error.message?.toLowerCase()??'';if(message.includes('does not exist')||message.includes('schema cache'))return 'DATABASE_SCHEMA';if(message.includes('permission denied'))return 'DATABASE_PERMISSION';return error.code||'DATABASE_QUERY'}

export async function GET(request:Request){
  if(!configured(process.env.NEXT_PUBLIC_SUPABASE_URL)||!configured(process.env.SUPABASE_SERVICE_ROLE_KEY))return json({error:'Class storage is not configured.'},503);
  const url=new URL(request.url),code=url.searchParams.get('code')?.trim().toUpperCase(),token=url.searchParams.get('token')?.trim(),id=url.searchParams.get('id');
  const admin=getSupabaseAdmin();

  if(token){
    if(!UUID.test(token))return json({error:'This personal invitation link is not valid.'},400);
    const {data:roster,error:rosterError}=await admin.from('class_roster').select('class_id,has_completed').eq('personal_token',token).maybeSingle();
    if(rosterError){const reference=databaseReference(rosterError);return json({error:`The invitation could not be checked (${reference}).`,reference},500)}
    if(!roster)return json({error:'This personal invitation link was not found.'},404);
    const {data,error}=await admin.from('diagnostic_classes').select('id,class_code,title,lesson_id').eq('id',roster.class_id).eq('active',true).maybeSingle();
    if(error){const reference=databaseReference(error);return json({error:`The class could not be checked (${reference}).`,reference},500)}
    if(!data)return json({error:'The class for this invitation is not active.'},404);
    return json({classroom:{id:data.id,code:data.class_code,title:data.title,lessonId:data.lesson_id,personalToken:token,hasCompleted:roster.has_completed}});
  }

  if(code){
    if(!CODE.test(code))return json({error:'Enter a valid six-character class code.'},400);
    const {data,error}=await admin.from('diagnostic_classes').select('id,class_code,title,lesson_id').eq('class_code',code).eq('active',true).maybeSingle();
    if(error){const reference=databaseReference(error);return json({error:`The class could not be checked (${reference}).`,reference},500)}
    if(!data)return json({error:'That class code is not active.'},404);
    return json({classroom:{id:data.id,code:data.class_code,title:data.title,lessonId:data.lesson_id}});
  }

  const instructor=await getInstructor();
  if(!instructor)return json({error:'Instructor authentication is required.'},401);
  if(!id){
    const {data:classes,error:classesError}=await admin.from('diagnostic_classes').select('id,class_code,title,lesson_id,active,created_at').eq('instructor_id',instructor.id).eq('active',true).order('created_at',{ascending:false});
    if(classesError){const reference=databaseReference(classesError);return json({error:`Classes could not be loaded (${reference}).`,reference},500)}
    const classIds=(classes??[]).map(row=>row.id);
    const attemptsByClass=new Map<string,number>();
    if(classIds.length){const {data:attempts,error:attemptError}=await admin.from('diagnostic_attempts').select('class_id').in('class_id',classIds).eq('is_simulated',false);if(attemptError){const reference=databaseReference(attemptError);return json({error:`Class totals could not be loaded (${reference}).`,reference},500)}for(const row of attempts??[]){if(row.class_id)attemptsByClass.set(row.class_id,(attemptsByClass.get(row.class_id)??0)+1)}}
    return json({classes:(classes??[]).map(row=>({id:row.id,code:row.class_code,title:row.title,lessonId:row.lesson_id,active:row.active,createdAt:row.created_at,attempts:attemptsByClass.get(row.id)??0}))});
  }
  if(!UUID.test(id))return json({error:'A valid class ID is required.'},400);
  const {data:classroom,error:classError}=await admin.from('diagnostic_classes').select('id,class_code,title,lesson_id,active,created_at').eq('id',id).eq('instructor_id',instructor.id).maybeSingle();
  if(classError){const reference=databaseReference(classError);return json({error:`The class could not be loaded (${reference}).`,reference},500)}
  if(!classroom)return json({error:'This class does not belong to your instructor account.'},403);

  const {data:attempts,error:attemptError}=await admin.from('diagnostic_attempts').select('participant_id,phase,joint_score').eq('class_id',id);
  if(attemptError){const reference=databaseReference(attemptError);return json({error:`Class results could not be loaded (${reference}).`,reference},500)}
  const rows=attempts??[],pre=rows.filter(row=>row.phase==='pre'),post=rows.filter(row=>row.phase==='post');
  const average=(items:typeof rows)=>items.length?Number((items.reduce((sum,row)=>sum+row.joint_score,0)/items.length).toFixed(1)):null;
  return json({classroom:{id:classroom.id,code:classroom.class_code,title:classroom.title,lessonId:classroom.lesson_id,active:classroom.active,createdAt:classroom.created_at},summary:{learners:new Set(rows.map(row=>row.participant_id)).size,attempts:rows.length,preAttempts:pre.length,postAttempts:post.length,averagePre:average(pre),averagePost:average(post)}});
}

export async function DELETE(request:Request){
  const origin=request.headers.get('origin');
  if(origin&&origin!==new URL(request.url).origin)return json({error:'Cross-site requests are not allowed.'},403);
  const instructor=await getInstructor();
  if(!instructor)return json({error:'Instructor authentication is required.'},401);
  let body:Record<string,unknown>;
  try{body=await request.json() as Record<string,unknown>}catch{return json({error:'Invalid request.'},400)}
  const id=typeof body.id==='string'?body.id:'';
  if(!UUID.test(id))return json({error:'A valid class ID is required.'},400);
  const admin=getSupabaseAdmin();
  const {data,error}=await admin.from('diagnostic_classes').update({active:false}).eq('id',id).eq('instructor_id',instructor.id).select('id').maybeSingle();
  if(error){const reference=databaseReference(error);return json({error:`The class could not be removed (${reference}).`,reference},500)}
  if(!data)return json({error:'This class was not found.'},404);
  return json({removed:true});
}

export async function POST(request:Request){
  const origin=request.headers.get('origin');
  if(origin&&origin!==new URL(request.url).origin)return json({error:'Cross-site submissions are not allowed.'},403);
  if(!configured(process.env.NEXT_PUBLIC_SUPABASE_URL)||!configured(process.env.SUPABASE_SERVICE_ROLE_KEY))return json({error:'Class storage is not configured.'},503);
  const instructor=await getInstructor();
  if(!instructor)return json({error:'Instructor authentication is required.'},401);

  let body:Record<string,unknown>;
  try{body=await request.json() as Record<string,unknown>}catch{return json({error:'Invalid JSON.'},400)}
  const title=typeof body.title==='string'?body.title.trim().replace(/\s+/g,' '):'';
  if(title.length<3||title.length>80)return json({error:'Class title must be between 3 and 80 characters.'},400);
  const lessonId=typeof body.lessonId==='string'?body.lessonId:'';
  if(!lessonIds.has(lessonId))return json({error:'Choose a valid PhySense lesson.'},400);

  const admin=getSupabaseAdmin();
  for(let attempt=0;attempt<5;attempt++){
    const code=classCode();
    const {data,error}=await admin.from('diagnostic_classes').insert({class_code:code,title,lesson_id:lessonId,instructor_id:instructor.id}).select('id,class_code,title,lesson_id,created_at').single();
    if(!error&&data)return json({classroom:{id:data.id,code:data.class_code,title:data.title,lessonId:data.lesson_id,createdAt:data.created_at}},201);
    if(error?.code!=='23505'){const reference=databaseReference(error);return json({error:`The class could not be created (${reference}).`,reference},500)}
  }
  return json({error:'A unique class code could not be generated. Please try again.'},500);
}
