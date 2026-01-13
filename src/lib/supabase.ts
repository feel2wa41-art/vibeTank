import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  const hasUrl = supabaseUrl !== '' && supabaseUrl !== 'undefined';
  const hasKey = supabaseAnonKey !== '' && supabaseAnonKey !== 'undefined';
  return hasUrl && hasKey;
};

// Only create client if credentials are provided
let supabaseClient = null;
try {
  if (isSupabaseConfigured()) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase connected');
  } else {
    console.log('ℹ️ Supabase not configured - using localStorage (this is normal for local development)');
  }
} catch (error) {
  console.warn('⚠️ Supabase initialization failed - falling back to localStorage:', error);
  supabaseClient = null;
}

export const supabase = supabaseClient;
