'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import styles from '../login.module.css';

export default function RegisterForm(){
  const router=useRouter();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const submit=async(event:React.FormEvent)=>{event.preventDefault();setBusy(true);setError('');try{const response=await fetch('/api/instructor/register/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});const body=await response.json() as {registered?:boolean;error?:string};if(!response.ok||!body.registered)throw new Error(body.error||'Registration failed.');router.replace('/instructor/');router.refresh()}catch(submitError){setError(submitError instanceof Error?submitError.message:'Registration failed.');setBusy(false)}};
  return <form onSubmit={submit}><label><span>Email</span><input type="email" autoComplete="email" required value={email} onChange={event=>setEmail(event.target.value)}/></label><label><span>Password</span><input type="password" autoComplete="new-password" minLength={8} maxLength={72} required value={password} onChange={event=>setPassword(event.target.value)}/></label><button disabled={busy} type="submit">{busy?'Creating account…':'Create instructor account'}</button>{error&&<p className={styles.error} role="alert">{error}</p>}</form>;
}
