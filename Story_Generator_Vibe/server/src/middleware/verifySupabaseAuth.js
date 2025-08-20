import { supabase } from '../services/supabase.js';

export const verifySupabaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization header with Bearer token is required'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Valid access token is required'
      });
    }

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Attach user info to request object
    req.user = {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    };

    next();

  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};