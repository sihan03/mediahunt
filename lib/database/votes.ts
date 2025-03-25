import { supabase } from '../supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase/types';

// Types that match our database schema
export type UserVote = {
  id: string;
  user_id: string;
  media_id: string;
  vote_type: 'up' | 'down';
  created_at: string;
};

// Type-safe database client
const typedSupabase = supabase as SupabaseClient<Database>;

// Handle voting logic
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