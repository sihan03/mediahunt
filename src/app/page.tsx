'use client';

import React from 'react';
import Image from 'next/image';
import { useMediaData } from '@/hooks/useMediaData';
import { getEmojiForType } from '@/hooks/useMediaIcon';

export default function Home() {
  const { 
    mediaItems, 
    isLoading, 
    error, 
    upvote,
    downvote,
    addComment
  } = useMediaData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start space-x-4">
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    {item.icon ? (
                      item.icon.startsWith('/') ? (
                        // Render image if path exists and starts with '/'
                        <Image
                          src={item.icon}
                          alt={`${item.title} icon`}
                          width={48}
                          height={48}
                          className="rounded-lg"
                        />
                      ) : (
                        // Render provided emoji directly
                        <span 
                          className="text-4xl w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg" 
                          role="img" 
                          aria-label={`${item.title} icon`}
                        >
                          {item.icon}
                        </span>
                      )
                    ) : (
                      // Fallback to type-based emoji if no icon provided
                      <span 
                        className="text-4xl w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg" 
                        role="img" 
                        aria-label={`${item.type} icon`}
                      >
                        {getEmojiForType(item.type)}
                      </span>
                    )}
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">{item.title}</h2>
                      <p className="text-sm text-gray-500">{item.description}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.type}
                        </span>
                        <a
                          href={`https://${item.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          {item.url}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interaction buttons - on the right */}
                <div className="flex items-center space-x-3">
                  {/* Vote buttons */}
                  <div className="bg-gray-100 rounded-full flex items-center h-8">
                    <button 
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      onClick={() => upvote(item.id)}
                      aria-label="Upvote"
                    >
                      <svg
                        className={`w-5 h-5 ${item.currentUserVote === 1 ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <span className="text-sm font-medium px-2 min-w-[20px] text-center">{item.vote_count}</span>
                    <button 
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      onClick={() => downvote(item.id)}
                      aria-label="Downvote"
                    >
                      <svg
                        className={`w-5 h-5 ${item.currentUserVote === -1 ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Comments button */}
                  <div className="bg-gray-100 rounded-full hover:bg-gray-200 flex items-center h-8 px-2">
                    <button 
                      className="flex items-center space-x-1 rounded-full py-1 px-2 transition-colors"
                      onClick={() => {
                        const content = prompt('Add your comment:');
                        if (content) addComment(item.id, content);
                      }}
                    >
                      <svg 
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">{item.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}