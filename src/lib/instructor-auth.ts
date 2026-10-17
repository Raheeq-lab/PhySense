import {getSupabaseAdmin} from '@/lib/supabase';
import {createClient} from '@/lib/supabase/server';

export type Instructor={id:string;email:string|null};

export async function getInstructor():Promise<Instructor|null>{
  const supabase=await createClient();
  const {data,error}=await supabase.auth.getClaims();
  const claims=data?.claims;
  const id=typeof claims?.sub==='string'?claims.sub:null;
  if(error||!id)return null;
  const admin=getSupabaseAdmin();
  const {data:profile,error:profileError}=await admin.from('profiles').select('user_id,role').eq('user_id',id).eq('role','instructor').maybeSingle();
  if(profileError||!profile)return null;
  return {id,email:typeof claims?.email==='string'?claims.email:null};
}
