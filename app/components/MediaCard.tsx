'use client';

import React from 'react';
import { MediaSource } from '../../lib/types';
import CategoryIcon from './CategoryIcon';
import SafeImage from './SafeImage';

interface MediaCardProps {
  mediaSource: MediaSource;
  onVote: (id: string, voteType: 'up' | 'down') => void;
}

export default function MediaCard({ mediaSource, onVote }: MediaCardProps) {
  const { id, title, url, description, imageUrl, category, votes, userVote } = mediaSource;

  return (
    <div className="apple-card hover:translate-y-[-2px] overflow-hidden">
      <div className="flex items-start p-5">
        <div className="flex-shrink-0 mr-5">
          <div className="bg-gray-100 rounded-lg h-20 w-20 overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              <SafeImage
                src={imageUrl}
                alt={title}
                height={80}
                width={80}
                className="object-cover"
              />
            ) : (
              <CategoryIcon category={category} className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <h3 className="text-lg font-medium text-gray-900 tracking-tight truncate group-hover:text-blue-500 transition-colors">
              {title}
            </h3>
          </a>
          
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <CategoryIcon category={category} className="h-3 w-3 mr-1" />
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-2 truncate hover:text-blue-500 transition-colors"
            >
              {new URL(url).hostname}
            </a>
          </div>
          
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center ml-5">
          <button 
            onClick={() => onVote(id, 'up')}
            className={`flex items-center justify-center h-8 w-8 rounded-full p-1 transition-all duration-200 ${
              userVote === 'up' 
                ? 'text-white bg-gradient-to-r from-green-500 to-green-400 shadow-sm' 
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
            className={`flex items-center justify-center h-8 w-8 rounded-full p-1 transition-all duration-200 ${
              userVote === 'down' 
                ? 'text-white bg-gradient-to-r from-red-500 to-red-400 shadow-sm' 
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