export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    error: 'Internal server error'
  };

  // Gemini API specific errors
  if (err.message?.includes('API_KEY_INVALID')) {
    error.error = 'AI service configuration error. Please contact support.';
  } else if (err.message?.includes('QUOTA_EXCEEDED')) {
    error.error = 'AI service quota exceeded. Please try again later.';
  } else if (err.message?.includes('SAFETY')) {
    error.error = 'Content safety filters were triggered. Please try a different prompt.';
  } else if (err.message?.includes('timeout')) {
    error.error = 'Request timed out. Please try again.';
  } else if (err.message?.includes('Network error') || err.code === 'ECONNREFUSED') {
    error.error = 'Network connection error. Please check your internet connection.';
  }

  // Supabase specific errors
  else if (err.message?.includes('Database error')) {
    error.error = 'Database operation failed. Please try again.';
  }

  // Validation errors
  else if (err.message?.includes('validation') || err.message?.includes('required')) {
    error.error = err.message;
  }

  // Auth errors
  else if (err.message?.includes('Unauthorized') || err.message?.includes('token')) {
    res.status(401);
    error.error = 'Authentication required. Please sign in again.';
  }

  // Rate limit errors
  else if (err.message?.includes('rate limit')) {
    res.status(429);
    error.error = 'Too many requests. Please slow down.';
  }

  // For development, include stack trace
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  const statusCode = res.statusCode || 500;
  res.status(statusCode).json(error);
};