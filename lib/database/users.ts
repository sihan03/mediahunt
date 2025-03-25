import { supabase } from '../supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase/types';

// Types that match our database schema
export type UserProfile = {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  registration_date: string;
  auth_provider?: string;
  last_login: string;
  updated_at: string;
};

// Type-safe database client
const typedSupabase = supabase as SupabaseClient<Database>;

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await typedSupabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    if (error.code === 'PGRST116') {
      // Profile not found, return null
      return null;
    }
    throw error;
  }
  
  return data;
}

// Update user profile
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const { data, error } = await typedSupabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  
  return data;
}

// Create new user profile
export async function createUserProfile(profile: Omit<UserProfile, 'registration_date' | 'last_login' | 'updated_at'>): Promise<UserProfile> {
  const { data, error } = await typedSupabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
  
  return data;
} 