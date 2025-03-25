'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

/**
 * A wrapper around Next.js Image component that handles loading errors
 * by providing a fallback image and a more graceful degradation
 */
export default function SafeImage({ 
  src, 
  alt, 
  fallbackSrc = '/placeholder-default.svg',
  ...props 
}: SafeImageProps) {
  // Use fallback immediately if src is empty, undefined or null
  const [imgSrc, setImgSrc] = useState(src && src !== '' ? src : fallbackSrc);
  const [hasError, setHasError] = useState(!src || src === '');

  // Reset state if src changes (e.g. user logs in/out)
  useEffect(() => {
    if (src && src !== '') {
      setImgSrc(src);
      setHasError(false);
    } else {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  }, [src, fallbackSrc]);

  // For Google images, try to use proxy if direct loading fails
  const handleError = () => {
    if (!hasError) {
      // Check if it's a Google profile image
      const isGoogleImage = typeof imgSrc === 'string' && 
        (imgSrc.includes('googleusercontent.com') || imgSrc.includes('googleapis.com'));
      
      if (isGoogleImage && imgSrc === src) {
        // For Google images, try our proxy endpoint
        console.log('Using proxy for Google image');
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imgSrc)}`;
        setImgSrc(proxyUrl);
      } else {
        // Use the fallback for non-Google images or if the proxy also failed
        console.log('Using fallback image');
        setImgSrc(fallbackSrc);
        setHasError(true);
      }
    }
  };

  // We need to use unoptimized for external images that Next.js can't optimize
  const isUnoptimized = props.unoptimized || 
    (typeof imgSrc === 'string' && imgSrc.startsWith('http'));

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      unoptimized={isUnoptimized}
    />
  );
} 