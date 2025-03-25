import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Create a Supabase client configured for server usage
export function createServerClient() {
  const cookieStore = cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

// Function to use in server components and API routes
export async function getServerClient() {
  const supabase = createServerClient();
  return supabase;
} 