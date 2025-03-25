'use client';

import { useState } from 'react';
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

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
    // If fallback also fails, we already have hasError set to true,
    // so we won't enter an infinite loop
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
} 