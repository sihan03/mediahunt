-- Seed data for media_items table
INSERT INTO media_items (id, title, type, url, description, votes, icon)
VALUES 
  (1, 'MIT Tech Review', 'Publication', 'www.technologyreview.com', 'The latest technology news and analysis from MIT.', 1, '🧑‍🔬'),
  (2, 'Fireship', 'Youtube', 'www.youtube.com', 'Fast-paced videos about modern web development.', 0, '🔥'),
  (3, 'AI Engineer', 'Youtube', 'www.youtube.com', 'Content focused on AI engineering and applications.', 0, '');

-- Reset the sequence to continue after our manually inserted ids
SELECT setval('media_items_id_seq', (SELECT MAX(id) FROM media_items));

-- Seed some sample comments
INSERT INTO comments (media_item_id, content, created_at)
VALUES 
  (1, 'Great publication!', NOW() - INTERVAL '2 days'),
  (1, 'I read this every day.', NOW() - INTERVAL '1 day'),
  (2, 'Love the short format videos!', NOW() - INTERVAL '12 hours'); 