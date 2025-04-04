'use client';

import { useState, useEffect } from 'react';
import { supabase, MediaItem as SupabaseMediaItem } from '../lib/supabase';
import { getEmojiForType } from './useMediaIcon';
import { useAuth } from './useAuth';

// Define the MediaItem type for better type safety
export interface MediaItem {
  id: number;
  title: string;
  type: string;
  url: string;
  description: string;
  upvotes: number;
  downvotes: number;
  vote_count: number;
  comments?: number;
  icon: string;
}

export function useMediaData() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, redirectToSignIn } = useAuth();

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
          upvotes: item.upvotes,
          downvotes: item.downvotes,
          vote_count: item.vote_count,
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

  // Function to upvote a specific item
  const upvote = async (id: number) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      redirectToSignIn();
      return;
    }

    try {
      // Update the local state optimistically
      setMediaItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { 
            ...item, 
            upvotes: item.upvotes + 1,
            vote_count: item.vote_count + 1
          } : item
        )
      );

      // Update the upvote in the database
      const { error } = await supabase
        .from('media_items')
        .update({ upvotes: mediaItems.find(item => item.id === id)!.upvotes + 1 })
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Error upvoting:', err);
      // Revert the optimistic update if there was an error
      setMediaItems(prevItems => [...prevItems]);
    }
  };

  // Function to downvote
  const downvote = async (id: number) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      redirectToSignIn();
      return;
    }

    try {
      // Update the local state optimistically
      setMediaItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { 
            ...item, 
            downvotes: item.downvotes + 1,
            vote_count: item.vote_count - 1
          } : item
        )
      );

      // Update the downvote in the database
      const { error } = await supabase
        .from('media_items')
        .update({ downvotes: mediaItems.find(item => item.id === id)!.downvotes + 1 })
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Error downvoting:', err);
      // Revert the optimistic update if there was an error
      setMediaItems(prevItems => [...prevItems]);
    }
  };

  // Function to add a comment to a media item
  const addComment = async (id: number, content: string) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      redirectToSignIn();
      return;
    }

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
    upvote,
    downvote,
    addComment,
  };
} 