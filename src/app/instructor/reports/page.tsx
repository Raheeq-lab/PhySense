import type {Metadata} from 'next';
import Link from 'next/link';
import {connection} from 'next/server';
import {getSupabaseAdmin} from '@/lib/supabase';
import styles from './reports.module.css';

export const metadata:Metadata={title:'Instructor reports | PhySense',description:'Aggregate diagnostic performance across PhySense lessons.'};

type AttemptRow={id:string;lesson_id:string;answer_score:number;reason_score:number;joint_score:number;duration_ms:number};
type ResponseRow={attempt_id:string;question_id:string;answer_correct:boolean;reason_correct:boolean;joint_correct:boolean;confidence:'not-sure'|'somewhat'|'very';concept:string;response_time_ms:number;diagnostic_attempts:{lesson_id:string}|Array<{lesson_id:string}>};
type Totals={count:number;answer:number;reason:number;joint:number;duration:number};
type ResponseTotals={count:number;answer:number;reason:number;joint:number;time:number;attempts:Set<string>};

const percent=(correct:number,total:number)=>total?`${(correct/total*100).toFixed(1)}%`:'—';
const average=(total:number,count:number,digits=1)=>count?(total/count).toFixed(digits):'—';
const lessonOf=(row:ResponseRow)=>Array.isArray(row.diagnostic_attempts)?row.diagnostic_attempts[0]?.lesson_id:row.diagnostic_attempts.lesson_id;
const addResponse=(map:Map<string,ResponseTotals>,key:string,row:ResponseRow)=>{const value=map.get(key)??{count:0,answer:0,reason:0,joint:0,time:0,attempts:new Set<string>()};value.count++;value.answer+=Number(row.answer_correct);value.reason+=Number(row.reason_correct);value.joint+=Number(row.joint_correct);value.time+=row.response_time_ms;value.attempts.add(row.attempt_id);map.set(key,value)};

export default async function InstructorReportsPage(){
  await connection();
  const admin=getSupabaseAdmin();
  const [attemptResult,responseResult]=await Promise.all([
    admin.from('diagnostic_attempts').select('id,lesson_id,answer_score,reason_score,joint_score,duration_ms').eq('is_simulated',false),
    admin.from('diagnostic_responses').select('attempt_id,question_id,answer_correct,reason_correct,joint_correct,confidence,concept,response_time_ms,diagnostic_attempts!inner(lesson_id,is_simulated)').eq('diagnostic_attempts.is_simulated',false),
  ]);
  const error=attemptResult.error??responseResult.error;
  const attempts=(attemptResult.data??[]) as AttemptRow[];
  const responses=(responseResult.data??[]) as unknown as ResponseRow[];

  const lessonMap=new Map<string,Totals>();
  for(const row of attempts){const value=lessonMap.get(row.lesson_id)??{count:0,answer:0,reason:0,joint:0,duration:0};value.count++;value.answer+=row.answer_score;value.reason+=row.reason_score;value.joint+=row.joint_score;value.duration+=row.duration_ms;lessonMap.set(row.lesson_id,value)}
  const lessons=[...lessonMap.entries()].sort(([a],[b])=>a.localeCompare(b));

  const questionMap=new Map<string,ResponseTotals>();
  const conceptMap=new Map<string,ResponseTotals>();
  const confidenceMap=new Map<string,ResponseTotals>();
  for(const row of responses){const lessonId=lessonOf(row);if(lessonId)addResponse(questionMap,`${lessonId}\u0000${row.question_id}`,row);addResponse(conceptMap,row.concept,row);addResponse(confidenceMap,row.confidence,row)}
  const questions=[...questionMap.entries()].sort(([,a],[,b])=>a.joint/a.count-b.joint/b.count);
  const concepts=[...conceptMap.entries()].sort(([,a],[,b])=>a.joint/a.count-b.joint/b.count);
  const confidenceOrder=['not-sure','somewhat','very'] as const;

  return <main className={styles.page}><div className={styles.shell}>
    <header><div><Link href="/">PhySense</Link><Link href="/instructor">← Instructor home</Link></div><span>ANONYMOUS AGGREGATE DATA</span><h1>Instructor reports</h1><p>See where learners are succeeding, where reasoning breaks down, and which concepts need another explanation.</p></header>
    {error?<p className={styles.notice} role="alert">Reports could not be loaded. Check the Supabase server configuration and try again.</p>:attempts.length===0?<p className={styles.notice}>No shared attempts yet.</p>:<>
      <section><h2>Lesson summary</h2><p>Scores are averages out of 10. Duration is shown in minutes.</p><div className={styles.tableWrap}><table><thead><tr><th>Lesson</th><th>Total attempts</th><th>Answer score</th><th>Reason score</th><th>Joint score</th><th>Duration</th></tr></thead><tbody>{lessons.map(([lesson,value])=><tr key={lesson}><th>{lesson}</th><td>{value.count}</td><td>{average(value.answer,value.count)}</td><td>{average(value.reason,value.count)}</td><td>{average(value.joint,value.count)}</td><td>{average(value.duration/60000,value.count,2)} min</td></tr>)}</tbody></table></div></section>
      <section><h2>Hardest questions</h2><p>Sorted by the lowest fully-correct percentage first.</p><div className={styles.tableWrap}><table><thead><tr><th>Lesson</th><th>Question</th><th>Answered</th><th>Answer correct</th><th>Reason correct</th><th>Joint correct</th><th>Avg. response</th></tr></thead><tbody>{questions.map(([key,value])=>{const [lesson,question]=key.split('\u0000');return <tr key={key}><td>{lesson}</td><th>{question}</th><td>{value.count}</td><td>{percent(value.answer,value.count)}</td><td>{percent(value.reason,value.count)}</td><td>{percent(value.joint,value.count)}</td><td>{average(value.time/1000,value.count,1)} s</td></tr>})}</tbody></table></div></section>
      <section><h2>Concept mastery</h2><p>Attempts count distinct diagnostic submissions that included each concept.</p><div className={styles.tableWrap}><table><thead><tr><th>Concept</th><th>Joint correct</th><th>Total attempts</th></tr></thead><tbody>{concepts.map(([concept,value])=><tr key={concept}><th>{concept}</th><td>{percent(value.joint,value.count)}</td><td>{value.attempts.size}</td></tr>)}</tbody></table></div></section>
      <section><h2>Confidence vs correctness</h2><div className={styles.tableWrap}><table><thead><tr><th>Confidence</th><th>Responses</th><th>Joint correct</th></tr></thead><tbody>{confidenceOrder.map(confidence=>{const value=confidenceMap.get(confidence);return <tr key={confidence}><th>{confidence==='not-sure'?'Not sure':confidence==='somewhat'?'Somewhat sure':'Very sure'}</th><td>{value?.count??0}</td><td>{value?percent(value.joint,value.count):'—'}</td></tr>})}</tbody></table></div></section>
    </>}
  </div></main>;
}
