'use client';

import React, { useState } from 'react';
import { MediaSource } from '../../lib/data';
import CategoryIcon from './CategoryIcon';

interface MediaCardProps {
  mediaSource: MediaSource;
  onVote: (id: string, voteType: 'up' | 'down') => void;
}

export default function MediaCard({ mediaSource, onVote }: MediaCardProps) {
  const { id, title, url, description, imageUrl, category, votes, userVote } = mediaSource;
  const [imageError, setImageError] = useState(false);

  // Create placeholder URL based on category
  const placeholderImage = `/placeholder-${category}.svg`;
  const defaultPlaceholder = '/placeholder-default.svg';
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="flex p-4">
        <div className="mr-4 flex-shrink-0">
          <div className="h-16 w-16 relative rounded-md overflow-hidden border border-gray-200 shadow-sm">
            <img
              src={imageError ? placeholderImage : imageUrl}
              alt={title}
              className="object-cover h-full w-full"
              onError={(e) => {
                // If the placeholder also fails, use the default placeholder
                if (imageError) {
                  e.currentTarget.src = defaultPlaceholder;
                } else {
                  setImageError(true);
                }
              }}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-lg font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            {title}
          </a>
          <p className="mt-1 text-gray-500 text-sm">{description}</p>
          <div className="mt-2 flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <CategoryIcon category={category} className="h-3 w-3 mr-1" />
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center ml-4">
          <button 
            onClick={() => onVote(id, 'up')}
            className={`flex items-center justify-center h-7 w-7 rounded-md p-1 ${
              userVote === 'up' 
                ? 'text-white bg-green-500' 
                : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
            }`}
            aria-label="Upvote"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-900 my-1">{votes}</span>
          <button 
            onClick={() => onVote(id, 'down')}
            className={`flex items-center justify-center h-7 w-7 rounded-md p-1 ${
              userVote === 'down' 
                ? 'text-white bg-red-500' 
                : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
            }`}
            aria-label="Downvote"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 