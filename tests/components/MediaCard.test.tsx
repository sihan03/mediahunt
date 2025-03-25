import React from 'react';
import { render, screen } from '@testing-library/react';
import MediaCard from '../../app/components/MediaCard';

// Mock necessary providers or contexts
jest.mock('../../lib/auth/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    user: { id: 'test-user' },
    loading: false
  }))
}));

// Mock handleVote function
jest.mock('../../lib/database/votes', () => ({
  handleVote: jest.fn()
}));

describe('MediaCard Component', () => {
  const mockMedia = {
    id: 'test-id',
    title: 'Test Media',
    url: 'https://example.com',
    description: 'Test description',
    category: 'newsletter',
    imageUrl: 'https://example.com/image.jpg',
    votes: 10,
    userVote: null
  };

  test('renders media information correctly', () => {
    render(<MediaCard mediaSource={mockMedia} />);
    
    // Check if the media title is displayed
    expect(screen.getByText('Test Media')).toBeInTheDocument();
    
    // Check if the vote count is displayed
    expect(screen.getByText('10')).toBeInTheDocument();
  });
}); 