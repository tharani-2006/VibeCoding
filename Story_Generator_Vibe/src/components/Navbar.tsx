import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, User as UserIcon, LogOut, Sparkles } from 'lucide-react';
import { signOut } from '../services/supabase';
import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      onSignOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Sparkles size={24} />
          <span>StoryAI</span>
        </Link>

        <div className="navbar-nav">
          {user ? (
            <>
              <Link
                to="/generate"
                className={`navbar-link ${isActive('/generate') ? 'active' : ''}`}
              >
                <Sparkles size={16} />
                <span>Generate</span>
              </Link>
              
              <Link
                to="/library"
                className={`navbar-link ${isActive('/library') ? 'active' : ''}`}
              >
                <BookOpen size={16} />
                <span>Library</span>
              </Link>

              <div className="navbar-user">
                <div className="navbar-user-info">
                  <UserIcon size={16} />
                  <span className="navbar-user-email">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="icon-btn icon-btn-danger"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};