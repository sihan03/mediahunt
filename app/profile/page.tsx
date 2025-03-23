'use client';

import Header from '../components/Header';
import ProfileEditor from '../components/ProfileEditor';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
          <ProfileEditor />
        </div>
      </div>
    </main>
  );
} 