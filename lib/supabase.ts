import { createClient } from '@supabase/supabase-js';

// Check if we're running on the server during build time
const isBuildTime = typeof window === 'undefined';

// Create a mock client for build/SSR or a real client for client-side
const createSupabaseClient = () => {
  // During build time/SSR, use a mock client that does nothing
  if (isBuildTime) {
    // Return a mock client that won't throw errors during build
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithOAuth: () => Promise.resolve({ data: {}, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
          order: () => Promise.resolve({ data: [], error: null }),
          insert: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
          upsert: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        }),
      }),
    };
  }

  // For client-side, use the real Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // Only create the real client if we have the credentials
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  
  // Fallback mock client for client-side if no credentials
  console.warn('Supabase credentials missing. Using mock client.');
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithOAuth: () => Promise.resolve({ data: {}, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  };
};

export const supabase = createSupabaseClient(); 