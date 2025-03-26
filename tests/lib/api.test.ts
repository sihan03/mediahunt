import { fetchAllMedia, fetchMediaWithUserVotes, handleVote, addMediaItem } from '../../lib/api';

// Mock global fetch
global.fetch = jest.fn();

// Setup mock implementation for fetch
beforeEach(() => {
  jest.clearAllMocks();
  // Default mock for fetch to make tests pass
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ media: [] })
  });
});

// Mock AbortController if needed
if (typeof AbortController === 'undefined') {
  global.AbortController = jest.fn().mockImplementation(() => ({
    signal: {},
    abort: jest.fn()
  })) as any;
}

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAllMedia', () => {
    it('should fetch all media from the API', async () => {
      // Arrange
      const mockMediaData = [
        { id: '1', title: 'Test Media' }
      ];
      
      // Mock the fetch response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ media: mockMediaData })
      });
      
      // Act
      const result = await fetchAllMedia();
      
      // Assert
      expect(global.fetch).toHaveBeenCalledWith('/api/media', expect.anything());
      expect(result).toEqual(mockMediaData);
    });
    
    it('should handle API errors', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });
      
      // Act & Assert
      await expect(fetchAllMedia()).rejects.toThrow('API error: 500');
    });
    
    it('should handle aborted requests', async () => {
      // Arrange
      const controller = new AbortController();
      const signal = controller.signal;
      
      // Mock an aborted fetch
      (global.fetch as jest.Mock).mockImplementationOnce(() => {
        throw new DOMException('The operation was aborted', 'AbortError');
      });
      
      // Act & Assert
      await expect(fetchAllMedia(signal)).rejects.toThrow('The operation was aborted');
    });
  });

  describe('fetchMediaWithUserVotes', () => {
    it('should fetch media with user votes from the API', async () => {
      // Arrange
      const mockUserId = 'user123';
      const mockMediaData = [
        { id: '1', title: 'Test Media', userVote: 'up' }
      ];
      
      // Mock the fetch response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ media: mockMediaData })
      });
      
      // Act
      const result = await fetchMediaWithUserVotes(mockUserId);
      
      // Assert
      expect(global.fetch).toHaveBeenCalledWith(`/api/media?userId=${mockUserId}`, expect.anything());
      expect(result).toEqual(mockMediaData);
    });
  });

  describe('handleVote', () => {
    it('should post a vote to the API', async () => {
      // Arrange
      const mockUserId = 'user123';
      const mockMediaId = 'media456';
      const mockVoteType = 'up';
      
      // Mock the fetch response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ success: true })
      });
      
      // Act
      await handleVote(mockUserId, mockMediaId, mockVoteType);
      
      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/media/vote',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mediaId: mockMediaId,
            voteType: mockVoteType
          })
        }
      );
    });
    
    it('should handle vote errors', async () => {
      // Arrange
      const mockUserId = 'user123';
      const mockMediaId = 'media456';
      const mockVoteType = 'up';
      
      // Mock a failed response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ error: 'Vote failed' })
      });
      
      // Act & Assert
      await expect(handleVote(mockUserId, mockMediaId, mockVoteType)).rejects.toThrow('Vote failed');
    });
  });

  describe('addMediaItem', () => {
    it('should add a media item via the API', async () => {
      // Arrange
      const mockMediaItem = {
        title: 'Test Media',
        url: 'https://test.com',
        description: 'Test description',
        category: 'news' as const,
      };
      
      const mockResponse = {
        id: 'media123',
        ...mockMediaItem,
        votes: 0,
        created_at: new Date().toISOString(),
      };
      
      // Mock the fetch response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ media: mockResponse })
      });
      
      // Act
      const result = await addMediaItem(mockMediaItem);
      
      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/media',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockMediaItem)
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });
}); 