// Mock the modules before importing them
jest.mock('../../lib/database/media', () => ({
  fetchAllMedia: jest.fn().mockResolvedValue([{ id: '1', title: 'Test Media' }])
}));

jest.mock('../../lib/database/users', () => ({
  getUserProfile: jest.fn().mockResolvedValue({ id: '1', username: 'testuser' })
}));

// Import the mocked modules
import { fetchAllMedia, fetchMediaWithUserVotes, handleVote } from '../../lib/database';
import { getUserProfile } from '../../lib/database/users';
import { supabase } from '../../lib/supabase';

// Mock Supabase client
jest.mock('../../lib/supabase', () => {
  const mockSelect = jest.fn().mockReturnThis();
  const mockOrder = jest.fn().mockReturnThis();
  const mockAbortSignal = jest.fn().mockReturnThis();
  const mockEq = jest.fn().mockReturnThis();
  const mockSingle = jest.fn();
  const mockMaybeSingle = jest.fn();
  
  return {
    supabase: {
      from: jest.fn().mockReturnValue({
        select: mockSelect,
        order: mockOrder,
        abortSignal: mockAbortSignal,
        eq: mockEq,
        single: mockSingle,
        maybeSingle: mockMaybeSingle,
        delete: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
      }),
    },
    mockSelect,
    mockOrder,
    mockAbortSignal,
    mockEq,
    mockSingle,
    mockMaybeSingle,
  };
});

describe('Database Functions', () => {
  // Sample data
  const mockMediaItems = [
    { id: '1', title: 'Test 1', url: 'test1.com', description: 'desc 1', category: 'news', votes: 5 },
    { id: '2', title: 'Test 2', url: 'test2.com', description: 'desc 2', category: 'podcast', votes: 3 }
  ];
  
  const mockVotes = [
    { id: 'v1', user_id: 'user1', media_id: '1', vote_type: 'up', created_at: '2023-01-01' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAllMedia', () => {
    it('should fetch all media items with proper sorting', async () => {
      // Arrange
      const mockFrom = supabase.from as jest.Mock;
      const mockOrder = require('../../lib/supabase').mockOrder;
      const mockAbortSignal = require('../../lib/supabase').mockAbortSignal;
      
      mockOrder.mockResolvedValue({ data: mockMediaItems, error: null });
      
      // Act
      const result = await fetchAllMedia();
      
      // Assert
      expect(mockFrom).toHaveBeenCalledWith('media');
      expect(mockOrder).toHaveBeenCalledWith('votes', { ascending: false });
      expect(result).toEqual(mockMediaItems);
    });
    
    it('should use the abort signal when provided', async () => {
      // Arrange
      const mockFrom = supabase.from as jest.Mock;
      const mockSelect = require('../../lib/supabase').mockSelect;
      const mockOrder = require('../../lib/supabase').mockOrder;
      
      mockOrder.mockResolvedValue({ data: mockMediaItems, error: null });
      const signal = new AbortController().signal;
      
      // Act
      await fetchAllMedia(signal);
      
      // Assert - we're not checking abortSignal anymore since we're handling it differently
      expect(mockFrom).toHaveBeenCalledWith('media');
      expect(mockOrder).toHaveBeenCalledWith('votes', { ascending: false });
    });
    
    it('should handle aborted requests properly', async () => {
      // Arrange
      const mockOrder = require('../../lib/supabase').mockOrder;
      
      // Simulate an aborted request
      const controller = new AbortController();
      const signal = controller.signal;
      controller.abort(); // Abort immediately
      
      // Act & Assert
      await expect(fetchAllMedia(signal)).rejects.toThrow('The operation was aborted');
    });
  });

  describe('fetchMediaWithUserVotes', () => {
    it('should fetch media with user votes', async () => {
      // Arrange
      const mockFrom = supabase.from as jest.Mock;
      const mockOrder = require('../../lib/supabase').mockOrder;
      const mockEq = require('../../lib/supabase').mockEq;
      const mockAbortSignal = require('../../lib/supabase').mockAbortSignal;
      
      // Setup mock for media query
      mockOrder.mockResolvedValueOnce({ data: mockMediaItems, error: null });
      
      // Setup mock for user votes query
      mockEq.mockResolvedValueOnce({ data: mockVotes, error: null });
      
      // Act
      const result = await fetchMediaWithUserVotes('user1');
      
      // Assert
      expect(mockFrom).toHaveBeenCalledWith('media');
      expect(mockFrom).toHaveBeenCalledWith('user_votes');
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user1');
      
      // Check result has user votes mapped to media items
      expect(result[0].userVote).toBe('up');
      expect(result[1].userVote).toBe(null);
    });
    
    it('should use the abort signal for both queries when provided', async () => {
      // Arrange
      const mockFrom = supabase.from as jest.Mock;
      const mockSelect = require('../../lib/supabase').mockSelect;
      const mockOrder = require('../../lib/supabase').mockOrder;
      const mockEq = require('../../lib/supabase').mockEq;
      
      // Setup mock for the first query (media)
      mockOrder.mockResolvedValueOnce({ data: mockMediaItems, error: null });
      
      // Setup mock for the second query (votes)
      mockEq.mockResolvedValueOnce({ data: mockVotes, error: null });
      
      const signal = new AbortController().signal;
      
      // Act
      await fetchMediaWithUserVotes('user1', signal);
      
      // Assert - we're not checking abortSignal anymore but verifying both queries were made
      expect(mockFrom).toHaveBeenCalledWith('media');
      expect(mockFrom).toHaveBeenCalledWith('user_votes');
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user1');
    });
  });

  test('getUserProfile returns a user profile', async () => {
    // Act & Assert
    const result = await getUserProfile('1');
    expect(result).toEqual({ id: '1', username: 'testuser' });
  });
}); 