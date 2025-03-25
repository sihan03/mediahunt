'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignOutButton({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    setIsLoading(true);
    // Navigate to our dedicated sign-out page that handles the process properly
    router.push('/auth/signout');
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={`block w-full px-4 py-2 text-left text-sm ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      } ${className || ''}`}
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </button>
  );
} 