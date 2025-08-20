/*
  # Create stories table for AI Story Generator

  1. New Tables
    - `stories`
      - `id` (uuid, primary key) - unique identifier for each story
      - `user_id` (uuid, indexed) - reference to Supabase auth user
      - `title` (text) - story title
      - `content` (text) - full story content
      - `metadata` (jsonb) - additional data like length, tokens used, tone
      - `created_at` (timestamptz) - creation timestamp

  2. Security
    - Enable RLS on `stories` table
    - Add policy for authenticated users to read their own stories
    - Add policy for authenticated users to insert their own stories
    - Add policy for authenticated users to delete their own stories

  3. Indexes
    - Index on user_id for efficient story retrieval
    - Index on created_at for chronological sorting
*/

CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create index for efficient user story queries
CREATE INDEX IF NOT EXISTS stories_user_id_idx ON stories(user_id);
CREATE INDEX IF NOT EXISTS stories_created_at_idx ON stories(created_at DESC);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own stories
CREATE POLICY "Users can read own stories"
  ON stories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own stories
CREATE POLICY "Users can insert own stories"
  ON stories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own stories
CREATE POLICY "Users can delete own stories"
  ON stories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);