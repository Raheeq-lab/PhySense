'use client';

import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {GeistSans} from 'geist/font/sans';
import RosterManager from './roster-manager';
import SignOut from './sign-out';
import InstructorLoading from './loading';
import {lessons,type LessonId} from '@/lib/lessons';
import {useAppearance} from '@/hooks/useAppearance';
import styles from '../classroom.module.css';

type Classroom={id:string;code:string;title:string;lessonId:string;createdAt:string;attempts?:number};
type Summary={learners:number;attempts:number;preAttempts:number;postAttempts:number;averagePre:number|null;averagePost:number|null};
const STORAGE_KEY='physense.instructor.class';
async function fetchSummary(value:Classroom){const response=await fetch(`/api/classes/?id=${encodeURIComponent(value.id)}`,{cache:'no-store'});const body=await response.json() as {summary?:Summary;error?:string};if(!response.ok||!body.summary)throw new Error(body.error||'Could not load the class summary.');return body.summary}

export default function InstructorPrototype({email,fullName,university}:{email:string|null;fullName:string;university:string}){
  const scope=useRef<HTMLElement>(null);
  const {dusk,toggle:toggleAppearance}=useAppearance();
  const [title,setTitle]=useState('Kinematics demonstration');
  const [lessonId,setLessonId]=useState<LessonId>('block-1/1-1');
  const [classroom,setClassroom]=useState<Classroom|null>(null);
  const [savedClasses,setSavedClasses]=useState<Classroom[]>([]);
  const [summary,setSummary]=useState<Summary|null>(null);
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  const [copied,setCopied]=useState<'code'|'link'|null>(null);
  const [classesLoaded,setClassesLoaded]=useState(false);
  useGSAP(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;gsap.from('[data-dashboard-hero] > *',{opacity:0,y:16,duration:.6,stagger:.07,ease:'power3.out'});gsap.from('[data-saved-classes], [data-dashboard-card], [data-class-ready]',{opacity:0,y:28,scale:.985,duration:.7,stagger:.1,delay:.12,ease:'power3.out'})},{scope});

  useEffect(()=>{queueMicrotask(()=>{void (async()=>{
    let remembered:Classroom|undefined;
    try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)??'null') as ({classroom?:Classroom}&Partial<Classroom>)|null;remembered=saved?.classroom??(saved?.id?saved as Classroom:undefined)}catch{}
    if(remembered)setClassroom(remembered);
    try{
      const classRequest=fetch('/api/classes/',{cache:'no-store'}).then(async response=>({response,body:await response.json() as {classes?:Classroom[];error?:string}}));
      const summaryRequest=remembered?fetchSummary(remembered).then(summary=>({summary,error:null})).catch(error=>({summary:null,error})):Promise.resolve({summary:null,error:null});
      const [{response,body},rememberedSummary]=await Promise.all([classRequest,summaryRequest]);
      if(!response.ok||!body.classes)throw new Error(body.error||'Classes could not be loaded.');
      setSavedClasses(body.classes);
      const value=remembered&&body.classes.find(item=>item.id===remembered.id);
      if(value){setClassroom(value);if(rememberedSummary.summary)setSummary(rememberedSummary.summary);else if(rememberedSummary.error)setStatus(rememberedSummary.error instanceof Error?rememberedSummary.error.message:'Could not load the class summary.')}
      else if(remembered){localStorage.removeItem(STORAGE_KEY);setClassroom(null)}
    }catch(error){setStatus(error instanceof Error?error.message:'Classes could not be loaded.')}
    finally{setClassesLoaded(true)}
  })()})},[]);
  const loadSummary=async(value=classroom)=>{if(!value)return;setStatus('');try{setSummary(await fetchSummary(value))}catch(error){setStatus(error instanceof Error?error.message:'Could not load the class summary.')}};
  const createClass=async(event:React.FormEvent)=>{event.preventDefault();setBusy(true);setStatus('');try{const response=await fetch('/api/classes/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,lessonId})});const body=await response.json() as {classroom?:Classroom;error?:string};if(!response.ok||!body.classroom)throw new Error(body.error||'The class could not be created.');localStorage.setItem(STORAGE_KEY,JSON.stringify(body.classroom));setSavedClasses(current=>[body.classroom!,...current]);setClassroom(body.classroom);setSummary({learners:0,attempts:0,preAttempts:0,postAttempts:0,averagePre:null,averagePost:null})}catch(error){setStatus(error instanceof Error?error.message:'The class could not be created.')}finally{setBusy(false)}};
  const copy=async(value:string,type:'code'|'link')=>{try{await navigator.clipboard.writeText(value);setCopied(type);setStatus(type==='code'?'Class code copied.':'Student link copied.');window.setTimeout(()=>setCopied(current=>current===type?null:current),2200)}catch{setStatus('Could not copy automatically. Please copy it manually.')}};
  const reset=()=>{localStorage.removeItem(STORAGE_KEY);setClassroom(null);setSummary(null);setStatus('')};
  const openSaved=async(value:Classroom)=>{setBusy(true);setStatus('');try{const nextSummary=await fetchSummary(value);localStorage.setItem(STORAGE_KEY,JSON.stringify(value));setClassroom(value);setSummary(nextSummary)}catch(error){setStatus(error instanceof Error?error.message:'Could not load the class summary.')}finally{setBusy(false)}};
  const removeSaved=async(value:Classroom)=>{if(!window.confirm(`Remove “${value.title}” from your active classes? Its existing report data will be preserved.`))return;setBusy(true);setStatus('');try{const response=await fetch('/api/classes/',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:value.id})});const body=await response.json() as {removed?:boolean;error?:string};if(!response.ok||!body.removed)throw new Error(body.error||'The class could not be removed.');setSavedClasses(current=>current.filter(item=>item.id!==value.id));if(classroom?.id===value.id)reset();setStatus('Class removed from your active list. Historical reports were preserved.')}catch(error){setStatus(error instanceof Error?error.message:'The class could not be removed.')}finally{setBusy(false)}};
  const joinUrl=classroom?`${location.origin}/join?code=${classroom.code}`:'';
  const savedClassList=classroom&&savedClasses.length>0&&<section data-saved-classes><span className={styles.eyebrow}>Manage classes</span><h2>Your active classes</h2><p>Open a class to view its details, or remove it from your active list.</p><div>{savedClasses.map(value=><article key={value.id}><div><strong>{value.title}</strong><span>{value.lessonId} · Code {value.code} · {value.attempts??0} attempt{value.attempts===1?'':'s'}</span></div><button type="button" disabled={busy||classroom.id===value.id} onClick={()=>void openSaved(value)}>{classroom.id===value.id?'Open now':'Open'}</button><button type="button" data-remove-class disabled={busy} onClick={()=>void removeSaved(value)}>Remove</button></article>)}</div></section>;

  if(!classesLoaded)return <InstructorLoading/>;

  return <main ref={scope} className={`${styles.page} ${GeistSans.variable}`} data-instructor-page><div className={styles.shell}>
    <div className={styles.top} data-instructor-top><Link className={styles.brand} href="/">PhySense</Link><div data-instructor-actions><Link className={styles.back} data-instructor-reports-link href="/instructor/reports">View class reports</Link><Link className={styles.back} href={`/${classroom?.lessonId??lessonId}`}>Open selected lesson</Link><button type="button" data-appearance-toggle aria-pressed={dusk} onClick={toggleAppearance}>{dusk?'Light mode':'Dusk mode'}</button><SignOut/></div></div>
    <header className={styles.hero} data-dashboard-hero><span className={styles.eyebrow}>Instructor workspace{email?` · ${email}`:''}</span><p className={styles.welcome}>Welcome, <strong>{fullName}</strong> from <strong>{university}</strong></p><h1>Build a clear path for every class.</h1><p>Create a class, share its access code, and review pseudonymous learning signals from one focused workspace.</p><div className={styles.notice} data-dashboard-notice>Your account owns every class you create. Learner attempts remain pseudonymous and contain no learner name or email.</div></header>
    {savedClassList}
    {!classroom?<>{savedClasses.length>0&&<section data-saved-classes><span className={styles.eyebrow}>Your classes</span><h2>Open a saved class</h2><p>These classes stay with your instructor account, even on another browser or device.</p><div>{savedClasses.map(value=><article key={value.id}><div><strong>{value.title}</strong><span>{value.lessonId} · Code {value.code} · {value.attempts??0} attempt{value.attempts===1?'':'s'}</span></div><button type="button" onClick={()=>void openSaved(value)}>Open</button><button type="button" data-remove-class disabled={busy} onClick={()=>void removeSaved(value)}>Remove</button></article>)}</div></section>}<div className={styles.grid}><section className={styles.card}><h2>Class details</h2><p>Choose any PhySense lesson for this class pathway.</p><form onSubmit={createClass}><label className={styles.field}><span>Class title</span><input value={title} minLength={3} maxLength={80} required onChange={event=>setTitle(event.target.value)}/></label><label className={styles.field}><span>Topic</span><select value={lessonId} onChange={event=>setLessonId(event.target.value as LessonId)}>{['Block 1','Block 2','Block 3','Block 4'].map(block=><optgroup label={block} key={block}>{lessons.filter(lesson=>lesson.block===block).map(lesson=><option value={lesson.id} key={lesson.id}>Lesson {lesson.number} · {lesson.title}</option>)}</optgroup>)}</select></label><button className={styles.button} disabled={busy} type="submit">{busy?'Creating…':'Create class code'}</button></form>{status&&<p className={styles.error} role="status">{status}</p>}</section><section className={styles.card}><h2>What learners do</h2><p>The class code connects consenting diagnostic attempts to this class. It does not identify a learner.</p><ol className={styles.steps}><li><b>1</b>Enter code</li><li><b>2</b>Open lesson</li><li><b>3</b>Complete diagnostic</li></ol></section></div></>:
    <section className={styles.success} data-class-ready><span className={styles.eyebrow}>Class ready · {classroom.title}</span><h2>Share this class code</h2><div className={styles.code} data-class-code><strong>{classroom.code}</strong><button type="button" data-copied={copied==='code'||undefined} onClick={()=>void copy(classroom.code,'code')}>{copied==='code'?'Copied ✓':'Copy code'}</button></div><div className={styles.actions} data-class-actions><button type="button" data-copied={copied==='link'||undefined} onClick={()=>void copy(joinUrl,'link')}>{copied==='link'?'Copied ✓':'Copy student link'}</button><Link href={`/join?code=${classroom.code}`}>Open student view</Link><button type="button" onClick={()=>void loadSummary()}>Refresh results</button></div>{summary&&<div className={styles.stats} data-class-stats><div><b>{summary.learners}</b><span>pseudonymous learners</span></div><div><b>{summary.attempts}</b><span>shared attempts</span></div><div><b>{summary.preAttempts}</b><span>pre attempts</span></div><div><b>{summary.postAttempts}</b><span>post attempts</span></div><div><b>{summary.averagePre??'—'}</b><span>average pre / 10</span></div><div><b>{summary.averagePost??'—'}</b><span>average post / 10</span></div></div>}<RosterManager classId={classroom.id}/>{status&&<p role="status">{status}</p>}<p className={styles.privacy} data-class-privacy>Roster emails remain in the protected roster table. Consented attempts submitted through personal invitation links can be associated with those roster emails in your raw export. Only your signed-in instructor account can load them.</p><div className={styles.newClassPrompt}><div><strong>Teaching another topic?</strong><span>Start a fresh class pathway and choose any available lesson.</span></div><button type="button" onClick={reset}>Create a new class / topic</button></div></section>}
  </div></main>;
}
