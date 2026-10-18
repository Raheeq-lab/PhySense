'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import styles from '../classroom.module.css';

type Classroom={id:string;code:string;title:string;lessonId:string;personalToken?:string};
const STORAGE_KEY='physense.classroom';

async function findClass(query:string){const response=await fetch(`/api/classes/?${query}`,{cache:'no-store'});const body=await response.json() as {classroom?:Classroom;error?:string};if(!response.ok||!body.classroom)throw new Error(body.error||'The class could not be found.');return body.classroom}

export default function JoinClass(){
  const [code,setCode]=useState('');
  const [classroom,setClassroom]=useState<Classroom|null>(null);
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  const accept=(value:Classroom)=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(value));setClassroom(value);setStatus('')};

  useEffect(()=>{queueMicrotask(()=>{const params=new URLSearchParams(location.search),token=params.get('token'),value=params.get('code')?.toUpperCase()??'';if(value)setCode(value);if(token){setBusy(true);setStatus('Checking your personal invitation…');void findClass(`token=${encodeURIComponent(token)}`).then(accept).catch(error=>setStatus(error instanceof Error?error.message:'The invitation could not be checked.')).finally(()=>setBusy(false))}})},[]);
  const join=async(event:React.FormEvent)=>{event.preventDefault();setBusy(true);setStatus('');try{accept(await findClass(`code=${encodeURIComponent(code.trim().toUpperCase())}`))}catch(error){setStatus(error instanceof Error?error.message:'The class could not be found.')}finally{setBusy(false)}};

  return <main className={styles.page}><div className={styles.shell}><div className={styles.top}><Link className={styles.brand} href="/">PhySense</Link><Link className={styles.back} href="/">Home</Link></div><header className={styles.hero}><span className={styles.eyebrow}>Learner entry</span><h1>Join your class</h1><p>Open your personal invitation link or enter the six-character code shared by your instructor.</p></header><section className={`${styles.card} ${styles.joinCard}`}><h2>{classroom?'Invitation accepted':'Class code'}</h2><p>{classroom?.personalToken?'This browser is connected to your personal roster invitation. Your email is not added to diagnostic response records.':'No name or email is requested when joining with a class code.'}</p>{!classroom&&<form onSubmit={join}><label className={styles.field}><span>Six-character code</span><input value={code} required minLength={6} maxLength={6} autoCapitalize="characters" autoComplete="off" onChange={event=>setCode(event.target.value.toUpperCase().replace(/[^A-Z2-9]/g,''))}/></label><button className={styles.button} disabled={busy} type="submit">{busy?'Checking…':'Join class'}</button></form>}{status&&<p className={styles.error} role="status">{status}</p>}{classroom&&<div className={styles.joined}><b>{classroom.title}</b><p>Your class invitation has been saved on this browser.</p><Link href={`/${classroom.lessonId}`}>Open selected lesson →</Link></div>}</section></div></main>;
}
