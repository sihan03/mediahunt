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
    <div className="bg-white px-5 py-4 rounded-xl shadow-sm">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
            }`}
          >
            <CategoryIcon category={category} className={`h-3.5 w-3.5 mr-1.5 ${selectedCategory === category ? 'text-white' : 'text-gray-500'}`} />
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
} 