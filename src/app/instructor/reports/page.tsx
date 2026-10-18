import type {Metadata} from 'next';
import Link from 'next/link';
import {connection} from 'next/server';
import AccessDenied from '../access-denied';
import SignOut from '../sign-out';
import ReportsCsvButton from './reports-csv-button';
import {getInstructor} from '@/lib/instructor-auth';
import {getSupabaseAdmin} from '@/lib/supabase';
import styles from './reports.module.css';

export const metadata:Metadata={title:'Instructor reports | PhySense',description:'Aggregate diagnostic performance for your PhySense classes.'};

type AttemptRow={id:string;roster_id:string|null;lesson_id:string;phase:'pre'|'post';answer_score:number;reason_score:number;joint_score:number;duration_ms:number};
type ResponseRow={attempt_id:string;question_id:string;selected_answer:number;selected_reason:number;answer_correct:boolean;reason_correct:boolean;joint_correct:boolean;confidence:'not-sure'|'somewhat'|'very';concept:string;response_time_ms:number};
type RosterRow={id:string;student_email:string};
type Totals={count:number;answer:number;reason:number;joint:number;duration:number};
type ResponseTotals={count:number;answer:number;reason:number;joint:number;time:number;attempts:Set<string>};

const percent=(correct:number,total:number)=>total?`${(correct/total*100).toFixed(1)}%`:'—';
const average=(total:number,count:number,digits=1)=>count?(total/count).toFixed(digits):'—';
const addResponse=(map:Map<string,ResponseTotals>,key:string,row:ResponseRow)=>{const value=map.get(key)??{count:0,answer:0,reason:0,joint:0,time:0,attempts:new Set<string>()};value.count++;value.answer+=Number(row.answer_correct);value.reason+=Number(row.reason_correct);value.joint+=Number(row.joint_correct);value.time+=row.response_time_ms;value.attempts.add(row.attempt_id);map.set(key,value)};

