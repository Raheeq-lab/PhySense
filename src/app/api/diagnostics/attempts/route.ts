import {getSupabaseAdmin} from '@/lib/supabase';
import {kinematicsDiagnostic} from '@/data/kinematicsDiagnostic';

export const runtime='nodejs';

const CONSENT_VERSION='2026-10-10';
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const confidenceValues=new Set(['not-sure','somewhat','very']);
type IncomingResponse={questionId:string;answer:number;reason:number;confidence:string;responseTimeMs:number};

function json(body:Record<string,unknown>,status=200){return Response.json(body,{status,headers:{'Cache-Control':'no-store'}})}
function configured(value:string|undefined){return Boolean(value&&!value.includes('placeholder')&&!value.includes('your_')&&!value.includes('your-'))}
function integerIn(value:unknown,min:number,max:number):value is number{return Number.isInteger(value)&&Number(value)>=min&&Number(value)<=max}
function databaseReference(error:{code?:string;message?:string}){const message=error.message?.toLowerCase()??'';if(message.includes('invalid api key')||message.includes('jwt'))return 'INVALID_SERVER_KEY';if(message.includes('permission denied'))return 'DATABASE_PERMISSION';if(message.includes('does not exist'))return 'DATABASE_SCHEMA';if(message.includes('fetch')||message.includes('network'))return 'DATABASE_CONNECTION';return error.code||'DATABASE_INSERT'}

export async function POST(request:Request){
  const contentLength=Number(request.headers.get('content-length')??0);
  if(contentLength>50_000)return json({saved:false,error:'Submission is too large.'},413);

  const origin=request.headers.get('origin');
  if(origin&&origin!==new URL(request.url).origin)return json({saved:false,error:'Cross-site submissions are not allowed.'},403);

  if(!configured(process.env.NEXT_PUBLIC_SUPABASE_URL)||!configured(process.env.SUPABASE_SERVICE_ROLE_KEY))return json({saved:false,error:'Diagnostic storage is not configured.'},503);

  let body:Record<string,unknown>;
  try{body=await request.json() as Record<string,unknown>}catch{return json({saved:false,error:'Invalid JSON.'},400)}

  if(body.isSimulated!==undefined)return json({saved:false,error:'Synthetic data cannot be uploaded.'},400);
  if(body.consentAccepted!==true||body.consentVersion!==CONSENT_VERSION)return json({saved:false,error:'Consent is required before anonymous data can be stored.'},400);
  if(typeof body.participantId!=='string'||!UUID.test(body.participantId))return json({saved:false,error:'Invalid anonymous participant ID.'},400);
  if(typeof body.clientAttemptId!=='string'||!UUID.test(body.clientAttemptId))return json({saved:false,error:'Invalid attempt ID.'},400);
  if(body.phase!=='pre'&&body.phase!=='post')return json({saved:false,error:'Attempt phase must be pre or post.'},400);
  if(typeof body.startedAt!=='string'||typeof body.completedAt!=='string')return json({saved:false,error:'Attempt timestamps are required.'},400);

  const startedAt=new Date(body.startedAt),completedAt=new Date(body.completedAt),durationMs=completedAt.getTime()-startedAt.getTime();
  if(!Number.isFinite(startedAt.getTime())||!Number.isFinite(completedAt.getTime())||durationMs<0||durationMs>14_400_000)return json({saved:false,error:'Invalid attempt duration.'},400);
  if(!Array.isArray(body.responses)||body.responses.length!==kinematicsDiagnostic.length)return json({saved:false,error:'Exactly ten responses are required.'},400);

  const incoming=body.responses as Array<Record<string,unknown>>,seen=new Set<string>(),validated:IncomingResponse[]=[];
  for(const response of incoming){
    if(typeof response.questionId!=='string'||seen.has(response.questionId))return json({saved:false,error:'Question IDs must be unique.'},400);
    const question=kinematicsDiagnostic.find(item=>item.id===response.questionId);
    if(!question)return json({saved:false,error:'An unknown question was submitted.'},400);
    if(!integerIn(response.answer,0,question.answers.length-1)||!integerIn(response.reason,0,question.reasons.length-1))return json({saved:false,error:`Invalid choice for ${question.id}.`},400);
    if(typeof response.confidence!=='string'||!confidenceValues.has(response.confidence))return json({saved:false,error:`Invalid confidence for ${question.id}.`},400);
    if(!integerIn(response.responseTimeMs,0,3_600_000))return json({saved:false,error:`Invalid response time for ${question.id}.`},400);
    seen.add(question.id);validated.push({questionId:question.id,answer:response.answer,reason:response.reason,confidence:response.confidence,responseTimeMs:response.responseTimeMs});
  }
  if(kinematicsDiagnostic.some(question=>!seen.has(question.id)))return json({saved:false,error:'All expected questions must be answered.'},400);

  const marked=validated.map(response=>{const question=kinematicsDiagnostic.find(item=>item.id===response.questionId)!;const answerCorrect=response.answer===question.correctAnswer,reasonCorrect=response.reason===question.correctReason;return {question,response,answerCorrect,reasonCorrect,jointCorrect:answerCorrect&&reasonCorrect}});
  const scores={answer:marked.filter(item=>item.answerCorrect).length,reason:marked.filter(item=>item.reasonCorrect).length,joint:marked.filter(item=>item.jointCorrect).length};
  const admin=getSupabaseAdmin();
  const {data:attempt,error:attemptError}=await admin.from('diagnostic_attempts').insert({client_attempt_id:body.clientAttemptId,participant_id:body.participantId,lesson_id:'block-1/1-1',phase:body.phase,schema_version:'1.0',consent_version:CONSENT_VERSION,started_at:startedAt.toISOString(),completed_at:completedAt.toISOString(),duration_ms:durationMs,answer_score:scores.answer,reason_score:scores.reason,joint_score:scores.joint,is_simulated:false}).select('id').single();

  if(attemptError){
    if(attemptError.code==='23505'){const {data:existing}=await admin.from('diagnostic_attempts').select('id').eq('client_attempt_id',body.clientAttemptId).maybeSingle();if(existing)return json({saved:true,alreadySaved:true,attemptId:existing.id,scores})}
    const reference=databaseReference(attemptError);console.error('Diagnostic attempt insert failed',reference,attemptError.message);
    return json({saved:false,error:`The attempt could not be stored (${reference}). Your local copy is still safe.`,reference},500);
  }

  const responseRows=marked.map(({question,response,answerCorrect,reasonCorrect,jointCorrect})=>({attempt_id:attempt.id,question_id:question.id,selected_answer:response.answer,selected_reason:response.reason,answer_correct:answerCorrect,reason_correct:reasonCorrect,joint_correct:jointCorrect,confidence:response.confidence,concept:question.concept,targeted_misconception:question.misconception,difficulty:question.difficulty,response_time_ms:response.responseTimeMs}));
  const {error:responsesError}=await admin.from('diagnostic_responses').insert(responseRows);
  if(responsesError){await admin.from('diagnostic_attempts').delete().eq('id',attempt.id);const reference=databaseReference(responsesError);console.error('Diagnostic response insert failed',reference,responsesError.message);return json({saved:false,error:`The responses could not be stored (${reference}). Your local copy is still safe.`,reference},500)}

  return json({saved:true,attemptId:attempt.id,scores},201);
}
