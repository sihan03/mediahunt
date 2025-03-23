# Media Hunt Database Schema (Application Logic)

This document outlines the simplified database schema for the Media Hunt application, designed to have vote handling and business logic implemented in the application code rather than database triggers.

## Tables

### 1. mediatable

Stores information about media sources.

```sql
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
```

### 2. user_votes

Tracks user votes on media items.

```sql
CREATE TABLE public.user_votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  media_id uuid REFERENCES public.mediatable(id) ON DELETE CASCADE,
  vote_type text NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, media_id)
);
```

### 3. user_profiles

Stores extended user information beyond the default Supabase auth.users table.

```sql
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
```

## Row Level Security (RLS) Policies

### mediatable Policies
```sql
-- Anyone can read media items
CREATE POLICY "Anyone can read mediatable" 
ON public.mediatable FOR SELECT 
TO authenticated, anon
USING (true);

-- Authenticated users can add new media items
CREATE POLICY "Authenticated users can insert media" 
ON public.mediatable FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Authenticated users can update vote counts
CREATE POLICY "Authenticated users can update media votes" 
ON public.mediatable FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);
```

### user_votes Policies
```sql
-- Users can read their own votes
CREATE POLICY "Users can read their own votes" 
ON public.user_votes FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own votes
CREATE POLICY "Users can insert their own votes" 
ON public.user_votes FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own votes
CREATE POLICY "Users can update their own votes" 
ON public.user_votes FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete their own votes" 
ON public.user_votes FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);
```

### user_profiles Policies
```sql
-- Anyone can read user profiles
CREATE POLICY "Users can read any profile" 
ON public.user_profiles FOR SELECT 
TO authenticated, anon
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.user_profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

## Functions and Triggers

Left blank for now