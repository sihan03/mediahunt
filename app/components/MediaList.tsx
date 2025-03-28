'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { fetchAllMedia, fetchMediaWithUserVotes, handleVote } from '../../lib/api';
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
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;
    
    // Debounce the loading state to prevent flicker during quick auth state changes
    const loadingTimeoutId = setTimeout(() => {
      if (isMounted && mediaItems.length === 0) {
        setLoading(true);
      }
    }, 200);

    async function loadMedia() {
      try {
        if (user) {
          // Fetch media with user vote status using API
          const media = await fetchMediaWithUserVotes(user.id, signal);
          // Only update state if component is still mounted
          if (isMounted) setMediaItems(media);
        } else {
          // Fetch media without user vote status using API
          const media = await fetchAllMedia(signal);
          if (isMounted) setMediaItems(media);
        }
      } catch (err: any) {
        // Ignore AbortError as it's expected during cleanup
        if (isMounted && err.name !== 'AbortError') {
          console.error('Error loading media:', err);
          setError('Failed to load media items');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Add a small delay to prevent rapid refetching during tab switching
    const fetchTimeoutId = setTimeout(() => {
      loadMedia();
    }, 100);
    
    // Cleanup function to abort in-flight requests and prevent state updates after unmount
    return () => {
      clearTimeout(loadingTimeoutId);
      clearTimeout(fetchTimeoutId);
      isMounted = false;
      controller.abort();
    };
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