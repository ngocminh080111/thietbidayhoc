// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// SUPABASE ADMIN CLIENT CONFIGURATION
// ==============================================================================
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  if (!supabaseAdmin) {
    try {
      supabaseAdmin = createClient(url, key, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      console.log('✅ Supabase Admin client connected successfully');
    } catch (err) {
      console.warn('⚠️ Supabase connection warning, falling back to database store:', err);
      return null;
    }
  }

  return supabaseAdmin;
}
