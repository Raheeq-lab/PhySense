import {getSupabaseAdmin} from '@/lib/supabase';
import {createClient} from '@/lib/supabase/server';

export const runtime='nodejs';

const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function json(body:Record<string,unknown>,status=200){return Response.json(body,{status,headers:{'Cache-Control':'no-store'}})}

export async function POST(request:Request){
  const origin=request.headers.get('origin');
  if(origin&&origin!==new URL(request.url).origin)return json({error:'Cross-site submissions are not allowed.'},403);
  let body:Record<string,unknown>;
  try{body=await request.json() as Record<string,unknown>}catch{return json({error:'Invalid registration request.'},400)}
  const email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
  const password=typeof body.password==='string'?body.password:'';
  if(!EMAIL.test(email))return json({error:'Enter a valid email address.'},400);
  if(password.length<8||password.length>72)return json({error:'Password must be between 8 and 72 characters.'},400);

  const supabase=await createClient();
  const {data,error}=await supabase.auth.signUp({email,password});
  if(error)return json({error:error.message},400);
  const user=data.user;
  if(!user||user.identities?.length===0)return json({error:'An account with this email may already exist. Try signing in instead.'},400);

  const admin=getSupabaseAdmin();
  if(!data.session){
    const {error:confirmError}=await admin.auth.admin.updateUserById(user.id,{email_confirm:true});
    if(confirmError){await admin.auth.admin.deleteUser(user.id);return json({error:'The account could not be activated.'},500)}
  }
  const {error:profileError}=await admin.from('profiles').upsert({user_id:user.id,role:'instructor'},{onConflict:'user_id'});
  if(profileError){await admin.auth.admin.deleteUser(user.id);return json({error:'The instructor profile could not be created.'},500)}
  if(!data.session){
    const {error:signInError}=await supabase.auth.signInWithPassword({email,password});
    if(signInError)return json({error:'The account was created, but automatic sign-in failed. Please use the login page.'},500);
  }
  return json({registered:true},201);
}
