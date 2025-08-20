# 🚀 Quick Setup Guide

## 📋 What I Fixed

✅ **Removed all `tone` and `metadata` field references** from:
- Backend routes (`stories.js`, `generate.js`)
- Frontend components (`Generate.tsx`)
- Type definitions (`types/index.ts`)
- Gemini AI client

✅ **Updated backend code** to match your existing Supabase table structure

## 🔧 Setup Steps

### 1. Create Environment Files

**Create `server/.env`:**
```bash
cd server
cp env.example .env
```

**Edit `server/.env`:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
PORT=3001
```

**Create `.env` in root:**
```bash
cd ..
cp env.example .env
```

**Edit `.env`:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_BASE_URL=http://localhost:3001
```

### 2. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ..
npm install
```

### 3. Start the Project

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🗄️ Your Current Supabase Table

Your table structure is perfect as-is:
```sql
CREATE TABLE stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  prompt text NOT NULL,
  length text NOT NULL CHECK (length IN ('short', 'medium', 'long')),
  created_at timestamptz DEFAULT now()
);
```

## ✅ Ready to Run!

The project should now work perfectly with your existing Supabase table structure. No database changes needed!
