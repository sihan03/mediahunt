'use client';

import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import SafeImage from './SafeImage';
import SignOutButton from './SignOutButton';

export default function AuthButton() {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const handleSignIn = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirectTo: `${window.location.origin}/auth/callback`,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('Error signing in with Google:', data.error);
        alert('Error signing in with Google');
        return;
      }
      
      // Redirect to the OAuth URL provided by our API
      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // If user is signed in, show user avatar and dropdown
  if (user) {
    console.log('User metadata:', user.user_metadata);
    console.log('Avatar URL:', user.user_metadata?.avatar_url);
    
    return (
      <Menu as="div" className="relative inline-block text-left mr-3">
        <div>
          <Menu.Button className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {user.user_metadata?.avatar_url ? (
              <SafeImage 
                src={
                  // For Google images, use proxy endpoint directly to avoid CORS issues
                  user.user_metadata.avatar_url.includes('googleusercontent.com') 
                    ? `/api/proxy-image?url=${encodeURIComponent(user.user_metadata.avatar_url)}`
                    : user.user_metadata.avatar_url
                }
                alt={user.user_metadata?.full_name || 'User'} 
                className="w-full h-full rounded-full object-cover"
                width={40}
                height={40}
                unoptimized={true}
                fallbackSrc="/default-avatar.svg"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-lg font-medium">
                {user.email?.[0].toUpperCase() || '?'}
              </div>
            )}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <div className="px-4 py-3">
                <p className="text-sm">Signed in as</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.email}
                </p>
              </div>
              <hr />
              <Menu.Item>
                {({ active }: { active: boolean }) => (
                  <SignOutButton
                    className={active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                  />
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  }
  
  // If user is not signed in, show sign in button
  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="mr-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign in
      </button>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center h-16 w-16 bg-indigo-600 rounded-full text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Sign up on MediaHunt</h2>
              <p className="mt-2 text-gray-600">
                Join our community of friendly folks discovering and sharing the latest media in tech.
              </p>
            </div>
            
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Sign in with Google
            </button>
            
            <div className="text-center text-sm text-gray-500 mt-6">
              <p>We&apos;ll never post to any of your accounts without your permission.</p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 