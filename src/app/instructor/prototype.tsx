'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import styles from '../classroom.module.css';

type Classroom={id:string;code:string;title:string;lessonId:string;createdAt:string};
type Summary={learners:number;attempts:number;preAttempts:number;postAttempts:number;averagePre:number|null;averagePost:number|null};
type Management={classroom:Classroom;managementToken:string};
const STORAGE_KEY='physense.instructor.class';
async function fetchSummary(value:Management){const response=await fetch(`/api/classes/?id=${encodeURIComponent(value.classroom.id)}`,{headers:{Authorization:`Bearer ${value.managementToken}`},cache:'no-store'});const body=await response.json() as {summary?:Summary;error?:string};if(!response.ok||!body.summary)throw new Error(body.error||'Could not load the class summary.');return body.summary}

export default function InstructorPrototype(){
  const [title,setTitle]=useState('Kinematics demonstration');
  const [accessKey,setAccessKey]=useState('');
  const [management,setManagement]=useState<Management|null>(null);
  const [summary,setSummary]=useState<Summary|null>(null);
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);

  useEffect(()=>{queueMicrotask(()=>{try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)??'null') as Management|null;if(saved?.classroom?.id&&saved.managementToken){setManagement(saved);void fetchSummary(saved).then(setSummary).catch(error=>setStatus(error instanceof Error?error.message:'Could not load the class summary.'))}}catch{}})},[]);
  const loadSummary=async(value=management)=>{if(!value)return;setStatus('');try{setSummary(await fetchSummary(value))}catch(error){setStatus(error instanceof Error?error.message:'Could not load the class summary.')}};
  const createClass=async(event:React.FormEvent)=>{event.preventDefault();setBusy(true);setStatus('');try{const response=await fetch('/api/classes/',{method:'POST',headers:{'Content-Type':'application/json','x-instructor-key':accessKey},body:JSON.stringify({title,lessonId:'block-1/1-1'})});const body=await response.json() as {classroom?:Classroom;managementToken?:string;error?:string};if(!response.ok||!body.classroom||!body.managementToken)throw new Error(body.error||'The class could not be created.');const next={classroom:body.classroom,managementToken:body.managementToken};localStorage.setItem(STORAGE_KEY,JSON.stringify(next));setManagement(next);setSummary({learners:0,attempts:0,preAttempts:0,postAttempts:0,averagePre:null,averagePost:null});setAccessKey('')}catch(error){setStatus(error instanceof Error?error.message:'The class could not be created.')}finally{setBusy(false)}};
  const copy=async(value:string)=>{await navigator.clipboard.writeText(value);setStatus('Copied to the clipboard.')};
  const reset=()=>{localStorage.removeItem(STORAGE_KEY);setManagement(null);setSummary(null);setStatus('')};
  const joinUrl=management?`${location.origin}/join?code=${management.classroom.code}`:'';

  return <main className={styles.page}><div className={styles.shell}>
    <div className={styles.top}><Link className={styles.brand} href="/">PhySense</Link><div><Link className={styles.back} href="/instructor/reports">View all reports →</Link> <Link className={styles.back} href="/block-1/1-1">Open Lesson 1.1 →</Link></div></div>
    <header className={styles.hero}><span className={styles.eyebrow}>Instructor demonstrator</span><h1>Create a class pathway</h1><p>Create a code for one class, share it with learners, and view pseudonymous aggregate diagnostic results.</p><div className={styles.notice}>Prototype boundary: this page has no instructor account and stores no instructor or learner name or email. The private management link is kept only in this browser.</div></header>
    {!management?<div className={styles.grid}><section className={styles.card}><h2>Class details</h2><p>Only Kinematics Lesson 1.1 is available in the current demonstrator.</p><form onSubmit={createClass}><label className={styles.field}><span>Class title</span><input value={title} minLength={3} maxLength={80} required onChange={event=>setTitle(event.target.value)}/></label><label className={styles.field}><span>Topic</span><select value="block-1/1-1" disabled><option value="block-1/1-1">Kinematics · Lesson 1.1</option></select></label><label className={styles.field}><span>Instructor prototype key</span><input type="password" value={accessKey} required autoComplete="off" onChange={event=>setAccessKey(event.target.value)}/></label><button className={styles.button} disabled={busy} type="submit">{busy?'Creating…':'Create class code'}</button></form>{status&&<p className={styles.error} role="status">{status}</p>}</section><section className={styles.card}><h2>What learners do</h2><p>The class code connects consenting diagnostic attempts to this class. It does not identify a learner.</p><ol className={styles.steps}><li><b>1</b>Enter code</li><li><b>2</b>Open lesson</li><li><b>3</b>Complete diagnostic</li></ol></section></div>:
    <section className={styles.success}><span className={styles.eyebrow}>Class ready · {management.classroom.title}</span><h2>Share this class code</h2><div className={styles.code}><strong>{management.classroom.code}</strong><button type="button" onClick={()=>void copy(management.classroom.code)}>Copy code</button></div><div className={styles.actions}><button type="button" onClick={()=>void copy(joinUrl)}>Copy student link</button><Link href={`/join?code=${management.classroom.code}`}>Open student view</Link><button type="button" onClick={()=>void loadSummary()}>Refresh results</button><button type="button" onClick={reset}>Create another class</button></div>{summary&&<div className={styles.stats}><div><b>{summary.learners}</b><span>pseudonymous learners</span></div><div><b>{summary.attempts}</b><span>shared attempts</span></div><div><b>{summary.preAttempts}</b><span>pre attempts</span></div><div><b>{summary.postAttempts}</b><span>post attempts</span></div><div><b>{summary.averagePre??'—'}</b><span>average pre / 10</span></div><div><b>{summary.averagePost??'—'}</b><span>average post / 10</span></div></div>}{status&&<p role="status">{status}</p>}<p className={styles.privacy}>Keep this browser&apos;s management data private. Learners who do not select optional sharing can still complete the diagnostic, but their attempt will not appear here.</p></section>}
  </div></main>;
}
