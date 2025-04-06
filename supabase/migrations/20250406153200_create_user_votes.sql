-- Migration: Create user_votes table and voting logic
-- Description: Introduces a table to track individual user votes on media items and triggers to update aggregate counts.
-- Tables affected: Creates public.user_votes, modifies public.media_items (via triggers)
-- Functions created: public.update_media_item_votes
-- Triggers created: trigger_update_votes_after_insert, trigger_update_votes_after_update, trigger_update_votes_after_delete on public.user_votes
-- Author: AI Assistant
-- Date: 2024-04-05

-- Step 1: Create the user_votes table
-- This table stores individual vote records, linking users to media items.
-- The primary key ensures a user can only vote once per item.
create table public.user_votes (
  user_id uuid not null references auth.users(id) on delete cascade,
  media_item_id integer not null references public.media_items(id) on delete cascade,
  vote_type smallint not null check (vote_type in (1, -1)), -- 1 for upvote, -1 for downvote
  created_at timestamp with time zone default now(),
  primary key (user_id, media_item_id)
);
comment on table public.user_votes is 'Stores individual user votes (up or down) on media items.';
comment on column public.user_votes.user_id is 'The ID of the user who cast the vote.';
comment on column public.user_votes.media_item_id is 'The ID of the media item being voted on.';
comment on column public.user_votes.vote_type is 'The type of vote: 1 for an upvote, -1 for a downvote.';
comment on column public.user_votes.created_at is 'Timestamp of when the vote was first cast.';

-- Step 2: Enable Row Level Security (RLS) on the user_votes table
-- RLS is enabled to control access based on user authentication and ownership.
alter table public.user_votes enable row level security;

-- Step 3: Create RLS policies for user_votes table
-- Policies ensure users can only manage their own votes.

-- Policy: Allow authenticated users to view their own votes.
create policy "Users can view their own votes"
on public.user_votes for select
to authenticated
using ( (select auth.uid()) = user_id );

-- Policy: Allow authenticated users to insert their own votes.
create policy "Users can insert their own votes"
on public.user_votes for insert
to authenticated
with check ( (select auth.uid()) = user_id );

-- Policy: Allow authenticated users to update their own votes.
-- This permits changing a vote (e.g., from upvote to downvote).
create policy "Users can update their own votes"
on public.user_votes for update
to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );

-- Policy: Allow authenticated users to delete their own votes.
-- This permits removing a vote entirely.
create policy "Users can delete their own votes"
on public.user_votes for delete
to authenticated
using ( (select auth.uid()) = user_id );


-- Step 4: Create the trigger function to update media_items vote counts
-- This function recalculates the upvotes and downvotes on the media_items table
-- whenever a vote is inserted, updated, or deleted in the user_votes table.
-- It uses SECURITY DEFINER because it needs to modify the central media_items table,
-- which might not be owned by the user performing the vote action.
create or replace function public.update_media_item_votes()
returns trigger
language plpgsql
security definer -- Necessary to update aggregate counts in media_items table regardless of item ownership.
set search_path = '' -- Ensures predictable object resolution, following security best practices.
as $$
declare
  target_media_item_id integer;
  vote_change_up integer := 0;
  vote_change_down integer := 0;
begin
  -- Determine the media_item_id affected and calculate vote changes based on the operation
  if (tg_op = 'INSERT') then
    target_media_item_id := new.media_item_id;
    if new.vote_type = 1 then
      vote_change_up := 1;
    elsif new.vote_type = -1 then
      vote_change_down := 1;
    end if;
  elsif (tg_op = 'DELETE') then
    target_media_item_id := old.media_item_id;
    if old.vote_type = 1 then
      vote_change_up := -1;
    elsif old.vote_type = -1 then
      vote_change_down := -1;
    end if;
  elsif (tg_op = 'UPDATE') then
    target_media_item_id := new.media_item_id;
    -- Only proceed if the vote_type actually changed (e.g., upvote to downvote)
    if old.vote_type <> new.vote_type then
      -- Reverse the effect of the old vote
      if old.vote_type = 1 then
        vote_change_up := -1;
      elsif old.vote_type = -1 then
        vote_change_down := -1;
      end if;
      -- Add the effect of the new vote
      if new.vote_type = 1 then
        vote_change_up := vote_change_up + 1;
      elsif new.vote_type = -1 then
        vote_change_down := vote_change_down + 1;
      end if;
    else
        -- If vote_type didn't change, no update needed on media_items count
        return null; -- Exit the function; nothing to do.
    end if;
  end if;

  -- Apply the calculated changes to the upvotes and downvotes count in the media_items table
  if target_media_item_id is not null then
    update public.media_items
    set
      upvotes = upvotes + vote_change_up,
      downvotes = downvotes + vote_change_down
    where id = target_media_item_id;
  end if;

  -- Return the appropriate record based on the trigger operation
  if (tg_op = 'DELETE') then
    return old;
  else
    return new;
  end if;

exception
    -- Basic error handling: log the error and return null to allow the original operation to succeed if possible.
    when others then
        raise notice 'Error in update_media_item_votes trigger for media_item_id %: %', target_media_item_id, sqlerrm;
        return null; -- Prevents the trigger failure from blocking the user action entirely.
end;
$$;
comment on function public.update_media_item_votes() is 'Trigger function to maintain aggregate vote counts (upvotes, downvotes) in public.media_items based on insert, update, or delete operations in public.user_votes.';


-- Step 5: Create triggers on user_votes table
-- These triggers execute the update function after each relevant DML operation.

-- Trigger after inserting a new vote record
create trigger trigger_update_votes_after_insert
after insert on public.user_votes
for each row execute function public.update_media_item_votes();

-- Trigger after updating an existing vote's type (e.g., changing from upvote to downvote)
-- Note: We only trigger on UPDATE OF vote_type to avoid unnecessary function calls if other columns change.
create trigger trigger_update_votes_after_update
after update of vote_type on public.user_votes
for each row execute function public.update_media_item_votes();

-- Trigger after deleting a vote record
create trigger trigger_update_votes_after_delete
after delete on public.user_votes
for each row execute function public.update_media_item_votes(); 