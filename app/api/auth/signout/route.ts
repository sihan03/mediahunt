import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { error } = await supabaseServer.auth.signOut();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 