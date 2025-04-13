'use client';

import React from 'react';
import Image from 'next/image';
import { useMediaData } from '@/hooks/useMediaData';
import { getEmojiForType } from '@/hooks/useMediaIcon';

// Placeholder data for Signal/Noise of the Week
const signalOfTheWeek = [
  {
    id: 1,
    rank: 1,
    title: "AI-Generated Content Detection Breakthrough",
    source: "AI Research Journal",
    imageUrl: "/number1.webp" // Placeholder image
  },
  {
    id: 2,
    rank: 2,
    title: "New Neural Network Architecture Achieves 40% Performance Boost",
    source: "Tech AI Review",
    imageUrl: "/number2.webp"
  },
  {
    id: 3,
    rank: 3,
    title: "Explainable AI Framework for Healthcare Applications",
    source: "Medical AI Society",
    imageUrl: "/number3.webp"
  }
];

const noiseOfTheWeek = [
  {
    id: 101,
    rank: 1,
    title: "AI Will Replace All Writers by Next Month, Claims Startup CEO",
    source: "Tech Hype Daily"
  },
  {
    id: 102,
    rank: 2,
    title: "Study Shows AI Has Achieved General Intelligence, Details Unclear",
    source: "Future Technology News"
  },
  {
    id: 103, 
    rank: 3,
    title: "AI-Generated Art Indistinguishable from Human Art, Says Algorithm Creator",
    source: "Digital Art Weekly"
  }
];

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
      {/* Signal of the Week Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Signal of the Week</h2>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            {/* Top signals */}
            <div className="md:w-2/3 flex flex-col md:flex-row gap-4">
              {/* First item takes 100% width on mobile, 66% on desktop */}
              <div 
                key={signalOfTheWeek[0].id} 
                className="relative rounded-lg overflow-hidden shadow-md bg-white flex-grow md:w-2/3"
              >
                <div className="bg-gray-300 h-72 md:h-96 relative">
                  {/* Placeholder image or actual image when available */}
                  {signalOfTheWeek[0].imageUrl && (
                    <Image
                      src={signalOfTheWeek[0].imageUrl}
                      alt={signalOfTheWeek[0].title}
                      fill
                      sizes="(max-width: 768px) 100vw, 66vw"
                      className="object-cover"
                      priority
                    />
                  )}
                  
                  {/* Badge overlay */}
                  <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-full text-base font-bold">
                    No.{signalOfTheWeek[0].rank} 🥇
                  </div>
                  
                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pt-16 pb-4 px-4">
                    <h3 className="font-semibold text-xl text-white">
                      {signalOfTheWeek[0].title}
                    </h3>
                    <p className="text-sm text-gray-200 mt-1">
                      {signalOfTheWeek[0].source}
                    </p>
                  </div>
                </div>
              </div>

              {/* Container for items 2 and 3 in a flex column */}
              <div className="flex flex-col md:w-1/3 h-full gap-4">
                {/* Item 2 */}
                <div 
                  key={signalOfTheWeek[1].id} 
                  className="relative rounded-lg overflow-hidden shadow-md bg-white flex-1"
                >
                  <div className="bg-gray-300 h-full relative">
                    {/* Placeholder image or actual image when available */}
                    {signalOfTheWeek[1].imageUrl && (
                      <Image
                        src={signalOfTheWeek[1].imageUrl}
                        alt={signalOfTheWeek[1].title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    )}
                    
                    {/* Badge overlay */}
                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm font-bold">
                      No.{signalOfTheWeek[1].rank} 🥈
                    </div>
                    
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pt-10 pb-3 px-3">
                      <h3 className="font-medium text-sm text-white line-clamp-2">
                        {signalOfTheWeek[1].title}
                      </h3>
                      <p className="text-xs text-gray-200">
                        {signalOfTheWeek[1].source}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Item 3 */}
                <div 
                  key={signalOfTheWeek[2].id} 
                  className="relative rounded-lg overflow-hidden shadow-md bg-white flex-1"
                >
                  <div className="bg-gray-300 h-full relative">
                    {/* Placeholder image or actual image when available */}
                    {signalOfTheWeek[2].imageUrl && (
                      <Image
                        src={signalOfTheWeek[2].imageUrl}
                        alt={signalOfTheWeek[2].title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    )}
                    
                    {/* Badge overlay */}
                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm font-bold">
                      No.{signalOfTheWeek[2].rank} 🥉
                    </div>
                    
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pt-10 pb-3 px-3">
                      <h3 className="font-medium text-sm text-white line-clamp-2">
                        {signalOfTheWeek[2].title}
                      </h3>
                      <p className="text-xs text-gray-200">
                        {signalOfTheWeek[2].source}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Noise of the week */}
            <div className="md:w-1/3 bg-gray-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Noise of the Week</h3>
              <div className="space-y-3">
                {noiseOfTheWeek.map((noise) => (
                  <div key={noise.id} className="bg-white p-3 rounded-md shadow-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-red-500 font-bold">#{noise.rank}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{noise.title}</p>
                        <p className="text-xs text-gray-500">{noise.source}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
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