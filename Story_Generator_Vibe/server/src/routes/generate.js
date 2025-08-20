import express from 'express';
import { verifySupabaseAuth } from '../middleware/verifySupabaseAuth.js';
import { generateStory } from '../services/geminiClient.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Specific rate limit for story generation (more restrictive)
const generateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Allow 5 story generations per minute per IP
  message: {
    success: false,
    error: 'Story generation rate limit exceeded. Please wait before generating another story.'
  }
});

// POST /api/generate
router.post('/', generateLimiter, verifySupabaseAuth, async (req, res, next) => {
  try {
    const { prompt, length = 'medium', title } = req.body;

    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a story prompt with at least 10 characters'
      });
    }

    if (!['short', 'medium', 'long'].includes(length)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid story length. Must be short, medium, or long'
      });
    }

    // Generate story using Gemini API
    const storyResult = await generateStory({
      prompt: prompt.trim(),
      length,
      title: title?.trim()
    });

    res.status(200).json({
      success: true,
      data: storyResult
    });

  } catch (error) {
    console.error('Story generation error:', error);
    next(error);
  }
});

export { router as generateRoute };