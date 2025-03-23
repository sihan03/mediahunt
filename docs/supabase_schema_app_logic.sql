-- Media Table
CREATE TABLE public.mediatable (
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
  media_id uuid REFERENCES public.mediatable(id) ON DELETE CASCADE,
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

-- Enable RLS
ALTER TABLE public.mediatable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mediatable
CREATE POLICY "Anyone can read mediatable" 
ON public.mediatable FOR SELECT 
TO authenticated, anon
USING (true);

CREATE POLICY "Authenticated users can insert media" 
ON public.mediatable FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update vote counts 
-- (needed since we're handling votes in application code)
CREATE POLICY "Authenticated users can update media votes" 
ON public.mediatable FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- RLS Policies for user_votes
CREATE POLICY "Users can read their own votes" 
ON public.user_votes FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own votes" 
ON public.user_votes FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" 
ON public.user_votes FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
ON public.user_votes FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for user_profiles
CREATE POLICY "Users can read any profile" 
ON public.user_profiles FOR SELECT 
TO authenticated, anon
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

