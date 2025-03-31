'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Fetch the user once the component is mounted. Active fetch.
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    fetchUser();

    // Listen for changes in the user's authentication state.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Unsubscribe from the auth listener when the component is unmounted.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const redirectToSignIn = () => {
    router.push('/signin');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return {
    user,
    loading,
    redirectToSignIn,
    isAuthenticated,
  };
} 