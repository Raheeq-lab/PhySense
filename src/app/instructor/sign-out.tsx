'use client';

import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/client';

export default function SignOut(){const router=useRouter();const signOut=async()=>{await createClient().auth.signOut();router.replace('/instructor/login/');router.refresh()};return <button type="button" onClick={()=>void signOut()}>Sign out</button>}
