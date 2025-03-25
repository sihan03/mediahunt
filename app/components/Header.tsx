'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuthButton from './AuthButton';
import { useAuth } from '../../lib/AuthContext';
import { HiPlusCircle } from 'react-icons/hi';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white backdrop-blur-md bg-opacity-80 sticky top-0 z-10 shadow-sm border-b border-[#ebebeb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <div className="flex items-center justify-center h-10 w-10 overflow-hidden rounded-lg mr-3 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/icon.png"
                alt="MediaHunt Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-gray-900">
                MediaHunt
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Discover and vote for the best AI media sources
              </p>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <AuthButton />
            {user && (
              <>
                <Link 
                  href="/add" 
                  className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-full shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md"
                >
                  <HiPlusCircle className="h-5 w-5" />
                  Submit
                </Link>
                <Link 
                  href="/profile" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Profile
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 