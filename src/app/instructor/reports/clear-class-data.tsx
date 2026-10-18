'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import styles from './reports.module.css';

type Classroom={id:string;title:string;code:string};

export default function ClearClassData({classes}:{classes:Classroom[]}){
  const router=useRouter();
  const [classId,setClassId]=useState(classes[0]?.id??'');
  const [status,setStatus]=useState<'idle'|'loading'|'success'|'error'>('idle');
  const [message,setMessage]=useState('');

  const clearData=async()=>{
    if(!classId||!window.confirm('Are you sure? This cannot be undone.'))return;
    setStatus('loading');
    setMessage('');
    try{
      const response=await fetch('/api/instructor/reports',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({classId})});
      const result=await response.json() as {deletedAttempts?:number;error?:string};
      if(!response.ok)throw new Error(result.error??'Class data could not be cleared.');
      setStatus('success');
      setMessage(`${result.deletedAttempts??0} diagnostic attempt${result.deletedAttempts===1?'':'s'} cleared.`);
      router.refresh();
    }catch(error){
      setStatus('error');
      setMessage(error instanceof Error?error.message:'Class data could not be cleared.');
    }
  };

  return <section className={`${styles.card} ${styles.dangerCard}`} aria-labelledby="manage-data-title">
    <div className={styles.cardHeader}><div><span>Danger zone</span><h2 id="manage-data-title">Manage class data</h2></div><p>Permanently remove quiz attempts and responses. The class and student roster will stay intact.</p></div>
    {classes.length?<div className={styles.dangerControls}><label><span>Choose a class</span><select value={classId} onChange={event=>{setClassId(event.target.value);setStatus('idle');setMessage('')}}>{classes.map(classroom=><option value={classroom.id} key={classroom.id}>{classroom.title} ({classroom.code})</option>)}</select></label><button type="button" disabled={status==='loading'||!classId} onClick={clearData}>{status==='loading'?'Clearing data…':'Clear Data for this Class'}</button></div>:<p className={styles.emptyMessage}>Create a class before managing report data.</p>}
    {message&&<p className={status==='error'?styles.errorMessage:styles.successMessage} role={status==='error'?'alert':'status'}>{message}</p>}
  </section>;
}
