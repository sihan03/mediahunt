'use client';

import React from 'react';
import { 
  FaNewspaper, 
  FaBook, 
  FaYoutube, 
  FaPodcast, 
  FaGlobe,
  FaLayerGroup
} from 'react-icons/fa';

interface CategoryIconProps {
  category: string;
  className?: string;
}

export default function CategoryIcon({ category, className = "h-5 w-5" }: CategoryIconProps) {
  switch (category.toLowerCase()) {
    case 'all':
      return <FaLayerGroup className={className} />;
    case 'newsletter':
      return <FaNewspaper className={className} />;
    case 'publication':
      return <FaBook className={className} />;
    case 'youtube':
      return <FaYoutube className={className} />;
    case 'podcast':
      return <FaPodcast className={className} />;
    default:
      return <FaGlobe className={className} />;
  }
} 