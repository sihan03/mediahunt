'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

// Separate client component that uses useSearchParams
function AuthCallbackClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const searchParams = useSearchParams();
  
  const addDebugLog = (message: string) => {
    console.log(`[Auth Debug]: ${message}`);
    setDebugInfo(prev => [...prev, message]);
  };
  
  useEffect(() => {
    // Set a global timeout to prevent indefinite loading
    const timeoutId = setTimeout(() => {
      setError('Authentication timed out after 15 seconds. Please try again.');
      addDebugLog('Auth process timed out after 15 seconds');
    }, 15000);
    
    // Get the hash fragment from the URL which contains the auth token info
    const handleCallback = async () => {
      try {
        addDebugLog('Auth callback handler started');
        addDebugLog(`URL hash: ${window.location.hash ? 'Present' : 'Not present'}`);
        addDebugLog(`Query params: ${searchParams.has('code') ? 'Code present' : 'No code'}`);
        
        // Check if we have a session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          addDebugLog(`Session check error: ${sessionError.message}`);
        }

        if (session) {
          addDebugLog('Session found, redirecting to home');
          console.log('Session found, redirecting to home');
          router.push('/');
          clearTimeout(timeoutId);
          return;
        }

        addDebugLog('No session found, will try to exchange auth code');

        // No session, try to exchange the auth code for a session
        // The hash fragment might contain auth response (Supabase client handles this)
        const initialSessionResult = await supabase.auth.getSession();
        addDebugLog(`Initial getSession result: ${initialSessionResult.error ? 'Error: ' + initialSessionResult.error.message : 'No error'}`);
        
        // The auth callback appends a '#' to the URL with session info
        // Handle both cases - when it's in hash or search params
        if (window.location.hash || searchParams.has('code')) {
          addDebugLog('Processing auth callback...');
          
          // This forces the client to process the auth response
          const { error: authError } = await supabase.auth.getSession();
          
          if (authError) {
            addDebugLog(`Auth processing error: ${authError.message}`);
            throw authError;
          }
          
          // Check if we have a session after processing the auth response
          const { data: { session: newSession } } = await supabase.auth.getSession();
          
          if (newSession) {
            addDebugLog('Authentication successful, session created');
          } else {
            addDebugLog('No session after auth processing');
          }
          
          // Add a delay before redirecting to allow auth state to update
          addDebugLog('Setting redirect timeout');
          setTimeout(() => {
            addDebugLog('Redirecting to home page');
            router.push('/');
          }, 1000);
          
          // Clear the timeout since auth completed
          clearTimeout(timeoutId);
        } else {
          addDebugLog('No auth code or hash fragment found in URL');
          setError('No authentication data found. Please try signing in again.');
        }
      } catch (err: any) {
        // Enhanced error logging
        const errorMessage = err.message || 'Failed to sign in';
        const errorDetails = err.stack || JSON.stringify(err);
        console.error('Error during auth callback:', errorMessage);
        console.error('Error details:', errorDetails);
        addDebugLog(`Auth error: ${errorMessage}`);
        setError(errorMessage);
        
        // Clear timeout since we've encountered an error
        clearTimeout(timeoutId);
      }
    };

    handleCallback();
    
    // Cleanup the timeout on unmount
    return () => clearTimeout(timeoutId);
  }, [router, searchParams]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
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
            
            {/* Debug information section (collapsible in production) */}
            <div className="mt-4 border-t pt-4">
              <details>
                <summary className="cursor-pointer text-sm text-gray-600">Debug Information</summary>
                <div className="mt-2 text-xs font-mono bg-gray-100 p-2 rounded max-h-48 overflow-auto">
                  {debugInfo.map((log, i) => (
                    <div key={i} className="mb-1">{log}</div>
                  ))}
                </div>
              </details>
            </div>
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
            
            {/* Debug information section (collapsible) */}
            <div className="mt-4 border-t pt-4">
              <details>
                <summary className="cursor-pointer text-sm text-gray-600">Debug Information</summary>
                <div className="mt-2 text-xs font-mono bg-gray-100 p-2 rounded max-h-48 overflow-auto">
                  {debugInfo.map((log, i) => (
                    <div key={i} className="mb-1">{log}</div>
                  ))}
                </div>
              </details>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Loading...
          </h2>
        </div>
      </div>
    }>
      <AuthCallbackClient />
    </Suspense>
  );
} 