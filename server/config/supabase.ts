import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for public operations (uses RLS - Row Level Security)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for privileged operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
