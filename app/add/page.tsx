'use client';

import Header from '../components/Header';
import AddMediaForm from '../components/AddMediaForm';

export default function AddPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <Header />
      <div className="max-w-2xl mx-auto py-10 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-3xl font-medium tracking-tight mb-8 text-center">Add New Media Source</h1>
          <AddMediaForm />
        </div>
      </div>
    </main>
  );
} 