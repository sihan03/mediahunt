'use client';

import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { addMediaItem } from '../../lib/api';
import { useRouter } from 'next/navigation';
import { Category } from '../../lib/types';

export default function AddMediaForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-sm">
        <p className="text-gray-700 text-center">You must be signed in to add media sources.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await addMediaItem({
        title,
        url,
        description,
        category,
        image_url: imageUrl
      });
      
      // Redirect to home page after successful submission
      router.push('/');
    } catch (err: unknown) {
      console.error('Error adding media:', err);
      setError(err instanceof Error ? err.message : 'Failed to add media item');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm" role="form" aria-label="add media">
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 animate-appear">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-[#d2d2d7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="url">
            URL *
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 border border-[#d2d2d7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="https://"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-[#d2d2d7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            rows={4}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full p-3 border border-[#d2d2d7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            required
          >
            <option value="">Select a category</option>
            <option value="news">News</option>
            <option value="tutorial">Tutorial</option>
            <option value="course">Course</option>
            <option value="podcast">Podcast</option>
            <option value="video">Video</option>
            <option value="blog">Blog</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="imageUrl">
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-3 border border-[#d2d2d7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="https://"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:shadow-md hover:scale-[1.01] transition-all duration-200 font-medium disabled:opacity-75"
        >
          {isLoading ? 'Adding...' : 'Add Media Source'}
        </button>
      </form>
    </div>
  );
} 