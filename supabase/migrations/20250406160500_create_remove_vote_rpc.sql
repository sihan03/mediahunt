-- Migration: Create remove_vote RPC function
-- Description: Creates a function to handle removing a user's vote atomically.
-- Functions created: public.remove_vote
-- Author: AI Assistant
-- Date: 2025-04-06

-- Create the remove_vote function
-- This function takes a media item ID and removes the calling user's vote for that item.
-- It uses SECURITY INVOKER to ensure actions are performed as the logged-in user,
-- respecting the RLS policies on user_votes.
create or replace function public.remove_vote(p_media_item_id integer)
returns void
language plpgsql
security invoker -- Run as the calling user to enforce RLS on user_votes
set search_path = '' -- Ensure predictable object resolution
as $$
declare
  v_user_id uuid := auth.uid();
begin
  -- Attempt to delete the vote
  delete from public.user_votes
  where user_id = v_user_id and media_item_id = p_media_item_id;

exception
    when others then
        -- Log error and re-raise
        raise notice 'Error in remove_vote for user % and media_item %: %', v_user_id, p_media_item_id, sqlerrm;
        raise;
end;
$$;

comment on function public.remove_vote(integer) is 'Handles removing a user vote for a specific media item. Takes media_item_id.'; 