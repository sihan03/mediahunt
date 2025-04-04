-- Migration: Seed Initial Data
-- Description: Provides initial test data for the media hunt application
-- Tables affected: 
--   - auth.users: Creates test user for development
--   - media_items: Seeds initial media content
--   - comments: Seeds initial user comments
-- Security: 
--   - Creates test user for development purposes only
--   - Respects RLS policies (read-only media_items, owner-based comments)
-- Author: System
-- Date: 2024-03-27

-- Create a test user for seeding data
-- Note: In production, you would manage users through Supabase Auth
insert into auth.users (id, email)
values 
  ('d7bed83c-44a0-4a4f-8456-123412341234', 'test@example.com')
on conflict (id) do nothing;

-- Seed initial media content
-- Note: In production, media items would be managed through backend operations
insert into media_items (
  id, 
  title, 
  type, 
  url, 
  description, 
  upvotes, 
  downvotes, 
  icon, 
  owner_id
)
values 
  (
    1, 
    'Lenny''s Newsletter', 
    'article', 
    'https://www.lennysnewsletter.com', 
    'Insights, frameworks, and best practices for building products and growing companies.', 
    0, 
    0, 
    '📰', 
    'd7bed83c-44a0-4a4f-8456-123412341234'
  ),
  (
    2, 
    'MIT Tech Review', 
    'article', 
    'https://www.technologyreview.com', 
    'The latest technology news and analysis from MIT.', 
    0, 
    0, 
    '🧑‍🔬', 
    'd7bed83c-44a0-4a4f-8456-123412341234'
  ),
  (
    3, 
    'TLDR', 
    'article', 
    'https://tldr.tech', 
    'Tech news and developments summarized in a concise, readable format.', 
    0, 
    0, 
    '📱', 
    'd7bed83c-44a0-4a4f-8456-123412341234'
  ),
  (
    4, 
    'Acquired', 
    'article', 
    'https://www.acquired.fm', 
    'Deep dives into great technology companies and startup acquisitions.', 
    0, 
    0, 
    '💼', 
    'd7bed83c-44a0-4a4f-8456-123412341234'
  ),
  (
    5, 
    'Fireship', 
    'video', 
    'https://www.youtube.com/@Fireship', 
    'Fast-paced videos about modern web development.', 
    0, 
    0, 
    '🔥', 
    'd7bed83c-44a0-4a4f-8456-123412341234'
  ),
  (
    6, 
    'AI Engineer', 
    'video', 
    'https://www.youtube.com/@aiDotEngineer', 
    'Content focused on AI engineering and applications.', 
    0, 
    0, 
    '🤖', 
    'd7bed83c-44a0-4a4f-8456-123412341234'
  ),
  (
    7, 
    'Andrej Karpathy', 
    'video', 
    'https://www.youtube.com/@AndrejKarpathy', 
    'In-depth explanations of machine learning concepts and implementations.', 
    0, 
    0, 
    '🧠', 
    'd7bed83c-44a0-4a4f-8456-123412341234'
  );

-- Reset the sequence to continue after our manually inserted ids
select setval('media_items_id_seq', (select max(id) from media_items));

-- Seed initial comments
-- Note: In production, comments would be created through RLS-compliant client operations
insert into comments (
  media_item_id, 
  content, 
  created_at, 
  user_id
)
values 
  (
    1, 
    'Essential reading for product managers!', 
    now() - interval '3 days', 
    'd7bed83c-44a0-4a4f-8456-123412341234'
  ),
  (
    2, 
    'Great in-depth tech coverage.', 
    now() - interval '2 days', 
    'd7bed83c-44a0-4a4f-8456-123412341234'
  ),
  (
    3, 
    'Perfect for staying updated without information overload.', 
    now() - interval '1 day', 
    'd7bed83c-44a0-4a4f-8456-123412341234'
  ),
  (
    5, 
    'Love the short format videos!', 
    now() - interval '12 hours', 
    'd7bed83c-44a0-4a4f-8456-123412341234'
  ),
  (
    7, 
    'Best explanations of neural networks I''ve found.', 
    now() - interval '6 hours', 
    'd7bed83c-44a0-4a4f-8456-123412341234'
  ); 