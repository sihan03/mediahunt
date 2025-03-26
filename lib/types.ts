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

export type Category = 'all' | 'news' | 'tutorial' | 'course' | 'podcast' | 'video' | 'blog' | 'other' | '';

export const categories: Category[] = ['all', 'news', 'tutorial', 'course', 'podcast', 'video', 'blog', 'other']; 