-- Migration: Create handle_vote RPC function
-- Description: Creates a function to handle inserting or updating user votes atomically.
-- Functions created: public.handle_vote
-- Author: AI Assistant
-- Date: 2025-04-06

-- Create the handle_vote function
-- This function takes a media item ID and a vote type (1 for up, -1 for down).
-- It inserts a new vote or updates an existing vote for the calling user.
-- It uses SECURITY INVOKER to ensure actions are performed as the logged-in user,
-- respecting the RLS policies on user_votes.
create or replace function public.handle_vote(p_media_item_id integer, p_vote_type smallint)
returns void
language plpgsql
security invoker -- Run as the calling user to enforce RLS on user_votes
set search_path = '' -- Ensure predictable object resolution
as $$
declare
  v_user_id uuid := auth.uid();
begin
  -- Validate vote type
  if p_vote_type not in (1, -1) then
    raise exception 'Invalid vote type. Must be 1 or -1.';
  end if;

  -- Attempt to insert or update the vote
  insert into public.user_votes (user_id, media_item_id, vote_type)
  values (v_user_id, p_media_item_id, p_vote_type)
  on conflict (user_id, media_item_id) do update set
    vote_type = excluded.vote_type,
    -- Update created_at only if the row is new? No, let's keep the original creation time.
    -- We could add an updated_at column to user_votes if needed.
    created_at = public.user_votes.created_at -- Keep original timestamp
  where
    -- Only update if the new vote_type is different from the old one
    -- This prevents the trigger from firing unnecessarily if the user clicks the same button twice
    public.user_votes.vote_type is distinct from excluded.vote_type;

exception
    when others then
        -- Log error and re-raise
        raise notice 'Error in handle_vote for user % and media_item %: %', v_user_id, p_media_item_id, sqlerrm;
        raise;
end;
$$;

comment on function public.handle_vote(integer, smallint) is 'Handles inserting or updating a user vote for a specific media item. Takes media_item_id and vote_type (1 or -1).'; 