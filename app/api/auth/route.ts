import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabase-server';

// Handle Google Sign-In request
export async function POST(request: NextRequest) {
  try {
    const { redirectTo } = await request.json();
    
    // Always use the provided redirectTo which comes from window.location.origin on the client
    // This handles dynamic ports in development automatically
    // Only fall back to environment variables if necessary
    const callbackUrl = redirectTo || `${request.nextUrl.origin}/auth/callback`;
    
    const { data, error } = await supabaseServer.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
      },
    });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Get the current session
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseServer.auth.getSession();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ session: data.session });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 