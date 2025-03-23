// Type definitions for MediaHunt

export interface MediaSource {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  imageUrl: string;
  votes: number;
  userVote?: 'up' | 'down' | null;
}

export type Category = 'all' | 'newsletter' | 'publication' | 'youtube' | 'podcast';

export const categories: Category[] = ['all', 'newsletter', 'publication', 'youtube', 'podcast']; 