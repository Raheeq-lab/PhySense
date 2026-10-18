'use client';

import Link from 'next/link';
import {useCallback,useEffect,useState} from 'react';
import styles from '../classroom.module.css';

type Classroom={id:string;code:string;title:string;lessonId:string;personalToken?:string;hasCompleted?:boolean};
const STORAGE_KEY='physense.classroom';

async function findClass(query:string){const response=await fetch(`/api/classes/?${query}`,{cache:'no-store'});const body=await response.json() as {classroom?:Classroom;error?:string};if(!response.ok||!body.classroom)throw new Error(body.error||'The class could not be found.');return body.classroom}
function clearInvitationResults(token:string){
  for(let index=localStorage.length-1;index>=0;index--){
    const key=localStorage.key(index);
    if(!key?.startsWith('physense.')||!key.includes('.diagnostic.'))continue;
    try{
      if(key.endsWith('.diagnostic.attempts')){
        const attempts=JSON.parse(localStorage.getItem(key)??'[]') as Array<{personalToken?:string}>;
        const remaining=attempts.filter(attempt=>attempt.personalToken!==token);
        if(remaining.length===attempts.length)continue;
        if(remaining.length)localStorage.setItem(key,JSON.stringify(remaining));else localStorage.removeItem(key);
      }else if(key.endsWith('.diagnostic.session')){
        const session=JSON.parse(localStorage.getItem(key)??'null') as {attempt?:{personalToken?:string}}|null;
        if(session?.attempt?.personalToken===token)localStorage.removeItem(key);
      }
    }catch{}
  }
}

export default function JoinClass(){
  const [code,setCode]=useState('');
  const [classroom,setClassroom]=useState<Classroom|null>(null);
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  const [autoJoining,setAutoJoining]=useState(false);
  const accept=useCallback((value:Classroom,openLesson=false)=>{if(value.personalToken&&value.hasCompleted===false)clearInvitationResults(value.personalToken);localStorage.setItem(STORAGE_KEY,JSON.stringify(value));setStatus('');if(openLesson){window.location.replace(`/${value.lessonId}`);return}setClassroom(value)},[]);

  useEffect(()=>{queueMicrotask(()=>{const params=new URLSearchParams(location.search),token=params.get('token'),value=params.get('code')?.toUpperCase()??'';if(value)setCode(value);if(token||value){setAutoJoining(true);setBusy(true);setStatus(token?'Checking your personal invitation…':'Opening your class…');const query=token?`token=${encodeURIComponent(token)}`:`code=${encodeURIComponent(value)}`;void findClass(query).then(classroom=>accept(classroom,true)).catch(error=>{setAutoJoining(false);setStatus(error instanceof Error?error.message:'The invitation could not be checked.')}).finally(()=>setBusy(false))}})},[accept]);
  const join=async(event:React.FormEvent)=>{event.preventDefault();setBusy(true);setStatus('');try{accept(await findClass(`code=${encodeURIComponent(code.trim().toUpperCase())}`))}catch(error){setStatus(error instanceof Error?error.message:'The class could not be found.')}finally{setBusy(false)}};

  if(autoJoining)return <main className={styles.page}><div className={styles.shell}><div className={styles.top}><span className={styles.brand}>PhySense</span></div><section className={`${styles.card} ${styles.joinCard}`} role="status" aria-live="polite"><span className={styles.eyebrow}>Class link verified</span><h2>Opening your lesson…</h2><p>No extra step is needed. You will continue automatically.</p></section></div></main>;

  return <main className={styles.page}><div className={styles.shell}><div className={styles.top}><Link className={styles.brand} href="/">PhySense</Link><Link className={styles.back} href="/">Home</Link></div><header className={styles.hero}><span className={styles.eyebrow}>Learner entry</span><h1>Join your class</h1><p>Enter the six-character code shared by your instructor.</p></header><section className={`${styles.card} ${styles.joinCard}`}><h2>{classroom?'Class joined':'Class code'}</h2><p>No name or email is requested when joining with a class code.</p>{!classroom&&<form onSubmit={join}><label className={styles.field}><span>Six-character code</span><input value={code} required minLength={6} maxLength={6} autoCapitalize="characters" autoComplete="off" onChange={event=>setCode(event.target.value.toUpperCase().replace(/[^A-Z2-9]/g,''))}/></label><button className={styles.button} disabled={busy} type="submit">{busy?'Checking…':'Join class'}</button></form>}{status&&<p className={styles.error} role="status">{status}</p>}{classroom&&<div className={styles.joined}><b>{classroom.title}</b><p>Your class has been saved on this browser.</p><Link href={`/${classroom.lessonId}`}>Open selected lesson →</Link></div>}</section></div></main>;
}
