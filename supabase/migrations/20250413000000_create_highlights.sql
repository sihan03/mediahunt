-- Migration: Create the highlights table
-- Purpose: Stores curated media items designated as "Signal" or "Noise" of the week.
-- Affected tables: Creates public.highlights
-- Considerations: Assumes public.media table exists with a bigint primary key named id.

create table public.highlights (
  id bigint generated always as identity primary key,
  media_id bigint references public.media_items(id) on delete set null,
  type text not null, -- 'signal' or 'noise'
  rank integer not null,
  title text not null,
  cover_image_url text,
  source text,
  target_url text,
  created_at timestamptz default now() not null
);

comment on table public.highlights is 'Stores curated media items for Signal/Noise of the Week feature.';
comment on column public.highlights.media_id is 'Optional foreign key linking to the original media item.';
comment on column public.highlights.type is 'Type of highlight, e.g., "signal" or "noise".';
comment on column public.highlights.rank is 'Ranking position within the type (1, 2, 3, etc.).';
comment on column public.highlights.cover_image_url is 'URL for the cover image, typically stored in Supabase Storage.';
comment on column public.highlights.target_url is 'The external URL the highlight card should link to.';

-- Enable Row Level Security
alter table public.highlights enable row level security;

-- Create RLS policies for public read access
create policy "Allow public read access to highlights" on public.highlights
  for select
  to anon, authenticated
  using (true); 