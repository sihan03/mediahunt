'use client';

import Header from '../components/Header';
import AddMediaForm from '../components/AddMediaForm';

export default function AddPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-bold mb-6">Add New Media Source</h1>
          <AddMediaForm />
        </div>
      </div>
    </main>
  );
} 