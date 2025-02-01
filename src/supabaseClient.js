import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('URL:', supabaseUrl); // Remove after debugging
console.log('KEY:', supabaseAnonKey); // Remove after debugging

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

