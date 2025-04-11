'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, MediaItem as SupabaseMediaItem } from '../lib/supabase';
import { getEmojiForType } from './useMediaIcon';
import { useAuth } from './useAuth';

// Define the UserVote type
interface UserVote {
  media_item_id: number;
  vote_type: 1 | -1;
}

// Define the MediaItem type for better type safety
export interface MediaItem extends Omit<SupabaseMediaItem, 'owner_id'> {
  comments: number;
  icon: string;
  currentUserVote?: 1 | -1 | null;
}

// Define RPC Parameter Types
type HandleVoteParams = { p_media_item_id: number; p_vote_type: 1 | -1 };
type RemoveVoteParams = { p_media_item_id: number };
type RpcParams = HandleVoteParams | RemoveVoteParams;

export function useMediaData() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, redirectToSignIn } = useAuth();

  // Fetch data including user's votes
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch media items from Supabase
      const { data: mediaItemsData, error: mediaItemsError } = await supabase
        .from('media_items')
        .select('*');
      
      if (mediaItemsError) {
        throw mediaItemsError;
      }

      // Fetch comments count (simplified - consider a view or function for performance)
      // NOTE: Adjust this logic if you need an accurate live comment count.
      // Using head: true gives total count but doesn't help with per-item count easily here.
      // A separate query or database view/function might be better.
      const commentCount = 0; // Placeholder - Fetching per-item count efficiently needs review

      // Fetch user's votes IF authenticated
      let userVotes: UserVote[] = [];
      const userId = user?.id;

      if (userId) {
        const { data: userVotesData, error: userVotesError } = await supabase
          .from('user_votes')
          .select('media_item_id, vote_type')
          .eq('user_id', userId);

        if (userVotesError) throw userVotesError;
        userVotes = userVotesData || [];
      }

      const userVotesMap = userVotes.reduce((acc, vote) => {
        acc[vote.media_item_id] = vote.vote_type;
        return acc;
      }, {} as Record<number, 1 | -1>);

      // Transform data
      const transformedData: MediaItem[] = mediaItemsData.map((item): MediaItem => ({
        id: item.id,
        title: item.title,
        type: item.type,
        url: item.url,
        description: item.description || '',
        upvotes: item.upvotes,
        downvotes: item.downvotes,
        vote_count: item.vote_count,
        comments: commentCount, // Use placeholder or implement better count fetching
        icon: item.icon || getEmojiForType(item.type),
        created_at: item.created_at,
        updated_at: item.updated_at,
        currentUserVote: userVotesMap[item.id] || null,
      }));
      
      setMediaItems(transformedData);
    } catch (err: unknown) {
      // Add type check before accessing properties
      let errorMessage = 'An unknown error occurred while fetching data';
      if (err instanceof Error) {
          errorMessage = err.message;
      } else if (typeof err === 'string') {
          errorMessage = err;
      }
      console.error('Error fetching media items:', err);
      setError(`Failed to fetch media items: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // useEffect should be at the top level of the hook
  useEffect(() => {
    fetchData();
    // Setup realtime subscriptions if needed here
  }, [fetchData]); // Correct dependency

  // Combined function to handle voting (upvote, downvote, remove vote)
  const handleVote = async (id: number, newVoteType: 1 | -1) => {
    if (!isAuthenticated()) {
      redirectToSignIn();
      return;
    }

    const originalItems = [...mediaItems];
    const itemIndex = mediaItems.findIndex(item => item.id === id);
    if (itemIndex === -1) return;

    const item = mediaItems[itemIndex];
    const currentVote = item.currentUserVote;

    let optimisticUpvotes = item.upvotes;
    let optimisticDownvotes = item.downvotes;
    let optimisticCurrentUserVote: 1 | -1 | null = item.currentUserVote ?? null;

    let action: 'handle_vote' | 'remove_vote' | null = null;
    let params: RpcParams | null = null;

    if (currentVote === newVoteType) {
      action = 'remove_vote';
      params = { p_media_item_id: id } as RemoveVoteParams;
      optimisticCurrentUserVote = null;
      if (newVoteType === 1) optimisticUpvotes--;
      else optimisticDownvotes--;
    } else {
      action = 'handle_vote';
      params = { p_media_item_id: id, p_vote_type: newVoteType } as HandleVoteParams;
      optimisticCurrentUserVote = newVoteType;
      if (newVoteType === 1) {
        optimisticUpvotes++;
        if (currentVote === -1) optimisticDownvotes--;
      } else { 
        optimisticDownvotes++;
        if (currentVote === 1) optimisticUpvotes--;
      }
    }

    setMediaItems(prevItems =>
      prevItems.map(prevItem =>
        prevItem.id === id ? {
          ...prevItem,
          upvotes: optimisticUpvotes,
          downvotes: optimisticDownvotes,
          vote_count: optimisticUpvotes - optimisticDownvotes,
          currentUserVote: optimisticCurrentUserVote
        } : prevItem
      )
    );

    try {
      if (!action) return;
      const { error: rpcError } = await supabase.rpc(action, params);
      if (rpcError) {
        throw rpcError;
      }
    } catch (err: unknown) {
      // Add type check before accessing properties
      let errorMessage = 'An unknown error occurred while voting';
      if (err instanceof Error) {
          errorMessage = err.message;
      } else if (typeof err === 'string') {
         errorMessage = err;
      }
      const actionDescription = action === 'remove_vote' ? 'removing' : 'handling';
      console.error(`Error ${actionDescription} vote:`, err);
      setError(`Failed to ${action === 'remove_vote' ? 'remove' : 'cast'} vote: ${errorMessage}`);
      setMediaItems(originalItems);
    }
  };

  // Specific upvote/downvote functions calling the handler
  const upvote = (id: number) => handleVote(id, 1);
  const downvote = (id: number) => handleVote(id, -1);

  // Function to add a comment to a media item
  const addComment = async (id: number, content: string) => {
    if (!isAuthenticated() || !user?.id) {
      redirectToSignIn();
      return;
    }

    const userId = user.id;
    const originalItems = [...mediaItems];

    setMediaItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, comments: (item.comments || 0) + 1 } : item
      )
    );

    try {
      const { error } = await supabase
        .from('comments')
        .insert({ media_item_id: id, content: content, user_id: userId });

      if (error) {
        if (error.code === '42501') { 
           throw new Error("You don't have permission to add this comment. Ensure you are logged in.");
        }
         throw error;
      }
    } catch (err: unknown) {
      // Add type check before accessing properties
      let errorMessage = 'An unknown error occurred while adding comment';
      if (err instanceof Error) {
          errorMessage = err.message;
      } else if (typeof err === 'string') {
          errorMessage = err;
      }
      console.error('Error adding comment:', err);
      setError(`Failed to add comment: ${errorMessage}`);
      setMediaItems(originalItems);
    }
  };

  // Return statement for the hook
  return {
    mediaItems,
    isLoading,
    error,
    upvote,
    downvote,
    addComment,
  }; // Ensure this closing brace is correct
} 