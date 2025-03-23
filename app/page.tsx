'use client';

import Header from './components/Header';
import MediaList from './components/MediaList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <MediaList />
        </div>
      </div>
    </main>
  );
}
