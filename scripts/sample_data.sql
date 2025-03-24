-- Sample media items for testing
-- Run this script to populate your database with test data

-- Clear existing data if needed (uncomment if you want to reset the data)
-- DELETE FROM public.user_votes;
-- DELETE FROM public.media;

-- Insert media items for different categories
INSERT INTO public.media (
  title, 
  url, 
  description, 
  category, 
  image_url, 
  votes
) VALUES 
-- Newsletter examples
(
  'Stratechery', 
  'https://stratechery.com/', 
  'Analysis of the strategy and business side of technology and media by Ben Thompson', 
  'newsletter', 
  'https://stratechery.com/wp-content/uploads/2020/03/stratechery-generics.png', 
  42
),
(
  'Platformer', 
  'https://www.platformer.news/', 
  'News at the intersection of tech, platforms, and democracy by Casey Newton', 
  'newsletter', 
  'https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F876fb805-5214-41f7-a2e4-298b46ad10c4_256x256.png', 
  35
),

-- Publications
(
  'TechCrunch', 
  'https://techcrunch.com/', 
  'Reporting on the business of technology, startups, venture capital funding, and Silicon Valley', 
  'publication', 
  'https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png', 
  28
),
(
  'The Verge', 
  'https://www.theverge.com/', 
  'Covering the intersection of technology, science, art, and culture', 
  'publication', 
  'https://cdn.vox-cdn.com/uploads/chorus_asset/file/7395361/favicon-64x64.0.ico', 
  31
),

-- YouTube channels
(
  'MKBHD', 
  'https://www.youtube.com/c/mkbhd', 
  'Quality tech videos about gadgets, hardware, software by Marques Brownlee', 
  'youtube', 
  'https://yt3.googleusercontent.com/lkH37D712tiyphnu0Id0D5MwwQ7IRuwgQLVD_Oplkn1UVnN5TiSZZbTTvs4bC7E1vFRbVOmPwg=s176-c-k-c0x00ffffff-no-rj', 
  50
),
(
  'Linus Tech Tips', 
  'https://www.youtube.com/c/LinusTechTips', 
  'Tech reviews, guides, and entertainment focusing on PC hardware and gadgets', 
  'youtube', 
  'https://yt3.googleusercontent.com/Wr4xM7W-yZZ8Sw7UZsAF9G-XrB8Jc6-5T7trVA3GctyZ-zirPnGcE5KfEQzCGnR5hnFN9JvEpA=s176-c-k-c0x00ffffff-no-rj', 
  45
),

-- Podcasts
(
  'Reply All', 
  'https://gimletmedia.com/shows/reply-all', 
  'A podcast about the internet and modern life hosted by Alex Goldman and Emmanuel Dzotsi', 
  'podcast', 
  'https://cdn.simplecast.com/images/4671255f-2d35-40a1-9c31-0be548aeefa8/86bf5226-553c-4d8c-859f-83b75c283a96/3000x3000/reply-all-logo-new.jpg', 
  38
),
(
  'Planet Money', 
  'https://www.npr.org/podcasts/510289/planet-money', 
  'The economy explained with stories and surprising adventures', 
  'podcast', 
  'https://media.npr.org/assets/img/2018/08/02/npr_planetmoney_podcasttile_sq-7b7fab0b52fd72826936c3dbe51cff94889797a0-s300-c85.jpg', 
  32
); 