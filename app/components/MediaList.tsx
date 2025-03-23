'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { fetchAllMedia, fetchMediaWithUserVotes, handleVote } from '../../lib/database';
import MediaCard from './MediaCard';
import { MediaSource, Category } from '../../lib/types';
import CategoryFilter from './CategoryFilter';

export default function MediaList() {
  const { user } = useAuth();
  const [mediaItems, setMediaItems] = useState<MediaSource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMedia() {
      setLoading(true);
      try {
        if (user) {
          // Fetch media with user vote status
          const media = await fetchMediaWithUserVotes(user.id);
          setMediaItems(media);
        } else {
          // Fetch media without user vote status
          const media = await fetchAllMedia();
          setMediaItems(media.map(item => ({
            id: item.id,
            title: item.title,
            url: item.url,
            description: item.description,
            category: item.category,
            imageUrl: item.image_url || '',
            votes: item.votes,
            userVote: null
          })));
        }
      } catch (err) {
        console.error('Error loading media:', err);
        setError('Failed to load media items');
      } finally {
        setLoading(false);
      }
    }

    loadMedia();
  }, [user]);

  // Filter media sources based on selected category
  const filteredMedia = selectedCategory === 'all'
    ? mediaItems
    : mediaItems.filter(item => item.category === selectedCategory);
  
  // Sort media by votes, descending
  const sortedMedia = [...filteredMedia].sort((a, b) => b.votes - a.votes);

  // Handle category filter change
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
  };

  // Handle voting
  const handleVoteClick = async (mediaId: string, voteType: 'up' | 'down') => {
    if (!user) {
      alert('You must be signed in to vote');
      return;
    }

    try {
      await handleVote(user.id, mediaId, voteType);
      
      // Refresh the media list
      const updatedMedia = await fetchMediaWithUserVotes(user.id);
      setMediaItems(updatedMedia);
    } catch (err) {
      console.error('Error voting:', err);
      setError('Failed to register your vote');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <>
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onChange={handleCategoryChange} 
      />
      
      {error && (
        <div className="text-red-500 p-4 mb-4 bg-red-50 rounded">{error}</div>
      )}
      
      <div className="mt-6 space-y-4">
        {sortedMedia.map(media => (
          <MediaCard 
            key={media.id} 
            mediaSource={media} 
            onVote={handleVoteClick} 
          />
        ))}
        
        {sortedMedia.length === 0 && (
          <div className="bg-white p-6 text-center rounded-lg shadow">
            <p className="text-gray-500">No media sources found for this category.</p>
          </div>
        )}
      </div>
    </>
  );
} 