'use client';

import React from 'react';
import Image from 'next/image';
import AuthButton from './AuthButton';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-10 w-10 overflow-hidden rounded-md mr-3">
              <Image
                src="/icon.png"
                alt="MediaHunt Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                MediaHunt
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Discover and vote for the best AI media sources
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <AuthButton />
            <button 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit New Source
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 