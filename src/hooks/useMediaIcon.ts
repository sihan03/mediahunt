'use client';

// Helper function to get emoji based on media type
export function getEmojiForType(type: string): string {
  switch (type.toLowerCase()) {
    case 'youtube':
      return '📺';
    case 'publication':
      return '📰';
    case 'newsletter':
      return '📧';
    case 'podcast':
      return '🎙️';
    case 'blog':
      return '✍️';
    default:
      return '🤖';
  }
} 