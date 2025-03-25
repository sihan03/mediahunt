import { supabase } from '../supabase/client';
import { MediaSource } from '../types';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase/types';

// Types that match our database schema
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

// Fetch all media items
export async function fetchAllMedia(): Promise<MediaItem[]> {
  const { data, error } = await typedSupabase
    .from('media')
    .select('*')
    .order('votes', { ascending: false });
    
  if (error) {
    console.error('Error fetching media:', error);
    throw error;
  }
  
  return data || [];
}

// Fetch media with user's vote status
export async function fetchMediaWithUserVotes(userId: string): Promise<MediaSource[]> {
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
  voteData?.forEach((vote: any) => {
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