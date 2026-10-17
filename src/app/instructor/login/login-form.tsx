'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/client';
import styles from '../login.module.css';

export default function LoginForm(){
  const router=useRouter();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const submit=async(event:React.FormEvent)=>{event.preventDefault();setBusy(true);setError('');const supabase=createClient();const {error:signInError}=await supabase.auth.signInWithPassword({email,password});if(signInError){setError(signInError.message);setBusy(false);return}router.replace('/instructor/');router.refresh()};
  return <form onSubmit={submit}><label><span>Email</span><input type="email" autoComplete="email" required value={email} onChange={event=>setEmail(event.target.value)}/></label><label><span>Password</span><input type="password" autoComplete="current-password" required value={password} onChange={event=>setPassword(event.target.value)}/></label><button disabled={busy} type="submit">{busy?'Signing in…':'Sign in'}</button>{error&&<p className={styles.error} role="alert">{error}</p>}</form>;
}
