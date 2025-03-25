import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabase-server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get cookies to find Supabase session cookies
    const cookieStore = cookies();
    
    // Sign out on the server
    const { error } = await supabaseServer.auth.signOut({
      scope: 'global'  // This will sign out from all devices
    });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    // Create the response to return
    const response = NextResponse.json({ success: true });
    
    // Clear all Supabase related cookies
    // Next.js App Router doesn't let us directly modify response cookies in an elegant way,
    // but Supabase should clear its own cookies via the server-side signOut
    
    return response;
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 