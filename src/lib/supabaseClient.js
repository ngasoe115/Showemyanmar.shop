import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://cepyxhgvbaoytrdmtkqn.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcHl4aGd2YmFveXRyZG10a3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MDAwNjksImV4cCI6MjEwMDQ3NjA2OX0.JQh0B52d2zJKezOJWJZxAkPXz6SEklLFTmJ_FacbMeM';

export const isSupabaseConfigured = true;

let client = null;

try {
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
} catch (err) {
  console.warn('⚠️ Supabase client error:', err);
}

export const supabase = client;
