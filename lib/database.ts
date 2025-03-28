import { supabase } from './supabase';
import { MediaSource } from './types';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase-types';

// Types that match our database schema
export type UserProfile = {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  registration_date: string;
  auth_provider?: string;
  last_login: string;
  updated_at: string;
};

export type UserVote = {
  id: string;
  user_id: string;
  media_id: string;
  vote_type: 'up' | 'down';
  created_at: string;
};

export type MediaItem = {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  image_url?: string;
  votes: number;
  created_at: string;
  updated_at: string;
};

// Type-safe database client
const typedSupabase = supabase as SupabaseClient<Database>;

// ========== Media Table Operations ==========

// Fetch all media items
export async function fetchAllMedia(signal?: AbortSignal): Promise<MediaItem[]> {
  // If the request is aborted before it starts, handle that case
  if (signal?.aborted) {
    throw new DOMException('The operation was aborted', 'AbortError');
  }

  // Create an abort controller if one wasn't provided
  const abortController = signal ? undefined : new AbortController();
  const effectiveSignal = signal || abortController?.signal;
  
  try {
    const { data, error } = await typedSupabase
      .from('media')
      .select('*')
      .order('votes', { ascending: false });
      
    if (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
    
    return data || [];
  } catch (err: any) {
    // If the request was aborted, convert to an AbortError
    if (signal?.aborted || err.message?.includes('abort')) {
      throw new DOMException('The operation was aborted', 'AbortError');
    }
    throw err;
  }
}

// Fetch media with user's vote status
export async function fetchMediaWithUserVotes(userId: string, signal?: AbortSignal): Promise<MediaSource[]> {
  // If the request is aborted before it starts, handle that case
  if (signal?.aborted) {
    throw new DOMException('The operation was aborted', 'AbortError');
  }

  try {
    // First get all media
    const { data: mediaData, error: mediaError } = await typedSupabase
      .from('media')
      .select('*')
      .order('votes', { ascending: false });
      
    if (mediaError) {
      console.error('Error fetching media:', mediaError);
      throw mediaError;
    }
    
    if (!mediaData || mediaData.length === 0) {
      return [];
    }
    
    // Check if request was aborted between queries
    if (signal?.aborted) {
      throw new DOMException('The operation was aborted', 'AbortError');
    }
    
    // Then get the user's votes
    const { data: voteData, error: voteError } = await typedSupabase
      .from('user_votes')
      .select('*')
      .eq('user_id', userId);
      
    if (voteError) {
      console.error('Error fetching user votes:', voteError);
      throw voteError;
    }
    
    // Map votes to media items
    const userVotesMap = new Map<string, 'up' | 'down'>();
    voteData?.forEach((vote: UserVote) => {
      userVotesMap.set(vote.media_id, vote.vote_type);
    });
    
    // Return combined data
    return mediaData.map(media => ({
      id: media.id,
      title: media.title,
      url: media.url,
      description: media.description,
      category: media.category,
      imageUrl: media.image_url || '',
      votes: media.votes,
      userVote: userVotesMap.get(media.id) || null
    }));
  } catch (err: any) {
    // If the request was aborted, convert to an AbortError
    if (signal?.aborted || err.message?.includes('abort')) {
      throw new DOMException('The operation was aborted', 'AbortError');
    }
    throw err;
  }
}

// Add new media item
export async function addMediaItem(mediaItem: Omit<MediaItem, 'id' | 'votes' | 'created_at' | 'updated_at'>): Promise<MediaItem> {
  const { data, error } = await typedSupabase
    .from('media')
    .insert({
      title: mediaItem.title,
      url: mediaItem.url,
      description: mediaItem.description,
      category: mediaItem.category,
      image_url: mediaItem.image_url
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding media item:', error);
    throw error;
  }
  
  return data;
}

// ========== User Votes Operations ==========

// Handle voting logic in the frontend code
export async function handleVote(userId: string, mediaId: string, voteType: 'up' | 'down'): Promise<void> {
  // First check if user has already voted
  const { data: existingVote, error: fetchError } = await typedSupabase
    .from('user_votes')
    .select('*')
    .eq('user_id', userId)
    .eq('media_id', mediaId)
    .maybeSingle();
    
  if (fetchError) {
    console.error('Error checking for existing vote:', fetchError);
    throw fetchError;
  }
  
  // Get current media item to know its vote count
  const { data: mediaItem, error: mediaError } = await typedSupabase
    .from('media')
    .select('votes')
    .eq('id', mediaId)
    .single();
    
  if (mediaError) {
    console.error('Error fetching media item:', mediaError);
    throw mediaError;
  }
  
  if (!mediaItem) {
    throw new Error('Media item not found');
  }
  
  let voteChange = 0;
  
  // 1. If the vote exists and is the same type, remove it
  if (existingVote && existingVote.vote_type === voteType) {
    const { error: deleteError } = await typedSupabase
      .from('user_votes')
      .delete()
      .eq('id', existingVote.id);
      
    if (deleteError) {
      console.error('Error removing vote:', deleteError);
      throw deleteError;
    }
    
    // Calculate vote change
    voteChange = voteType === 'up' ? -1 : 1;
  }
  // 2. If the vote exists but is different, update it
  else if (existingVote) {
    const { error: updateVoteError } = await typedSupabase
      .from('user_votes')
      .update({ vote_type: voteType })
      .eq('id', existingVote.id);
      
    if (updateVoteError) {
      console.error('Error updating vote:', updateVoteError);
      throw updateVoteError;
    }
    
    // Calculate vote change (2 points difference)
    voteChange = voteType === 'up' ? 2 : -2;
  }
  // 3. If no existing vote, insert a new one
  else {
    const { error: insertError } = await typedSupabase
      .from('user_votes')
      .insert({
        user_id: userId,
        media_id: mediaId,
        vote_type: voteType
      });
      
    if (insertError) {
      console.error('Error adding vote:', insertError);
      throw insertError;
    }
    
    // Calculate vote change
    voteChange = voteType === 'up' ? 1 : -1;
  }
  
  // Update the media item's vote count
  const { error: updateError } = await typedSupabase
    .from('media')
    .update({ votes: mediaItem.votes + voteChange })
    .eq('id', mediaId);
    
  if (updateError) {
    console.error('Error updating media votes:', updateError);
    throw updateError;
  }
}

// Get user's vote for a specific media item
export async function getUserVote(userId: string, mediaId: string): Promise<'up' | 'down' | null> {
  const { data, error } = await typedSupabase
    .from('user_votes')
    .select('vote_type')
    .eq('user_id', userId)
    .eq('media_id', mediaId)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching user vote:', error);
    throw error;
  }
  
  return data ? data.vote_type as 'up' | 'down' : null;
}

// ========== User Profiles Operations ==========

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await typedSupabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching user profile:', error);
    throw error;
  }
  
  return data;
}

// Create or update user profile
export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile> {
  const { data, error } = await typedSupabase
    .from('user_profiles')
    .upsert(profile)
    .select()
    .single();
    
  if (error) {
    console.error('Error upserting user profile:', error);
    throw error;
  }
  
  return data;
}

// This function should be called when a new user signs up
export async function createUserProfileOnSignUp(userId: string, username: string, authProvider: string, avatarUrl?: string): Promise<UserProfile> {
  const { data, error } = await typedSupabase
    .from('user_profiles')
    .insert({
      id: userId,
      username,
      display_name: username,
      avatar_url: avatarUrl,
      auth_provider: authProvider
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
  
  return data;
} 