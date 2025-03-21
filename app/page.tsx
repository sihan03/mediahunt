'use client';

import { useState } from 'react';
import { Category, mediaSources as initialMediaSources } from '../lib/data';
import { filterMediaSources, sortMediaSourcesByVotes, handleVote } from '../lib/utils';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import MediaCard from './components/MediaCard';

export default function Home() {
  const [mediaSources, setMediaSources] = useState(initialMediaSources);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  
  // Filter and sort media sources
  const filteredAndSortedSources = sortMediaSourcesByVotes(
    filterMediaSources(mediaSources, selectedCategory)
  );
  
  // Handle category filter change
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
  };
  
  // Handle voting
  const handleVoteClick = (sourceId: string, voteType: 'up' | 'down') => {
    setMediaSources(currentSources => 
      handleVote(currentSources, sourceId, voteType)
    );
  };
  
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onChange={handleCategoryChange} 
          />
          
          <div className="mt-6 space-y-4">
            {filteredAndSortedSources.map(source => (
              <MediaCard 
                key={source.id} 
                mediaSource={source} 
                onVote={handleVoteClick} 
              />
            ))}
            
            {filteredAndSortedSources.length === 0 && (
              <div className="bg-white p-6 text-center rounded-lg shadow">
                <p className="text-gray-500">No media sources found for this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
