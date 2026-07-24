import { createClient } from '@supabase/supabase-js';

const getEnv = (key) => {
  try {
    const metaVal = import.meta.env?.[key] || import.meta.env?.[`VITE_${key}`] || import.meta.env?.[`NEXT_PUBLIC_${key}`];
    if (metaVal && typeof metaVal === 'string' && metaVal.trim()) return metaVal.trim();
  } catch (e) {}

  try {
    const procVal = process.env?.[key] || process.env?.[`VITE_${key}`] || process.env?.[`NEXT_PUBLIC_${key}`];
    if (procVal && typeof procVal === 'string' && procVal.trim()) return procVal.trim();
  } catch (e) {}

  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL') || 'https://cepyxhgvbaoytrdmtkqn.supabase.co';
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) &&
  !supabaseUrl.includes('placeholder')
);

let client = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  } catch (err) {
    console.warn('⚠️ Supabase client initialization warning:', err);
    client = null;
  }
}

export const supabase = client;
