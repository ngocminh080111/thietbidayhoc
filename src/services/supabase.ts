// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// FRONTEND SUPABASE CLIENT
// ==============================================================================
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let client: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized on frontend');
  } catch (err) {
    console.warn('⚠️ Supabase client initialization error, using server API:', err);
  }
}

export const supabase = client;
