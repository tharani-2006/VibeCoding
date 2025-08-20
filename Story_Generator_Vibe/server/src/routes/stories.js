import express from 'express';
import { verifySupabaseAuth } from '../middleware/verifySupabaseAuth.js';
import { supabase } from '../services/supabase.js';

const router = express.Router();

// GET /api/stories - Get all stories for authenticated user
router.get('/', verifySupabaseAuth, async (req, res, next) => {
  try {
    const { data: stories, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    res.status(200).json({
      success: true,
      data: stories || []
    });

  } catch (error) {
    console.error('Get stories error:', error);
    next(error);
  }
});

// POST /api/stories - Save new story
router.post('/', verifySupabaseAuth, async (req, res, next) => {
  try {
    const { title, content, prompt, length } = req.body;

    // Validate required fields
    if (!title || !content || !prompt || !length) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, content, prompt, and length are required'
      });
    }

    if (!['short', 'medium', 'long'].includes(length)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid length value'
      });
    }

    // Insert story into database
    const { data: story, error } = await supabase
      .from('stories')
      .insert({
        user_id: req.user.id,
        title: title.trim(),
        content: content.trim(),
        prompt: prompt.trim(),
        length
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    res.status(201).json({
      success: true,
      data: story,
      message: 'Story saved successfully'
    });

  } catch (error) {
    console.error('Save story error:', error);
    next(error);
  }
});

// DELETE /api/stories/:id - Delete story
router.delete('/:id', verifySupabaseAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Story ID is required'
      });
    }

    // Delete story (only if it belongs to the user)
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    res.status(200).json({
      success: true,
      message: 'Story deleted successfully'
    });

  } catch (error) {
    console.error('Delete story error:', error);
    next(error);
  }
});

export { router as storiesRoute };