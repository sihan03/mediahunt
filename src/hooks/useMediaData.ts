'use client';

import { useState, useEffect } from 'react';
import { supabase, MediaItem as SupabaseMediaItem } from '../lib/supabase';
import { getEmojiForType } from './useMediaIcon';

// Define the MediaItem type for better type safety
export interface MediaItem {
  id: number;
  title: string;
  type: string;
  url: string;
  description: string;
  votes: number;
  comments?: number;
  icon: string;
}

// Type for comment count result
interface CommentCount {
  media_item_id: number;
  count: string;
}

export function useMediaData() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch media items from Supabase
        const { data: mediaItemsData, error: mediaItemsError } = await supabase
          .from('media_items')
          .select('*');
        
        if (mediaItemsError) {
          throw mediaItemsError;
        }

        // Fetch all comments to count them manually
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('media_item_id');

        if (commentsError) {
          throw commentsError;
        }

        // Count comments per media item
        const commentCounts = commentsData.reduce((acc: Record<number, number>, comment: { media_item_id: number }) => {
          acc[comment.media_item_id] = (acc[comment.media_item_id] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        // Transform data to match the MediaItem interface
        const transformedData: MediaItem[] = mediaItemsData.map((item: SupabaseMediaItem) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          url: item.url,
          description: item.description || '',
          votes: item.votes,
          comments: commentCounts[item.id] || 0,
          icon: item.icon || getEmojiForType(item.type)
        }));
        
        setMediaItems(transformedData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching media items:', err);
        setError('Failed to fetch media items');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to increment votes for a specific item
  const incrementVotes = async (id: number) => {
    try {
      // Update the local state optimistically
      setMediaItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, votes: item.votes + 1 } : item
        )
      );

      // Update the vote in the database
      const { error } = await supabase
        .from('media_items')
        .update({ votes: mediaItems.find(item => item.id === id)!.votes + 1 })
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Error incrementing votes:', err);
      // Revert the optimistic update if there was an error
      setMediaItems(prevItems => [...prevItems]);
    }
  };

  // Function to decrement votes
  const decrementVotes = async (id: number) => {
    try {
      const currentItem = mediaItems.find(item => item.id === id);
      if (!currentItem || currentItem.votes <= 0) return;

      // Update the local state optimistically
      setMediaItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, votes: item.votes - 1 } : item
        )
      );

      // Update the vote in the database
      const { error } = await supabase
        .from('media_items')
        .update({ votes: currentItem.votes - 1 })
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Error decrementing votes:', err);
      // Revert the optimistic update if there was an error
      setMediaItems(prevItems => [...prevItems]);
    }
  };

  // Function to add a comment
  const addComment = async (id: number, content: string) => {
    try {
      // Add the comment to the database
      const { error } = await supabase
        .from('comments')
        .insert({ media_item_id: id, content });

      if (error) {
        throw error;
      }

      // Update the local state
      setMediaItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, comments: (item.comments || 0) + 1 } : item
        )
      );
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return {
    mediaItems,
    isLoading,
    error,
    incrementVotes,
    decrementVotes,
    addComment,
  };
} 