export default async function InstructorReportsPage(){
  await connection();
  const instructor=await getInstructor();
  if(!instructor)return <AccessDenied/>;

  let error:unknown=null;
  let attempts:AttemptRow[]=[];
  let responses:ResponseRow[]=[];
  let roster:RosterRow[]=[];
  try{
    const admin=getSupabaseAdmin();
    const classResult=await admin.from('diagnostic_classes').select('id').eq('instructor_id',instructor.id);
    if(classResult.error)throw classResult.error;
    const classIds=(classResult.data??[]).map(row=>row.id);
    if(classIds.length){
      const rosterResult=await admin.from('class_roster').select('id,student_email').in('class_id',classIds);
      if(rosterResult.error)throw rosterResult.error;
      roster=(rosterResult.data??[]) as RosterRow[];
      const attemptResult=await admin.from('diagnostic_attempts').select('id,roster_id,lesson_id,phase,answer_score,reason_score,joint_score,duration_ms').eq('is_simulated',false).in('class_id',classIds);
      if(attemptResult.error)throw attemptResult.error;
      attempts=(attemptResult.data??[]) as AttemptRow[];
      const attemptIds=attempts.map(row=>row.id);
      if(attemptIds.length){
        const responseResult=await admin.from('diagnostic_responses').select('attempt_id,question_id,selected_answer,selected_reason,answer_correct,reason_correct,joint_correct,confidence,concept,response_time_ms').in('attempt_id',attemptIds);
        if(responseResult.error)throw responseResult.error;
        responses=(responseResult.data??[]) as ResponseRow[];
      }
    }
  }catch(fetchError){error=fetchError;console.error('Supabase Fetch Error:',fetchError)}

  const lessonMap=new Map<string,Totals>();
  const lessonByAttempt=new Map(attempts.map(row=>[row.id,row.lesson_id]));
  for(const row of attempts){const value=lessonMap.get(row.lesson_id)??{count:0,answer:0,reason:0,joint:0,duration:0};value.count++;value.answer+=row.answer_score;value.reason+=row.reason_score;value.joint+=row.joint_score;value.duration+=row.duration_ms;lessonMap.set(row.lesson_id,value)}
  const lessons=[...lessonMap.entries()].sort(([a],[b])=>a.localeCompare(b));

  const questionMap=new Map<string,ResponseTotals>();
  const conceptMap=new Map<string,ResponseTotals>();
  const confidenceMap=new Map<string,ResponseTotals>();
  for(const row of responses){const lessonId=lessonByAttempt.get(row.attempt_id);if(lessonId)addResponse(questionMap,`${lessonId}\u0000${row.question_id}`,row);addResponse(conceptMap,row.concept,row);addResponse(confidenceMap,row.confidence,row)}
  const questions=[...questionMap.entries()].sort(([,a],[,b])=>a.joint/a.count-b.joint/b.count);
  const concepts=[...conceptMap.entries()].sort(([,a],[,b])=>a.joint/a.count-b.joint/b.count);
  const confidenceOrder=['not-sure','somewhat','very'] as const;
  const questionExport=questions.map(([key,value])=>{const [lesson,question]=key.split('\u0000');return {lesson,question,answered:value.count,answerCorrect:percent(value.answer,value.count),reasonCorrect:percent(value.reason,value.count),jointCorrect:percent(value.joint,value.count),averageResponse:`${average(value.time/1000,value.count,1)} s`}});
  const conceptExport=concepts.map(([concept,value])=>({concept,jointCorrect:percent(value.joint,value.count),attempts:value.attempts.size}));
  const rosterEmail=new Map(roster.map(row=>[row.id,row.student_email]));
  const attemptById=new Map(attempts.map(row=>[row.id,row]));
  const rawExport=responses.map(response=>{const attempt=attemptById.get(response.attempt_id);return {studentEmail:attempt?.roster_id?rosterEmail.get(attempt.roster_id)??'':'',lessonId:attempt?.lesson_id??'',phase:attempt?.phase??'',answerScore:attempt?.answer_score??'',reasonScore:attempt?.reason_score??'',jointScore:attempt?.joint_score??'',questionId:response.question_id,selectedAnswer:response.selected_answer,selectedReason:response.selected_reason,answerCorrect:response.answer_correct,reasonCorrect:response.reason_correct,jointCorrect:response.joint_correct,confidence:response.confidence}});

  return <main className={styles.page}><div className={styles.shell}>
    <header><div><Link href="/">PhySense</Link><span className={styles.headerActions}><Link href="/instructor">← Instructor home</Link><SignOut/></span></div><span>PRIVATE INSTRUCTOR DATA · {instructor.email??'SIGNED IN'}</span><h1>Instructor reports</h1><p>Results include only classes created by your signed-in instructor account.</p>{!error&&attempts.length>0&&<ReportsCsvButton questions={questionExport} concepts={conceptExport} raw={rawExport}/>}</header>
    {error?<p className={styles.notice} role="alert">Reports could not be loaded. Confirm that the instructor-account database migration has been applied.</p>:attempts.length===0?<p className={styles.notice}>No shared attempts for your classes yet.</p>:<>
      <section><h2>Lesson summary</h2><p>Scores are averages out of 10. Duration is shown in minutes.</p><div className={styles.tableWrap}><table><thead><tr><th>Lesson</th><th>Total attempts</th><th>Answer score</th><th>Reason score</th><th>Joint score</th><th>Duration</th></tr></thead><tbody>{lessons.map(([lesson,value])=><tr key={lesson}><th>{lesson}</th><td>{value.count}</td><td>{average(value.answer,value.count)}</td><td>{average(value.reason,value.count)}</td><td>{average(value.joint,value.count)}</td><td>{average(value.duration/60000,value.count,2)} min</td></tr>)}</tbody></table></div></section>
      <section><h2>Hardest questions</h2><p>Sorted by the lowest fully-correct percentage first.</p><div className={styles.tableWrap}><table><thead><tr><th>Lesson</th><th>Question</th><th>Answered</th><th>Answer correct</th><th>Reason correct</th><th>Joint correct</th><th>Avg. response</th></tr></thead><tbody>{questions.map(([key,value])=>{const [lesson,question]=key.split('\u0000');return <tr key={key}><td>{lesson}</td><th>{question}</th><td>{value.count}</td><td>{percent(value.answer,value.count)}</td><td>{percent(value.reason,value.count)}</td><td>{percent(value.joint,value.count)}</td><td>{average(value.time/1000,value.count,1)} s</td></tr>})}</tbody></table></div></section>
      <section><h2>Concept mastery</h2><p>Attempts count distinct diagnostic submissions that included each concept.</p><div className={styles.tableWrap}><table><thead><tr><th>Concept</th><th>Joint correct</th><th>Total attempts</th></tr></thead><tbody>{concepts.map(([concept,value])=><tr key={concept}><th>{concept}</th><td>{percent(value.joint,value.count)}</td><td>{value.attempts.size}</td></tr>)}</tbody></table></div></section>
      <section><h2>Confidence vs correctness</h2><div className={styles.tableWrap}><table><thead><tr><th>Confidence</th><th>Responses</th><th>Joint correct</th></tr></thead><tbody>{confidenceOrder.map(confidence=>{const value=confidenceMap.get(confidence);return <tr key={confidence}><th>{confidence==='not-sure'?'Not sure':confidence==='somewhat'?'Somewhat sure':'Very sure'}</th><td>{value?.count??0}</td><td>{value?percent(value.joint,value.count):'—'}</td></tr>})}</tbody></table></div></section>
    </>}
  </div></main>;
}
