// Utility functions

// Format date to a readable string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Get domain from URL
export function getDomain(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace('www.', '');
  } catch (error) {
    console.error('Invalid URL:', error);
    return '';
  }
}

// Validate URL format
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
} 