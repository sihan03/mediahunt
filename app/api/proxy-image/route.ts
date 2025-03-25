import { NextRequest, NextResponse } from 'next/server';

/**
 * This API route proxies image requests to external services
 * that might be blocked by CORS or other security restrictions.
 * Particularly useful for Google profile images.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  // Check if URL is provided and is valid
  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    // Validate the URL - only allow certain domains for security
    const url = new URL(imageUrl);
    const allowedDomains = [
      'googleusercontent.com',
      'googleapis.com',
      'google.com',
      'ggpht.com'
    ];

    // Check if the URL is from an allowed domain
    const isAllowedDomain = allowedDomains.some(domain => url.hostname.includes(domain));
    if (!isAllowedDomain) {
      return new NextResponse(`Domain not allowed: ${url.hostname}`, { status: 403 });
    }

    // Fetch the image
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.status}`, { status: response.status });
    }
    
    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      }
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return new NextResponse(`Error proxying image: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
  }
} 