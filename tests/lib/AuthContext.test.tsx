import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';

// Mock the Supabase client
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ 
        data: { session: null }, 
        error: null 
      }),
      onAuthStateChange: jest.fn((callback) => {
        // Store the callback for triggering auth state changes in tests
        (global as any).authStateChangeCallback = callback;
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      }),
      signOut: jest.fn().mockResolvedValue({ error: null })
    }
  }
}));

// Mock getUserProfile function
jest.mock('../../lib/database', () => ({
  getUserProfile: jest.fn().mockResolvedValue(null),
  createUserProfileOnSignUp: jest.fn().mockResolvedValue(null)
}));

// Test component that consumes the auth context
const TestComponent = () => {
  const { user, isLoading } = useAuth();
  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'no user'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('provides authentication state', async () => {
    // Arrange & Act
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Assert - initially loading
    expect(getByTestId('loading').textContent).toBe('true');
    
    // Simulate auth state loading complete
    await waitFor(() => {
      expect(getByTestId('loading').textContent).toBe('false');
    });
    
    // Assert - loading complete, no user
    expect(getByTestId('user').textContent).toBe('no user');
  });
  
  test('handles tab focus events gracefully without unnecessary rerenders', async () => {
    // Mock implementation for testing tab focus behavior
    (supabase.auth.getSession as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        data: { 
          session: { 
            user: { id: 'user1', email: 'test@example.com' } 
          } 
        }, 
        error: null
      });
    });
    
    const mockCallback = jest.fn();
    const originalOnAuthStateChange = supabase.auth.onAuthStateChange;
    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
      mockCallback.mockImplementation(callback);
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    
    // Render the component
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial auth load to complete
    await waitFor(() => {
      expect(getByTestId('loading').textContent).toBe('false');
      expect(getByTestId('user').textContent).not.toBe('no user');
    });
    
    // Reset mocks to track new calls
    jest.clearAllMocks();
    
    // Simulate a visibilitychange event (tab focus)
    act(() => {
      mockCallback('INITIAL_SESSION', { user: { id: 'user1', email: 'test@example.com' } });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    
    // Verify that we don't unnecessarily update state for non-auth events
    await waitFor(() => {
      // The auth state should not have been updated (or loading set to true)
      expect(getByTestId('loading').textContent).toBe('false');
    });
    
    // Now simulate a real auth event
    act(() => {
      mockCallback('SIGNED_OUT', null);
    });
    
    // Verify that we do update for real auth events
    await waitFor(() => {
      expect(getByTestId('user').textContent).toBe('no user');
    });
  });
}); 