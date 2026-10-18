import {getInstructor} from '@/lib/instructor-auth';
import {getSupabaseAdmin} from '@/lib/supabase';

export const runtime='nodejs';

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const json=(body:Record<string,unknown>,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});

export async function DELETE(request:Request){
  const origin=request.headers.get('origin');
  if(origin&&origin!==new URL(request.url).origin)return json({error:'Cross-site requests are not allowed.'},403);
  const instructor=await getInstructor();
  if(!instructor)return json({error:'Instructor authentication is required.'},401);

  let body:Record<string,unknown>;
  try{body=await request.json() as Record<string,unknown>}catch{return json({error:'Invalid request.'},400)}
  const classId=typeof body.classId==='string'?body.classId:'';
  if(!UUID.test(classId))return json({error:'A valid class is required.'},400);

  const admin=getSupabaseAdmin();
  const {data:classroom,error:classError}=await admin.from('diagnostic_classes').select('id').eq('id',classId).eq('instructor_id',instructor.id).maybeSingle();
  if(classError)return json({error:'The selected class could not be verified.'},500);
  if(!classroom)return json({error:'This class does not belong to your instructor account.'},403);

  const {data:attempts,error:attemptError}=await admin.from('diagnostic_attempts').select('id').eq('class_id',classId);
  if(attemptError)return json({error:'Class attempts could not be loaded.'},500);
  const attemptIds=(attempts??[]).map(row=>row.id);
  if(attemptIds.length){
    const {error:responseError}=await admin.from('diagnostic_responses').delete().in('attempt_id',attemptIds);
    if(responseError)return json({error:'Class responses could not be cleared.'},500);
    const {error:deleteError}=await admin.from('diagnostic_attempts').delete().eq('class_id',classId);
    if(deleteError)return json({error:'Class attempts could not be cleared.'},500);
  }
  const {error:rosterError}=await admin.from('class_roster').update({has_completed:false}).eq('class_id',classId);
  if(rosterError)return json({error:'Quiz data was cleared, but roster completion could not be reset.'},500);
  return json({cleared:true,deletedAttempts:attemptIds.length});
}
