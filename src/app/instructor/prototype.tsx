'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import RosterManager from './roster-manager';
import SignOut from './sign-out';
import {lessons,type LessonId} from '@/lib/lessons';
import {useAppearance} from '@/hooks/useAppearance';
import styles from '../classroom.module.css';

type Classroom={id:string;code:string;title:string;lessonId:string;createdAt:string};
type Summary={learners:number;attempts:number;preAttempts:number;postAttempts:number;averagePre:number|null;averagePost:number|null};
const STORAGE_KEY='physense.instructor.class';
async function fetchSummary(value:Classroom){const response=await fetch(`/api/classes/?id=${encodeURIComponent(value.id)}`,{cache:'no-store'});const body=await response.json() as {summary?:Summary;error?:string};if(!response.ok||!body.summary)throw new Error(body.error||'Could not load the class summary.');return body.summary}

export default function InstructorPrototype({email,fullName,university}:{email:string|null;fullName:string;university:string}){
  const {dusk,toggle:toggleAppearance}=useAppearance();
  const [title,setTitle]=useState('Kinematics demonstration');
  const [lessonId,setLessonId]=useState<LessonId>('block-1/1-1');
  const [classroom,setClassroom]=useState<Classroom|null>(null);
  const [summary,setSummary]=useState<Summary|null>(null);
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);

  useEffect(()=>{queueMicrotask(()=>{try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)??'null') as ({classroom?:Classroom}&Partial<Classroom>)|null;const value=saved?.classroom??(saved?.id?saved as Classroom:undefined);if(value){setClassroom(value);void fetchSummary(value).then(setSummary).catch(error=>setStatus(error instanceof Error?error.message:'Could not load the class summary.'))}}catch{}})},[]);
  const loadSummary=async(value=classroom)=>{if(!value)return;setStatus('');try{setSummary(await fetchSummary(value))}catch(error){setStatus(error instanceof Error?error.message:'Could not load the class summary.')}};
  const createClass=async(event:React.FormEvent)=>{event.preventDefault();setBusy(true);setStatus('');try{const response=await fetch('/api/classes/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,lessonId})});const body=await response.json() as {classroom?:Classroom;error?:string};if(!response.ok||!body.classroom)throw new Error(body.error||'The class could not be created.');localStorage.setItem(STORAGE_KEY,JSON.stringify(body.classroom));setClassroom(body.classroom);setSummary({learners:0,attempts:0,preAttempts:0,postAttempts:0,averagePre:null,averagePost:null})}catch(error){setStatus(error instanceof Error?error.message:'The class could not be created.')}finally{setBusy(false)}};
  const copy=async(value:string)=>{await navigator.clipboard.writeText(value);setStatus('Copied to the clipboard.')};
  const reset=()=>{localStorage.removeItem(STORAGE_KEY);setClassroom(null);setSummary(null);setStatus('')};
  const joinUrl=classroom?`${location.origin}/join?code=${classroom.code}`:'';

  return <main className={styles.page} data-instructor-page><div className={styles.shell}>
    <div className={styles.top} data-instructor-top><Link className={styles.brand} href="/">PhySense</Link><div data-instructor-actions><Link className={styles.back} href="/instructor/reports">View reports</Link><Link className={styles.back} href={`/${classroom?.lessonId??lessonId}`}>Open selected lesson</Link><button type="button" data-appearance-toggle aria-pressed={dusk} onClick={toggleAppearance}>{dusk?'Light mode':'Dusk mode'}</button><SignOut/></div></div>
    <header className={styles.hero}><span className={styles.eyebrow}>Instructor workspace{email?` · ${email}`:''}</span><p className={styles.welcome}>Welcome, <strong>{fullName}</strong> from <strong>{university}</strong></p><h1>Create a class pathway</h1><p>Create a code for one class, share it with learners, and view pseudonymous aggregate diagnostic results.</p><div className={styles.notice} data-dashboard-notice>Your signed-in account owns each class you create. Learner attempts remain pseudonymous and contain no learner name or email.</div></header>
    {!classroom?<div className={styles.grid}><section className={styles.card}><h2>Class details</h2><p>Choose any PhySense lesson for this class pathway.</p><form onSubmit={createClass}><label className={styles.field}><span>Class title</span><input value={title} minLength={3} maxLength={80} required onChange={event=>setTitle(event.target.value)}/></label><label className={styles.field}><span>Topic</span><select value={lessonId} onChange={event=>setLessonId(event.target.value as LessonId)}>{['Block 1','Block 2','Block 3','Block 4'].map(block=><optgroup label={block} key={block}>{lessons.filter(lesson=>lesson.block===block).map(lesson=><option value={lesson.id} key={lesson.id}>Lesson {lesson.number} · {lesson.title}</option>)}</optgroup>)}</select></label><button className={styles.button} disabled={busy} type="submit">{busy?'Creating…':'Create class code'}</button></form>{status&&<p className={styles.error} role="status">{status}</p>}</section><section className={styles.card}><h2>What learners do</h2><p>The class code connects consenting diagnostic attempts to this class. It does not identify a learner.</p><ol className={styles.steps}><li><b>1</b>Enter code</li><li><b>2</b>Open lesson</li><li><b>3</b>Complete diagnostic</li></ol></section></div>:
    <section className={styles.success} data-class-ready><span className={styles.eyebrow}>Class ready · {classroom.title}</span><h2>Share this class code</h2><div className={styles.code} data-class-code><strong>{classroom.code}</strong><button type="button" onClick={()=>void copy(classroom.code)}>Copy code</button></div><div className={styles.actions} data-class-actions><button type="button" onClick={()=>void copy(joinUrl)}>Copy student link</button><Link href={`/join?code=${classroom.code}`}>Open student view</Link><button type="button" onClick={()=>void loadSummary()}>Refresh results</button><button type="button" onClick={reset}>Create another class</button></div>{summary&&<div className={styles.stats} data-class-stats><div><b>{summary.learners}</b><span>pseudonymous learners</span></div><div><b>{summary.attempts}</b><span>shared attempts</span></div><div><b>{summary.preAttempts}</b><span>pre attempts</span></div><div><b>{summary.postAttempts}</b><span>post attempts</span></div><div><b>{summary.averagePre??'—'}</b><span>average pre / 10</span></div><div><b>{summary.averagePost??'—'}</b><span>average post / 10</span></div></div>}<RosterManager classId={classroom.id}/>{status&&<p role="status">{status}</p>}<p className={styles.privacy} data-class-privacy>Roster emails remain in the protected roster table. Consented attempts submitted through personal invitation links can be associated with those roster emails in your raw export. Only your signed-in instructor account can load them.</p></section>}
  </div></main>;
}
