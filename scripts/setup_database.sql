-- Media Table
CREATE TABLE public.media (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  url text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  image_url text,
  votes integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- User Votes Table
CREATE TABLE public.user_votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  media_id uuid REFERENCES public.media(id) ON DELETE CASCADE,
  vote_type text NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at timestamp with time zone DEFAULT now(),
  -- Ensure each user can only vote once per media item
  UNIQUE(user_id, media_id)
);

-- User Profiles Table
CREATE TABLE public.user_profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  bio text,
  registration_date timestamp with time zone DEFAULT now(),
  auth_provider text, -- 'google', 'email', etc.
  last_login timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Note: RLS is disabled as per requirements 