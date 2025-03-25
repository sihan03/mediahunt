export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      media: {
        Row: {
          id: string
          title: string
          url: string
          description: string
          category: string
          image_url: string | null
          votes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          url: string
          description: string
          category: string
          image_url?: string | null
          votes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          url?: string
          description?: string
          category?: string
          image_url?: string | null
          votes?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          registration_date: string
          auth_provider: string | null
          last_login: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          registration_date?: string
          auth_provider?: string | null
          last_login?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          registration_date?: string
          auth_provider?: string | null
          last_login?: string
          updated_at?: string
        }
      }
      user_votes: {
        Row: {
          id: string
          user_id: string
          media_id: string
          vote_type: 'up' | 'down'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          media_id: string
          vote_type: 'up' | 'down'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          media_id?: string
          vote_type?: 'up' | 'down'
          created_at?: string
        }
      }
    }
  }
} 