import { createClient } from '@supabase/supabase-js';

// This is for server-side operations only, not exposed to the browser
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export const supabaseServer = createClient(supabaseUrl, supabaseKey); 