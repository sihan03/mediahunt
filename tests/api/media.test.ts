import { NextRequest } from 'next/server';
import { GET as getMedia, POST as addMedia } from '../../app/api/media/route';
import { GET as getUserVotes } from '../../app/api/media/votes/route';
import { POST as voteMedia } from '../../app/api/media/vote/route';
import { supabaseServer } from '../../lib/supabase-server';

// Mock supabaseServer
jest.mock('../../lib/supabase-server', () => ({
  supabaseServer: {
    from: jest.fn().mockReturnThis(),
    auth: {
      getSession: jest.fn(),
    },
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn(),
  },
}));

// Mock NextRequest
function createMockRequest(body = {}) {
  return {
    json: jest.fn().mockResolvedValue(body),
    nextUrl: {
      searchParams: new URLSearchParams()
    }
  } as unknown as NextRequest;
}

describe('Media API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/media', () => {
    it('should return all media items', async () => {
      // Arrange
      const mockMediaData = [{ id: '1', title: 'Test Media' }];
      const mockFrom = supabaseServer.from as jest.Mock;
      const mockOrder = supabaseServer.order as jest.Mock;
      
      mockOrder.mockResolvedValue({ data: mockMediaData, error: null });
      
      // Act
      const request = createMockRequest();
      const response = await getMedia(request);
      const responseData = await response.json();
      
      // Assert
      expect(mockFrom).toHaveBeenCalledWith('media');
      expect(responseData.media).toEqual(mockMediaData);
    });
  });

  describe('GET /api/media/votes', () => {
    it('should return user votes when authenticated', async () => {
      // Arrange
      const mockUserId = 'user123';
      const mockVotesData = [{ media_id: '1', vote_type: 'up' }];
      
      (supabaseServer.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: { id: mockUserId } } }
      });
      
      const mockFrom = supabaseServer.from as jest.Mock;
      const mockEq = supabaseServer.eq as jest.Mock;
      mockEq.mockResolvedValue({ data: mockVotesData, error: null });
      
      // Act
      const request = createMockRequest();
      const response = await getUserVotes(request);
      const responseData = await response.json();
      
      // Assert
      expect(mockFrom).toHaveBeenCalledWith('user_votes');
      expect(mockEq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(responseData.votes).toEqual(mockVotesData);
    });
    
    it('should return 401 when not authenticated', async () => {
      // Arrange
      (supabaseServer.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null }
      });
      
      // Act
      const request = createMockRequest();
      const response = await getUserVotes(request);
      
      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/media/vote', () => {
    it('should add a vote when authenticated', async () => {
      // Arrange
      const mockUserId = 'user123';
      const mockVoteData = { mediaId: '1', voteType: 'up' };
      
      (supabaseServer.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: { id: mockUserId } } }
      });
      
      const mockFrom = supabaseServer.from as jest.Mock;
      const mockMaybeSingle = supabaseServer.maybeSingle as jest.Mock;
      const mockSingle = supabaseServer.single as jest.Mock;
      
      // Simulate no existing vote
      mockMaybeSingle.mockResolvedValue({ data: null, error: null });
      
      // Simulate media fetch
      mockSingle.mockResolvedValue({ data: { votes: 5 }, error: null });
      
      // Simulate vote insert
      supabaseServer.insert.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: 'vote1' }, error: null })
      });
      
      // Simulate vote update
      supabaseServer.update.mockReturnValue({
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis()
      });
      
      // Act
      const request = createMockRequest(mockVoteData);
      const response = await voteMedia(request);
      const responseData = await response.json();
      
      // Assert
      expect(mockFrom).toHaveBeenNthCalledWith(1, 'user_votes');
      expect(mockFrom).toHaveBeenNthCalledWith(2, 'media');
      expect(supabaseServer.insert).toHaveBeenCalled();
      expect(responseData.success).toBe(true);
    });
    
    it('should return 401 when not authenticated', async () => {
      // Arrange
      (supabaseServer.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null }
      });
      
      // Act
      const request = createMockRequest({ mediaId: '1', voteType: 'up' });
      const response = await voteMedia(request);
      
      // Assert
      expect(response.status).toBe(401);
    });
  });
}); 