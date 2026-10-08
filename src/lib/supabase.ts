import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isValidHttpUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const isPlaceholder = (val?: string): boolean => {
  if (!val) return true;
  return val.includes('your_') || val.includes('your-') || val.includes('placeholder');
};

if (!supabaseUrl || isPlaceholder(supabaseUrl)) {
  if (typeof window !== 'undefined' || process.env.NODE_ENV === 'development') {
    console.warn(
      'Supabase Project URL is missing or using placeholder. Please set NEXT_PUBLIC_SUPABASE_URL in .env.local to your project URL (e.g., https://your-project-id.supabase.co).'
    );
  }
}

// Fallback to valid placeholder URL during build/dev if URL is still pending
const resolvedUrl = isValidHttpUrl(supabaseUrl) && !isPlaceholder(supabaseUrl)
  ? (supabaseUrl as string)
  : 'https://placeholder.supabase.co';

const resolvedAnonKey = supabaseAnonKey && !isPlaceholder(supabaseAnonKey)
  ? supabaseAnonKey
  : 'placeholder-anon-key';

// Client for public operations (browser & client components)
export const supabase = createClient(resolvedUrl, resolvedAnonKey);

// Server-side client with elevated service role privileges (never used on client components)
export const getSupabaseAdmin = () => {
  const serviceKey = supabaseServiceRoleKey && !isPlaceholder(supabaseServiceRoleKey)
    ? supabaseServiceRoleKey
    : resolvedAnonKey;

  return createClient(resolvedUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
