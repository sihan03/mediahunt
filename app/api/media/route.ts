import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabase-server';

// Get all media items or media with user votes if userId is provided
export async function GET(request: NextRequest) {
  try {
    // Check for userId query parameter
    const userId = request.nextUrl.searchParams.get('userId');

    if (userId) {
      // First get all media
      const { data: mediaData, error: mediaError } = await supabaseServer
        .from('media')
        .select('*')
        .order('votes', { ascending: false });
        
      if (mediaError) {
        return NextResponse.json({ error: mediaError.message }, { status: 400 });
      }
      
      // Then get the user's votes
      const { data: voteData, error: voteError } = await supabaseServer
        .from('user_votes')
        .select('*')
        .eq('user_id', userId);
        
      if (voteError) {
        return NextResponse.json({ error: voteError.message }, { status: 400 });
      }
      
      // Map votes to media items
      const userVotesMap = new Map();
      voteData?.forEach((vote) => {
        userVotesMap.set(vote.media_id, vote.vote_type);
      });
      
      // Combine data
      const mediaWithVotes = mediaData.map(media => ({
        id: media.id,
        title: media.title,
        url: media.url,
        description: media.description,
        category: media.category,
        imageUrl: media.image_url || '',
        votes: media.votes,
        userVote: userVotesMap.get(media.id) || null
      }));
      
      return NextResponse.json({ media: mediaWithVotes });
    } else {
      // Just get all media
      const { data, error } = await supabaseServer
        .from('media')
        .select('*')
        .order('votes', { ascending: false });
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      
      // Transform to match frontend expectations
      const formattedMedia = data.map(media => ({
        id: media.id,
        title: media.title,
        url: media.url,
        description: media.description,
        category: media.category,
        imageUrl: media.image_url || '',
        votes: media.votes,
        userVote: null
      }));
      
      return NextResponse.json({ media: formattedMedia });
    }
  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Add a new media item
export async function POST(request: NextRequest) {
  try {
    const { data: sessionData } = await supabaseServer.auth.getSession();
    if (!sessionData.session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const userId = sessionData.session.user.id;
    const mediaData = await request.json();
    
    // Add user_id to the media item
    mediaData.user_id = userId;
    
    const { data, error } = await supabaseServer
      .from('media')
      .insert(mediaData)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ media: data });
  } catch (error) {
    console.error('Media creation error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 