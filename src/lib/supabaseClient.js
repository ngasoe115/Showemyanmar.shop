import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://cepyxhgvbaoytrdmtkqn.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcHl4aGd2YmFveXRyZG10a3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MDAwNjksImV4cCI6MjEwMDQ3NjA2OX0.JQh0B52d2zJKezOJWJZxAkPXz6SEklLFTmJ_FacbMeM';

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

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL') || DEFAULT_URL;
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY') || DEFAULT_ANON_KEY;

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
