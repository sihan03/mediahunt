'use server';

import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export async function serverSignOut() {
  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // Create a Supabase client for server actions
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    }
  });
  
  // Sign out on server
  await supabase.auth.signOut();
  
  // Get cookie store and handle as async
  const cookieStore = await cookies();
  
  // Since Next.js App Router cookies() API is read-only and doesn't have getAll(),
  // we need to know the exact cookie names to delete. Here are common Supabase cookie names:
  const supabaseCookieNames = [
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token',
    '__session'
  ];
  
  // Delete known cookies
  for (const name of supabaseCookieNames) {
    cookieStore.delete(name);
  }
  
  // Redirect to home page
  redirect('/');
} 