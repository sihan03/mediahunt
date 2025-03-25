'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignOutPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function handleSignOut() {
      try {
        // 1. Sign out on client side to clear browser storage
        await supabase.auth.signOut();

        // 2. Call the signout API endpoint to clear server session
        const response = await fetch('/api/auth/signout', {
          method: 'POST',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to sign out');
        }

        // 3. Clear local storage manually just to be sure
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
        
        // 4. Set a small delay to ensure everything is cleared
        setTimeout(() => {
          // Redirect to home page
          window.location.href = '/';
        }, 500);
      } catch (err: any) {
        console.error('Sign out error:', err);
        setError(err.message || 'Failed to sign out');
      }
    }

    handleSignOut();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Signing Out</h1>
        
        {error ? (
          <div className="text-red-500 mb-4">
            <p>{error}</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Return to Home
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-600">Please wait, signing you out...</p>
          </div>
        )}
      </div>
    </div>
  );
} 