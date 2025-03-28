'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';
import { Session, User } from '@supabase/supabase-js';
import { UserProfile, getUserProfile, createUserProfileOnSignUp } from './database';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
      
      // If no profile exists, create one with default values
      if (!profile && user) {
        // Generate a unique username based on email or id
        const username = user.email 
          ? user.email.split('@')[0] + Math.floor(Math.random() * 1000)
          : 'user_' + Math.floor(Math.random() * 10000);
          
        const authProvider = user.app_metadata?.provider || 'unknown';
        const avatarUrl = user.user_metadata?.avatar_url;
        
        const newProfile = await createUserProfileOnSignUp(
          userId, 
          username, 
          authProvider,
          avatarUrl
        );
        
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    // Skip initialization during build/SSR
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    
    // Check for existing session
    const initializeAuth = async () => {
      // Only show loading if we don't already have a user
      if (!user && isMounted) {
        setIsLoading(true);
      }
      
      try {
        const { data } = await supabase.auth.getSession();
        
        // Only update state if component is still mounted and user has changed
        // This prevents unnecessary updates on tab focus
        if (isMounted && JSON.stringify(data.session?.user) !== JSON.stringify(user)) {
          setSession(data.session);
          setUser(data.session?.user || null);
          
          if (data.session?.user) {
            await fetchUserProfile(data.session.user.id);
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
      
      // Set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          // Only process meaningful auth events, not just tab focus
          if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
            if (isMounted) {
              setSession(session);
              setUser(session?.user || null);
              
              if (session?.user) {
                await fetchUserProfile(session.user.id);
              } else {
                setUserProfile(null);
              }
              
              setIsLoading(false);
            }
          }
        }
      );
      
      return () => {
        isMounted = false;
        subscription?.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);
  
  const signOut = async () => {
    try {
      // First, sign out on the client side to immediately clear local storage/cookies
      await supabase.auth.signOut();
      
      // Then call the server API to clear server-side session
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error signing out:', data.error);
        return;
      }
      
      // Clear state
      setUser(null);
      setSession(null);
      setUserProfile(null);
      
      // Force a refresh of the page to ensure all state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const value = {
    user,
    session,
    userProfile,
    isLoading,
    signOut,
    refreshUserProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 