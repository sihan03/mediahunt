import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabase-server';

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const { data: sessionData } = await supabaseServer.auth.getSession();
    if (!sessionData.session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const userId = sessionData.session.user.id;
    
    const { data, error } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function POST(request: NextRequest) {
  try {
    const { data: sessionData } = await supabaseServer.auth.getSession();
    if (!sessionData.session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const userId = sessionData.session.user.id;
    const profileData = await request.json();
    
    // Ensure the user can only update their own profile
    if (profileData.id && profileData.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Add or override id with authenticated user's id
    profileData.id = userId;
    
    const { data, error } = await supabaseServer
      .from('profiles')
      .upsert(profileData)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 