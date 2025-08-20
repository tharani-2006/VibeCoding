/*
  # Create stories table and storage setup

  1. New Tables
    - `stories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `content` (text)
      - `prompt` (text) - original user prompt
      - `length` (text) - short, medium, long
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `stories` table
    - Add policy for users to manage their own stories
    - Create storage bucket for story assets

  3. Storage
    - Create `story_assets` bucket for images/audio
*/

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  prompt text NOT NULL,
  length text NOT NULL CHECK (length IN ('short', 'medium', 'long')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('story_assets', 'story_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload story assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'story_assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view story assets"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'story_assets');

CREATE POLICY "Users can delete their story assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'story_assets' AND auth.uid()::text = (storage.foldername(name))[1]);