import { MediaItem, UserProfile, UserVote } from './database';

export type Database = {
  public: {
    Tables: {
      media: {
        Row: MediaItem;
        Insert: Omit<MediaItem, 'id' | 'votes' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MediaItem, 'id'>>;
      };
      user_votes: {
        Row: UserVote;
        Insert: Omit<UserVote, 'id' | 'created_at'>;
        Update: Partial<Omit<UserVote, 'id' | 'created_at'>>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'registration_date' | 'last_login' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}; 