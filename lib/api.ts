import { MediaSource, Category } from './types';

// API service functions for server-side operations

// Fetch all media items (unauthenticated)
export async function fetchAllMedia(signal?: AbortSignal): Promise<MediaSource[]> {
  try {
    const response = await fetch('/api/media', { signal });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.media;
  } catch (err: any) {
    // Handle aborted requests and other errors
    if (signal?.aborted || err.name === 'AbortError') {
      throw new DOMException('The operation was aborted', 'AbortError');
    }
    throw err;
  }
}

// Fetch media with user votes (authenticated)
export async function fetchMediaWithUserVotes(userId: string, signal?: AbortSignal): Promise<MediaSource[]> {
  try {
    const response = await fetch(`/api/media?userId=${userId}`, { signal });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.media;
  } catch (err: any) {
    // Handle aborted requests and other errors
    if (signal?.aborted || err.name === 'AbortError') {
      throw new DOMException('The operation was aborted', 'AbortError');
    }
    throw err;
  }
}

// Handle voting on media
export async function handleVote(userId: string, mediaId: string, voteType: 'up' | 'down'): Promise<void> {
  try {
    const response = await fetch('/api/media/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mediaId, voteType }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
  } catch (err) {
    console.error('Vote error:', err);
    throw err;
  }
}

// Add new media item
export async function addMediaItem(
  mediaItem: {
    title: string;
    url: string;
    description: string;
    category: Category;
    image_url?: string;
  }
): Promise<any> {
  try {
    const response = await fetch('/api/media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mediaItem),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.media;
  } catch (err) {
    console.error('Add media error:', err);
    throw err;
  }
} 