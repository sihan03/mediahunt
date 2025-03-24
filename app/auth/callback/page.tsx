'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  
  useEffect(() => {
    const exchangeCodeForSession = async () => {
      // Fetch session from our API route
      try {
        const response = await fetch('/api/auth');
        const { session, error } = await response.json();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        if (session) {
          // Redirect to home page after successful sign-in
          router.push('/');
        }
      } catch (error) {
        console.error('Error during auth callback:', error);
      }
    };
    
    exchangeCodeForSession();
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