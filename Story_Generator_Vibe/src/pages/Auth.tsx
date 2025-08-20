import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { signInWithMagicLink } from '../services/supabase';

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await signInWithMagicLink(email);
      
      if (signInError) {
        setError(signInError.message);
      } else {
        setSent(true);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <div className="auth-success">
            <CheckCircle size={48} className="auth-success-icon" />
            <h2 className="auth-success-title">Check your email</h2>
            <p className="auth-success-description">
              We've sent a magic link to <strong>{email}</strong>. Click the link in your email to sign in.
            </p>
            <div className="alert alert-info" style={{ textAlign: 'left', marginBottom: 'var(--spacing-lg)' }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
                <strong>Note:</strong> The magic link will expire in 1 hour. If you don't see the email, check your spam folder.
              </p>
            </div>
            <button
              onClick={() => {
                setSent(false);
                setEmail('');
                setError('');
              }}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Try another email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <Link 
          to="/"
          className="flex items-center gap-sm"
          style={{ 
            color: 'var(--color-primary)', 
            textDecoration: 'none',
            fontSize: 'var(--font-size-sm)',
            marginBottom: 'var(--spacing-xl)'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to home</span>
        </Link>
        
        <div className="auth-form-header">
          <h2 className="auth-form-title">Welcome to StoryAI</h2>
          <p className="auth-form-subtitle">
            Sign in with your email to start generating amazing stories
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email address"
                style={{ paddingRight: '40px' }}
              />
              <Mail 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--color-gray-400)'
                }} 
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} style={{ marginRight: 'var(--spacing-sm)' }} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ marginRight: 'var(--spacing-sm)' }}></div>
                Sending magic link...
              </>
            ) : (
              <>
                <Mail size={18} />
                Send magic link
              </>
            )}
          </button>

          <div style={{ 
            marginTop: 'var(--spacing-lg)', 
            padding: 'var(--spacing-md)', 
            background: 'var(--color-gray-50)', 
            borderRadius: 'var(--border-radius-md)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-600)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0 }}>
              We'll send you a secure link to sign in.<br />
              No password required!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};