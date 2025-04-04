-- Migration: Refactor voting system in media_items table
-- Description: Changes the single 'votes' column to a more comprehensive upvotes/downvotes system
-- Tables affected: public.media_items
-- Changes: 
--   - Add upvotes column (integer, default 0)
--   - Add downvotes column (integer, default 0)
--   - Add computed vote_count column (upvotes - downvotes)
--   - Transfer existing votes data to upvotes column
--   - Remove the original votes column
-- Author: System
-- Date: 2025-04-04

-- Step 1: Add new columns for the voting system
alter table public.media_items
add column upvotes integer not null default 0,
add column downvotes integer not null default 0,
add column vote_count integer generated always as (upvotes - downvotes) stored;

-- Step 2: Migrate existing votes data to upvotes
-- This preserves the current voting state by moving all existing votes to upvotes
update public.media_items
set upvotes = votes;

-- Step 3: Remove the original votes column
-- This column is now redundant as we have the more detailed voting system
alter table public.media_items
drop column votes;

-- Step 4: Add comments to document the new columns
comment on column public.media_items.upvotes is 'Count of positive votes from users';
comment on column public.media_items.downvotes is 'Count of negative votes from users';
comment on column public.media_items.vote_count is 'Calculated net score (upvotes - downvotes)'; 