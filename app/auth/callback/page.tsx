'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get the hash fragment from the URL which contains the auth token info
    const handleCallback = async () => {
      try {
        // Check if we have a session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          console.log('Session found, redirecting to home');
          router.push('/');
          return;
        }

        // No session, try to exchange the auth code for a session
        // The hash fragment might contain auth response (Supabase client handles this)
        await supabase.auth.getSession();
        
        // The auth callback appends a '#' to the URL with session info
        // Handle both cases - when it's in hash or search params
        if (window.location.hash || searchParams.has('code')) {
          console.log('Processing auth callback...');
          
          // This forces the client to process the auth response
          const { error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          // Add a delay before redirecting to allow auth state to update
          setTimeout(() => {
            router.push('/');
          }, 1000);
        }
      } catch (err: any) {
        console.error('Error during auth callback:', err);
        setError(err.message || 'Failed to sign in');
      }
    };

    handleCallback();
  }, [router, searchParams]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        {error ? (
          <>
            <div className="text-red-500 mb-4">
              <p className="font-bold">Authentication Error</p>
              <p>{error}</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Return to Home
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900">
              Completing sign in...
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Please wait while we authenticate your account.
            </p>
          </>
        )}
      </div>
    </div>
  );
} 