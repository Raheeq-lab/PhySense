'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import styles from '../classroom.module.css';

type Classroom={id:string;code:string;title:string;lessonId:string};
const STORAGE_KEY='physense.classroom';

export default function JoinClass(){
  const [code,setCode]=useState('');
  const [classroom,setClassroom]=useState<Classroom|null>(null);
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  useEffect(()=>{queueMicrotask(()=>{const value=new URLSearchParams(location.search).get('code')?.toUpperCase()??'';if(value)setCode(value)})},[]);
  const join=async(event:React.FormEvent)=>{event.preventDefault();setBusy(true);setStatus('');try{const response=await fetch(`/api/classes/?code=${encodeURIComponent(code.trim().toUpperCase())}`,{cache:'no-store'});const body=await response.json() as {classroom?:Classroom;error?:string};if(!response.ok||!body.classroom)throw new Error(body.error||'The class could not be found.');localStorage.setItem(STORAGE_KEY,JSON.stringify(body.classroom));setClassroom(body.classroom)}catch(error){setStatus(error instanceof Error?error.message:'The class could not be found.')}finally{setBusy(false)}};
  return <main className={styles.page}><div className={styles.shell}><div className={styles.top}><Link className={styles.brand} href="/">PhySense</Link><Link className={styles.back} href="/">Home</Link></div><header className={styles.hero}><span className={styles.eyebrow}>Learner entry</span><h1>Join your class</h1><p>Enter the six-character code shared by your instructor. A class code identifies the class; it is not your personal identity.</p></header><section className={`${styles.card} ${styles.joinCard}`}><h2>Class code</h2><p>No name or email is requested.</p><form onSubmit={join}><label className={styles.field}><span>Six-character code</span><input value={code} required minLength={6} maxLength={6} autoCapitalize="characters" autoComplete="off" onChange={event=>setCode(event.target.value.toUpperCase().replace(/[^A-Z2-9]/g,''))}/></label><button className={styles.button} disabled={busy} type="submit">{busy?'Checking…':'Join class'}</button></form>{status&&<p className={styles.error} role="status">{status}</p>}{classroom&&<div className={styles.joined}><b>{classroom.title}</b><p>Your class has been saved on this browser.</p><Link href="/block-1/1-1">Open Kinematics Lesson 1.1 →</Link></div>}</section></div></main>;
}
