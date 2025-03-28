import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment or use local defaults
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types based on our database schema
export type MediaItem = {
  id: number;
  title: string;
  type: string;
  url: string;
  description: string | null;
  votes: number;
  icon: string | null;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: number;
  media_item_id: number;
  content: string;
  created_at: string;
  user_id: string | null;
}; 