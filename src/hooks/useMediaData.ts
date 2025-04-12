'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { createClient } from '../lib/supabase/client';
import { MediaItem as SupabaseMediaItem } from '../lib/supabase';
import { getEmojiForType } from './useMediaIcon';
import { useAuth } from './useAuth';

// Define the UserVote type
interface UserVote {
  media_item_id: number;
  vote_type: 1 | -1;
}

// Define the MediaItem type for better type safety
export interface MediaItem extends Omit<SupabaseMediaItem, 'owner_id'> {
  comments: number; // Still a placeholder
  icon: string;
  currentUserVote?: 1 | -1 | null;
}

// Define RPC Parameter Types
type HandleVoteParams = { p_media_item_id: number; p_vote_type: 1 | -1 };
type RemoveVoteParams = { p_media_item_id: number };
type RpcParams = HandleVoteParams | RemoveVoteParams;

export function useMediaData() {
  const supabase = createClient();
  const { user, isAuthenticated, redirectToSignIn } = useAuth();
  const userId = user?.id;
  const [mutationError, setMutationError] = useState<string | null>(null); // For vote/comment errors

  // --- SWR Fetcher Logic ---
  const fetcher = useCallback(async ([_key, currentUserId]: [string, string | undefined]) => {
    console.log('Fetching media data with user ID:', currentUserId); // Add console log
    // Fetch media items from Supabase
    const { data: mediaItemsData, error: mediaItemsError } = await supabase
      .from('media_items')
      .select('*')
    
    if (mediaItemsError) {
      console.error('Error fetching media items:', mediaItemsError);
      throw mediaItemsError;
    }

    // Fetch comments count (simplified - consider a view or function for performance)
    const commentCount = 0; // Placeholder

    // Fetch user's votes IF authenticated
    let userVotes: UserVote[] = [];
    if (currentUserId) {
      const { data: userVotesData, error: userVotesError } = await supabase
        .from('user_votes')
        .select('media_item_id, vote_type')
        .eq('user_id', currentUserId);

      if (userVotesError) {
        console.error('Error fetching user votes:', userVotesError);
        // Decide if you want to throw or just continue without votes
        // throw userVotesError; 
      } else {
        userVotes = userVotesData || [];
      }
    }

    const userVotesMap = userVotes.reduce((acc, vote) => {
      acc[vote.media_item_id] = vote.vote_type;
      return acc;
    }, {} as Record<number, 1 | -1>);

    // Transform data
    const transformedData: MediaItem[] = (mediaItemsData || []).map((item): MediaItem => ({
      id: item.id,
      title: item.title,
      type: item.type,
      url: item.url,
      description: item.description || '',
      upvotes: item.upvotes,
      downvotes: item.downvotes,
      vote_count: item.vote_count,
      comments: commentCount, // Use placeholder
      icon: item.icon || getEmojiForType(item.type),
      created_at: item.created_at,
      updated_at: item.updated_at,
      currentUserVote: userVotesMap[item.id] || null,
    }));
    
    return transformedData;
  }, [supabase]); // supabase client is stable, no need for user dependency here

  // --- SWR Hook Usage ---
  const swrKey = userId ? ['media_items', userId] : ['media_items', null]; // Key changes based on auth state
  const { 
    data: mediaItems = [], // Default to empty array
    error: fetchError, // Renamed to avoid conflict
    isLoading, 
    mutate 
  } = useSWR<MediaItem[]>(
    swrKey, // Unique key for the data, includes userId
    fetcher,
    {
      revalidateOnFocus: false, // Standard SWR behavior
      // Add error handling specific to fetching
      onError: (err) => {
        console.error("SWR fetch error:", err);
        // Optionally set a specific fetch error state if needed differently from mutationError
      }
    }
  );

  // --- Mutation Logic (Voting) ---
  const handleVote = useCallback(async (id: number, newVoteType: 1 | -1) => {
    if (!isAuthenticated()) {
      redirectToSignIn();
      return;
    }
    if (!mediaItems) return; // Should not happen with default value

    setMutationError(null); // Clear previous mutation errors

    const itemIndex = mediaItems.findIndex(item => item.id === id);
    if (itemIndex === -1) return;

    const item = mediaItems[itemIndex];
    const currentVote = item.currentUserVote;

    let action: 'handle_vote' | 'remove_vote';
    let params: RpcParams;
    let optimisticData: MediaItem[];

    if (currentVote === newVoteType) {
      // --- Optimistic Remove Vote ---
      action = 'remove_vote';
      params = { p_media_item_id: id } as RemoveVoteParams;
      optimisticData = mediaItems.map(prevItem =>
        prevItem.id === id ? {
          ...prevItem,
          upvotes: prevItem.upvotes - (newVoteType === 1 ? 1 : 0),
          downvotes: prevItem.downvotes - (newVoteType === -1 ? 1 : 0),
          vote_count: prevItem.vote_count - newVoteType,
          currentUserVote: null
        } : prevItem
      );
    } else {
      // --- Optimistic Handle Vote (Add or Change) ---
      action = 'handle_vote';
      params = { p_media_item_id: id, p_vote_type: newVoteType } as HandleVoteParams;
      optimisticData = mediaItems.map(prevItem =>
        prevItem.id === id ? {
          ...prevItem,
          // Adjust counts based on previous vote state
          upvotes: prevItem.upvotes + (newVoteType === 1 ? 1 : 0) - (currentVote === 1 ? 1 : 0),
          downvotes: prevItem.downvotes + (newVoteType === -1 ? 1 : 0) - (currentVote === -1 ? 1 : 0),
          // Recalculate vote_count based on new up/down votes
          vote_count: (prevItem.upvotes + (newVoteType === 1 ? 1 : 0) - (currentVote === 1 ? 1 : 0)) - 
                       (prevItem.downvotes + (newVoteType === -1 ? 1 : 0) - (currentVote === -1 ? 1 : 0)),
          currentUserVote: newVoteType
        } : prevItem
      );
    }

    // Perform Optimistic Update
    try {
      await mutate(optimisticData, {
        optimisticData: optimisticData, // Provide the calculated optimistic data
        rollbackOnError: true, // Automatically rollback on API error
        populateCache: true,   // Update the cache immediately
        revalidate: false      // Don't revalidate yet, wait for RPC call
      });

      // Perform API Call
      const { error: rpcError } = await supabase.rpc(action, params);

      if (rpcError) {
        console.error(`Error calling RPC ${action}:`, rpcError);
        throw rpcError; // This will trigger the rollbackOnError
      }

      // Optional: Explicitly revalidate after successful RPC if needed, 
      // but optimistic update often suffices. Consider if real-time counts matter.
      // mutate(); // Revalidates the SWR key

    } catch (err: unknown) {
      let errorMessage = `Failed to ${action === 'remove_vote' ? 'remove' : 'cast'} vote.`;
      if (err instanceof Error) {
        errorMessage += ` Error: ${err.message}`;
      }
      console.error(errorMessage, err);
      setMutationError(errorMessage);
      // SWR handles rollback automatically because rollbackOnError is true
    }
  }, [isAuthenticated, mediaItems, mutate, redirectToSignIn, supabase]);


  // --- Mutation Logic (Adding Comment) ---
  const addComment = useCallback(async (id: number, content: string) => {
    if (!isAuthenticated() || !userId) {
      redirectToSignIn();
      return;
    }
    if (!mediaItems) return;

    setMutationError(null);

    // Optimistic Update (Placeholder: Increment local count. Ideally re-fetch or get new count)
    const optimisticData = mediaItems.map(item =>
      item.id === id ? { ...item, comments: (item.comments || 0) + 1 } : item
    );
    
    try {
       await mutate(optimisticData, {
         optimisticData: optimisticData,
         rollbackOnError: true,
         populateCache: true,
         revalidate: false // Don't refetch list just for a comment count placeholder
       });

      // API Call
      const { error } = await supabase
        .from('comments')
        .insert({ media_item_id: id, content: content, user_id: userId });

      if (error) {
         if (error.code === '42501') { 
           throw new Error("You don't have permission to add this comment. Ensure you are logged in.");
         }
         throw error;
      }
      
      // If using real comment counts, you might revalidate here or just rely
      // on the optimistic update + future revalidations.
      // mutate(); // Revalidate the list if comment count affects it directly

    } catch (err: unknown) {
      let errorMessage = 'Failed to add comment.';
      if (err instanceof Error) {
          errorMessage += ` Error: ${err.message}`;
      }
      console.error(errorMessage, err);
      setMutationError(errorMessage);
      // SWR handles rollback for the comment count placeholder if needed
    }
  }, [isAuthenticated, mediaItems, mutate, redirectToSignIn, supabase, userId]);


  // Specific upvote/downvote functions calling the handler
  const upvote = useCallback((id: number) => handleVote(id, 1), [handleVote]);
  const downvote = useCallback((id: number) => handleVote(id, -1), [handleVote]);

  // --- Return Values ---
  return {
    mediaItems, // Data from SWR
    isLoading,  // Loading state from SWR
    error: fetchError || mutationError, // Combine fetch and mutation errors (or handle separately)
    upvote,
    downvote,
    addComment,
    mutate, // Expose mutate directly if needed by the component
  };
} 