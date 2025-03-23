'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Redirect to home page after successful sign-in
        router.push('/');
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Completing sign in...
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Please wait while we authenticate your account.
        </p>
      </div>
    </div>
  );
} 