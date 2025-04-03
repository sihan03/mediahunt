-- Migration: Create Media Tables
-- Description: Sets up the core tables for the media hunt application
-- Tables: 
--   - media_items: Stores media content with ownership and voting (read-only via RLS)
--   - comments: Stores user comments on media items (full CRUD for owners)
-- Security: 
--   - All tables have RLS enabled
--   - media_items: Public read-only access, all modifications handled by backend
--   - comments: Public read access, write operations restricted to authenticated owners
-- Author: System
-- Date: 2024-03-27

-- Create media_items table with RLS enabled
-- This table stores the main media content that users can share and vote on
create table if not exists media_items (
  id serial primary key,
  title text not null,
  type text not null check (type in ('video', 'article', 'image', 'other')), -- Enforce valid media types
  url text not null,
  description text,
  votes integer default 0,
  icon text,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on media_items
alter table media_items enable row level security;

-- Create RLS policy for media_items
-- Security rationale: Media items should be publicly viewable, all modifications handled by backend
create policy "Media items are viewable by everyone" 
on media_items for select 
to authenticated, anon 
using (true);

-- Create comments table with RLS enabled
-- This table stores user comments associated with media items
create table if not exists comments (
  id serial primary key,
  media_item_id integer references media_items(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) on delete set null
);

-- Enable RLS on comments
alter table comments enable row level security;

-- Create RLS policies for comments
-- Security rationale: Comments should be publicly viewable for transparency
create policy "Comments are viewable by everyone" 
on comments for select 
to authenticated, anon 
using (true);

-- Security rationale: Only authenticated users can comment, must be tied to their user_id
create policy "Authenticated users can create comments" 
on comments for insert 
to authenticated 
with check (auth.uid() = user_id);

-- Security rationale: Users can only edit their own comments
create policy "Users can update their own comments" 
on comments for update 
to authenticated 
using (auth.uid() = user_id) 
with check (auth.uid() = user_id);

-- Security rationale: Users can only delete their own comments
create policy "Users can delete their own comments" 
on comments for delete 
to authenticated 
using (auth.uid() = user_id);

-- Create function to update updated_at timestamp
-- This function automatically maintains the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
create trigger update_media_items_updated_at
  before update on media_items
  for each row
  execute function update_updated_at_column(); 