import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabase-server';

// Get all media items
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseServer
      .from('media_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ media: data });
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
      .from('media_items')
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