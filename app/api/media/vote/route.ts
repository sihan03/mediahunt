import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabase-server';

// Handle voting on media items
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const { data: sessionData } = await supabaseServer.auth.getSession();
    if (!sessionData.session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get the user ID from the session
    const userId = sessionData.session.user.id;
    
    // Get vote data from request
    const { mediaId, voteType } = await request.json();
    
    if (!mediaId || !voteType || (voteType !== 'up' && voteType !== 'down')) {
      return NextResponse.json(
        { error: 'Invalid vote data' },
        { status: 400 }
      );
    }
    
    // 1. Check if the user has already voted on this media
    const { data: existingVote, error: fetchError } = await supabaseServer
      .from('user_votes')
      .select('*')
      .eq('user_id', userId)
      .eq('media_id', mediaId)
      .maybeSingle();
      
    if (fetchError) {
      return NextResponse.json(
        { error: 'Error checking for existing vote' },
        { status: 500 }
      );
    }
    
    // 2. Get current media item to know its vote count
    const { data: mediaItem, error: mediaError } = await supabaseServer
      .from('media')
      .select('votes')
      .eq('id', mediaId)
      .single();
      
    if (mediaError || !mediaItem) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      );
    }
    
    let voteChange = 0;
    
    // 3. Process vote based on existing vote status
    if (existingVote && existingVote.vote_type === voteType) {
      // If the vote exists and is the same type, remove it
      const { error: deleteError } = await supabaseServer
        .from('user_votes')
        .delete()
        .eq('id', existingVote.id);
        
      if (deleteError) {
        return NextResponse.json(
          { error: 'Error removing vote' },
          { status: 500 }
        );
      }
      
      // Calculate vote change
      voteChange = voteType === 'up' ? -1 : 1;
    } else if (existingVote) {
      // If the vote exists but is different, update it
      const { error: updateVoteError } = await supabaseServer
        .from('user_votes')
        .update({ vote_type: voteType })
        .eq('id', existingVote.id);
        
      if (updateVoteError) {
        return NextResponse.json(
          { error: 'Error updating vote' },
          { status: 500 }
        );
      }
      
      // Calculate vote change (2 points difference)
      voteChange = voteType === 'up' ? 2 : -2;
    } else {
      // If no existing vote, insert a new one
      const { error: insertError } = await supabaseServer
        .from('user_votes')
        .insert({
          user_id: userId,
          media_id: mediaId,
          vote_type: voteType
        });
        
      if (insertError) {
        return NextResponse.json(
          { error: 'Error adding vote' },
          { status: 500 }
        );
      }
      
      // Calculate vote change
      voteChange = voteType === 'up' ? 1 : -1;
    }
    
    // 4. Update the media item's vote count
    const { error: updateError } = await supabaseServer
      .from('media')
      .update({ votes: mediaItem.votes + voteChange })
      .eq('id', mediaId);
      
    if (updateError) {
      return NextResponse.json(
        { error: 'Error updating media vote count' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, voteChange });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 