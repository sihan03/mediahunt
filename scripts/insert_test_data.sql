-- Insert a test media item
INSERT INTO public.media (
  title, 
  url, 
  description, 
  category, 
  image_url, 
  votes
) VALUES (
  'Test Media Item', 
  'https://example.com', 
  'This is a test media item description', 
  'news', 
  'https://placehold.co/400', 
  5
); 