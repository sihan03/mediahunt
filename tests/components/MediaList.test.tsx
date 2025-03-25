import { render, screen, act, waitFor } from '@testing-library/react';
import MediaList from '../../app/components/MediaList';
import { useAuth } from '../../lib/AuthContext';
import { fetchAllMedia, fetchMediaWithUserVotes } from '../../lib/database';

// Mock dependencies
jest.mock('../../lib/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../lib/database', () => ({
  fetchAllMedia: jest.fn(),
  fetchMediaWithUserVotes: jest.fn(),
  handleVote: jest.fn(),
}));

jest.mock('../../app/components/MediaCard', () => ({
  __esModule: true,
  default: () => <div data-testid="media-card" />,
}));

jest.mock('../../app/components/CategoryFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="category-filter" />,
}));

// Mock data
const mockMedia = [
  {
    id: '1',
    title: 'Test Media 1',
    url: 'https://test1.com',
    description: 'Test description 1',
    category: 'news',
    imageUrl: 'https://test1.com/image.jpg',
    votes: 10,
    userVote: null
  },
  {
    id: '2',
    title: 'Test Media 2',
    url: 'https://test2.com',
    description: 'Test description 2',
    category: 'podcast',
    imageUrl: 'https://test2.com/image.jpg',
    votes: 5,
    userVote: null
  }
];

describe('MediaList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    (fetchAllMedia as jest.Mock).mockResolvedValue(mockMedia);
    (fetchMediaWithUserVotes as jest.Mock).mockResolvedValue(mockMedia);
  });

  it('should load media without user votes when not logged in', async () => {
    // Arrange
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    
    // Act
    render(<MediaList />);

    // Wait for the data to load
    await waitFor(() => {
      expect(fetchAllMedia).toHaveBeenCalledTimes(1);
      expect(fetchMediaWithUserVotes).not.toHaveBeenCalled();
      // Check that media cards are rendered
      expect(screen.getAllByTestId('media-card')).toHaveLength(2);
    });
  });

  it('should load media with user votes when logged in', async () => {
    // Arrange
    const mockUser = { id: 'user1', email: 'test@example.com' };
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    
    // Act
    render(<MediaList />);
    
    // Wait for the data to load
    await waitFor(() => {
      expect(fetchMediaWithUserVotes).toHaveBeenCalledTimes(1);
      expect(fetchMediaWithUserVotes).toHaveBeenCalledWith(mockUser.id, expect.any(AbortSignal));
      expect(fetchAllMedia).not.toHaveBeenCalled();
      expect(screen.getAllByTestId('media-card')).toHaveLength(2);
    });
  });

  it('should handle tab switching gracefully without infinite loading', async () => {
    // Arrange
    const mockUser = { id: 'user1', email: 'test@example.com' };
    let authHook = { user: mockUser };
    (useAuth as jest.Mock).mockImplementation(() => authHook);
    
    // First render with user
    const { rerender } = render(<MediaList />);
    
    // Wait for initial data load
    await waitFor(() => {
      expect(fetchMediaWithUserVotes).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Clear mocks to track new calls
    jest.clearAllMocks();
    
    // Simulate tab switching (auth momentarily resets)
    authHook = { user: null };
    
    // Act - rerender to simulate component update due to context change
    rerender(<MediaList />);
    
    // Simulate tab becoming active again
    authHook = { user: mockUser };
    rerender(<MediaList />);
    
    // Assert - should handle this gracefully without showing loading spinner again
    await waitFor(() => {
      expect(fetchMediaWithUserVotes).toHaveBeenCalledTimes(1);
      // Should never show the spinner again for quick auth state toggle
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
  
  it('should abort in-flight requests when unmounting', async () => {
    // Arrange
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');
    
    // Act
    const { unmount } = render(<MediaList />);
    unmount();
    
    // Assert
    expect(abortSpy).toHaveBeenCalled();
  });
}); 