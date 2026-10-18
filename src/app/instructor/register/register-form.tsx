'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import styles from '../login.module.css';

export default function RegisterForm(){
  const router=useRouter();
  const [fullName,setFullName]=useState('');
  const [university,setUniversity]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const passwordsMatch=password===confirmPassword;
  const showMismatch=confirmPassword.length>0&&!passwordsMatch;
  const submit=async(event:React.FormEvent)=>{event.preventDefault();if(!passwordsMatch){setError('Passwords must match.');return}setBusy(true);setError('');try{const response=await fetch('/api/instructor/register/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fullName,university,email,password})});const body=await response.json() as {registered?:boolean;error?:string};if(!response.ok||!body.registered)throw new Error(body.error||'Registration failed.');router.replace('/instructor/');router.refresh()}catch(submitError){setError(submitError instanceof Error?submitError.message:'Registration failed.');setBusy(false)}};
  return <form onSubmit={submit}><label><span>Full name</span><input type="text" autoComplete="name" minLength={2} maxLength={100} placeholder="Dr. Jane Smith" required value={fullName} onChange={event=>setFullName(event.target.value)}/></label><label><span>University / Institution</span><input type="text" autoComplete="organization" minLength={2} maxLength={160} placeholder="Iowa State University" required value={university} onChange={event=>setUniversity(event.target.value)}/></label><label><span>Email address</span><input type="email" autoComplete="email" maxLength={320} required value={email} onChange={event=>setEmail(event.target.value)}/></label><label><span>Password</span><input type="password" autoComplete="new-password" minLength={8} maxLength={72} required value={password} onChange={event=>setPassword(event.target.value)}/></label><label><span>Confirm password</span><input type="password" autoComplete="new-password" minLength={8} maxLength={72} required aria-invalid={showMismatch} aria-describedby={showMismatch?'password-match-error':undefined} value={confirmPassword} onChange={event=>setConfirmPassword(event.target.value)}/>{showMismatch&&<small className={styles.fieldError} id="password-match-error">Passwords do not match.</small>}</label><button disabled={busy||!passwordsMatch} type="submit">{busy?'Creating account…':'Create instructor account'}</button>{error&&<p className={styles.error} role="alert">{error}</p>}</form>;
}
