import { createClient } from '../lib/supabase/client';
import useSWR from 'swr';

// 1. Define the HighlightItem interface based on the schema
export interface HighlightItem {
  id: number;
  media_id: number | null;
  type: 'signal' | 'noise';
  rank: number;
  title: string;
  cover_image_url: string | null;
  source: string | null;
  target_url: string | null;
  created_at: string;
}

// 2. Create the useHighlight hook
export function useHighlight() {
  const supabase = createClient();

  // 3. Define the fetcher function
  const fetcher = async () => {
    const { data, error } = await supabase
      .from('highlights')
      .select('*')
      .order('type', { ascending: true }) // Order by 'signal' then 'noise'
      .order('rank', { ascending: true }); // Then by rank within each type

    if (error) {
      console.error('Error fetching highlights:', error);
      throw error;
    }

    // Ensure the data conforms to the type, especially 'type'
    return (data || []).map(item => ({
      ...item,
      type: item.type as 'signal' | 'noise' // Explicit type assertion
    }));
  };

  // 4. Use SWR to fetch and manage state
  const { 
    data: highlights = [], // Default to empty array
    error, 
    isLoading, 
    mutate 
  } = useSWR<HighlightItem[]>(
    'highlights', // SWR key for this data
    fetcher, 
    {
      revalidateOnFocus: false, // Optional: prevents refetching on window focus
      onError: (err) => {
          console.error("SWR fetch error for highlights:", err);
      }
    }
  );

  // 5. Return the hook's state and functions
  return {
    highlights,
    isLoading,
    error: error ? error.message : null, // Return error message string or null
    mutate, // Expose mutate for potential manual revalidation
  };
}