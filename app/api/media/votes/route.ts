import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabase-server';

// Get user votes for authenticated user
export async function GET(request: NextRequest) {
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
    
    // Get the user's votes from database
    const { data, error } = await supabaseServer
      .from('user_votes')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ votes: data });
  } catch (error) {
    console.error('Error fetching user votes:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 