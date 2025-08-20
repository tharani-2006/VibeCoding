# RERN AI Story Generator

A full-stack AI-powered story generation application built with React, Express, and Supabase.

## Features

- 🤖 **AI Story Generation**: Powered by Google Gemini API
- 📚 **Personal Library**: Save, organize, and manage your stories
- 🔐 **Magic Link Auth**: Secure authentication via Supabase
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 📄 **Export Stories**: Download individual stories or your entire library
- 🎨 **Modern UI**: Clean, accessible interface without framework dependencies

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- Axios for HTTP requests
- Plain CSS with CSS Modules (no Tailwind)
- Supabase client for authentication

### Backend
- Node.js with Express
- Google Gemini AI API
- Supabase for database and authentication
- Rate limiting and security middleware
- Helmet for security headers

### Database & Auth
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Magic link authentication
- File storage bucket (for future features)

## Quick Start

### Prerequisites

1. **Supabase Project**: Create a project at [supabase.com](https://supabase.com)
2. **Google AI API Key**: Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Environment Setup

1. Copy the environment example:
```bash
cp .env.example .env
```

2. Fill in your environment variables:
```env
# Frontend
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:3001/api

# Backend (for server/.env)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
PORT=3001
```

### Database Setup

Run the SQL migration in your Supabase SQL editor:

```sql
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
```

### Development

1. **Install dependencies**:
```bash
# Frontend
npm install

# Backend
cd server
npm install
```

2. **Start the backend server**:
```bash
cd server
npm run dev
```

3. **Start the frontend** (in a new terminal):
```bash
npm run dev
```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## API Endpoints

### Authentication
All protected endpoints require a Bearer token from Supabase auth.

### Story Generation
- `POST /api/generate`
  - Body: `{ prompt, length, tone?, title? }`
  - Returns: `{ success, data: { title, content, tokensUsed } }`

### Story Management
- `GET /api/stories` - Get user's stories
- `POST /api/stories` - Save a new story
- `DELETE /api/stories/:id` - Delete a story

## Deployment

### Frontend (Vercel)

1. **Build the frontend**:
```bash
npm run build
```

2. **Deploy to Vercel**:
   - Connect your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy from the root directory

### Backend (Render)

1. **Create a `render.yaml`**:
```yaml
services:
  - type: web
    name: ai-story-generator-api
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: SUPABASE_URL
        fromSecret: SUPABASE_URL
      - key: SUPABASE_SERVICE_KEY
        fromSecret: SUPABASE_SERVICE_KEY
      - key: GEMINI_API_KEY
        fromSecret: GEMINI_API_KEY
```

2. **Deploy to Render**:
   - Connect your GitHub repository
   - Set environment variables as secrets
   - Deploy the service

### Environment Variables

**Frontend (Vercel)**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL` (your Render API URL)

**Backend (Render)**:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `GEMINI_API_KEY`
- `NODE_ENV=production`

## Features in Detail

### Story Generation
- Multiple length options (short, medium, long)
- Genre/tone selection (Adventure, Comedy, Drama, etc.)
- Custom prompts with intelligent AI processing
- Real-time generation with loading states

### Personal Library
- Save unlimited stories
- Search and filter functionality
- Individual story viewing in modal
- Bulk download of all stories
- Individual story download as text files

### Authentication
- Passwordless magic link authentication
- Secure JWT token handling
- Persistent sessions
- Automatic token refresh

### Security Features
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Row Level Security in database
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the GitHub issues
2. Review the deployment guides
3. Verify your environment variables
4. Check API rate limits

## Roadmap

- [ ] Story editing capabilities
- [ ] Story sharing and collaboration
- [ ] Audio narration generation
- [ ] Story illustration with AI images
- [ ] Export to multiple formats (PDF, EPUB)
- [ ] Story templates and prompts library
- [ ] Social features (likes, comments)