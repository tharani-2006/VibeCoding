/*
  # Enhanced Stories Table Schema

  1. New Tables
    - `stories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, story title)
      - `content` (text, story content)
      - `prompt` (text, original user prompt)
      - `length` (text, story length: short, medium, long)
      - `tone` (text, story tone/genre)
      - `metadata` (jsonb, additional metadata like token usage)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `stories` table
    - Add policies for users to manage their own stories

  3. Storage
    - Create `story_assets` bucket for future audio/image assets
*/

-- Create stories table with enhanced schema
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  prompt text NOT NULL,
  length text NOT NULL CHECK (length IN ('short', 'medium', 'long')),
  tone text DEFAULT NULL,
  metadata jsonb DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS stories_user_id_idx ON stories(user_id);
CREATE INDEX IF NOT EXISTS stories_created_at_idx ON stories(created_at DESC);

-- Enable RLS
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stories table
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own stories" ON stories;
  DROP POLICY IF EXISTS "Users can insert their own stories" ON stories;
  DROP POLICY IF EXISTS "Users can update their own stories" ON stories;
  DROP POLICY IF EXISTS "Users can delete their own stories" ON stories;
  
  -- Create new policies
  CREATE POLICY "Users can view their own stories"
    ON stories
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own stories"
    ON stories
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update their own stories"
    ON stories
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete their own stories"
    ON stories
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
END $$;

-- Create storage bucket for story assets (future use)
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('story_assets', 'story_assets', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Storage policies for story_assets bucket
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can upload story assets" ON storage.objects;
  DROP POLICY IF EXISTS "Users can view story assets" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their story assets" ON storage.objects;
  
  -- Create storage policies
  CREATE POLICY "Users can upload story assets"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'story_assets' 
      AND auth.uid()::text = (storage.foldername(name))[1]
    );

  CREATE POLICY "Users can view story assets"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'story_assets');

  CREATE POLICY "Users can delete their story assets"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'story_assets' 
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
END $$;