import {createHash,randomBytes,timingSafeEqual} from 'node:crypto';
import {getSupabaseAdmin} from '@/lib/supabase';

export const runtime='nodejs';

const LESSON_ID='block-1/1-1';
const CODE=/^[A-HJ-NP-Z2-9]{6}$/;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function json(body:Record<string,unknown>,status=200){return Response.json(body,{status,headers:{'Cache-Control':'no-store'}})}
function configured(value:string|undefined){return Boolean(value&&!value.includes('placeholder')&&!value.includes('your_')&&!value.includes('your-'))}
function hash(value:string){return createHash('sha256').update(value).digest('hex')}
function safeEqual(left:string,right:string){const a=Buffer.from(left),b=Buffer.from(right);return a.length===b.length&&timingSafeEqual(a,b)}
function classCode(){return Array.from(randomBytes(6),byte=>alphabet[byte%alphabet.length]).join('')}
function databaseReference(error:{code?:string;message?:string}){const message=error.message?.toLowerCase()??'';if(message.includes('does not exist')||message.includes('schema cache'))return 'DATABASE_SCHEMA';if(message.includes('permission denied'))return 'DATABASE_PERMISSION';return error.code||'DATABASE_QUERY'}

export async function GET(request:Request){
  if(!configured(process.env.NEXT_PUBLIC_SUPABASE_URL)||!configured(process.env.SUPABASE_SERVICE_ROLE_KEY))return json({error:'Class storage is not configured.'},503);
  const url=new URL(request.url),code=url.searchParams.get('code')?.trim().toUpperCase(),id=url.searchParams.get('id');
  const admin=getSupabaseAdmin();

  if(code){
    if(!CODE.test(code))return json({error:'Enter a valid six-character class code.'},400);
    const {data,error}=await admin.from('diagnostic_classes').select('id,class_code,title,lesson_id').eq('class_code',code).eq('active',true).maybeSingle();
    if(error){const reference=databaseReference(error);return json({error:`The class could not be checked (${reference}).`,reference},500)}
    if(!data)return json({error:'That class code is not active.'},404);
    return json({classroom:{id:data.id,code:data.class_code,title:data.title,lessonId:data.lesson_id}});
  }

  if(!id||!UUID.test(id))return json({error:'A valid class ID or class code is required.'},400);
  const token=request.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
  if(!token)return json({error:'The private management token is required.'},401);
  const {data:classroom,error:classError}=await admin.from('diagnostic_classes').select('id,class_code,title,lesson_id,instructor_token_hash,active,created_at').eq('id',id).maybeSingle();
  if(classError){const reference=databaseReference(classError);return json({error:`The class could not be loaded (${reference}).`,reference},500)}
  if(!classroom||!safeEqual(hash(token),classroom.instructor_token_hash))return json({error:'This management link is not valid.'},403);

  const {data:attempts,error:attemptError}=await admin.from('diagnostic_attempts').select('participant_id,phase,joint_score').eq('class_id',id);
  if(attemptError){const reference=databaseReference(attemptError);return json({error:`Class results could not be loaded (${reference}).`,reference},500)}
  const rows=attempts??[],pre=rows.filter(row=>row.phase==='pre'),post=rows.filter(row=>row.phase==='post');
  const average=(items:typeof rows)=>items.length?Number((items.reduce((sum,row)=>sum+row.joint_score,0)/items.length).toFixed(1)):null;
  return json({classroom:{id:classroom.id,code:classroom.class_code,title:classroom.title,lessonId:classroom.lesson_id,active:classroom.active,createdAt:classroom.created_at},summary:{learners:new Set(rows.map(row=>row.participant_id)).size,attempts:rows.length,preAttempts:pre.length,postAttempts:post.length,averagePre:average(pre),averagePost:average(post)}});
}

export async function POST(request:Request){
  const origin=request.headers.get('origin');
  if(origin&&origin!==new URL(request.url).origin)return json({error:'Cross-site submissions are not allowed.'},403);
  if(!configured(process.env.NEXT_PUBLIC_SUPABASE_URL)||!configured(process.env.SUPABASE_SERVICE_ROLE_KEY))return json({error:'Class storage is not configured.'},503);
  const creationKey=process.env.INSTRUCTOR_PROTOTYPE_KEY;
  if(!configured(creationKey))return json({error:'Instructor prototype access is not configured.'},503);
  const suppliedKey=request.headers.get('x-instructor-key')??'';
  if(!safeEqual(suppliedKey,creationKey!))return json({error:'The instructor prototype key is incorrect.'},403);

  let body:Record<string,unknown>;
  try{body=await request.json() as Record<string,unknown>}catch{return json({error:'Invalid JSON.'},400)}
  const title=typeof body.title==='string'?body.title.trim().replace(/\s+/g,' '):'';
  if(title.length<3||title.length>80)return json({error:'Class title must be between 3 and 80 characters.'},400);
  if(body.lessonId!==LESSON_ID)return json({error:'Only Lesson 1.1 is available in this prototype.'},400);

  const token=randomBytes(32).toString('base64url'),admin=getSupabaseAdmin();
  for(let attempt=0;attempt<5;attempt++){
    const code=classCode();
    const {data,error}=await admin.from('diagnostic_classes').insert({class_code:code,title,lesson_id:LESSON_ID,instructor_token_hash:hash(token)}).select('id,class_code,title,lesson_id,created_at').single();
    if(!error&&data)return json({classroom:{id:data.id,code:data.class_code,title:data.title,lessonId:data.lesson_id,createdAt:data.created_at},managementToken:token},201);
    if(error?.code!=='23505'){const reference=databaseReference(error);return json({error:`The class could not be created (${reference}).`,reference},500)}
  }
  return json({error:'A unique class code could not be generated. Please try again.'},500);
}
