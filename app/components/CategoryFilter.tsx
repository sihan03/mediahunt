'use client';

import React from 'react';
import { Category, categories } from '../../lib/types';
import CategoryIcon from './CategoryIcon';

interface CategoryFilterProps {
  selectedCategory: Category;
  onChange: (category: Category) => void;
}

export default function CategoryFilter({ selectedCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="bg-white px-4 py-4 shadow sm:rounded-lg sm:px-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <CategoryIcon category={category} className="h-3 w-3 mr-1" />
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
} 