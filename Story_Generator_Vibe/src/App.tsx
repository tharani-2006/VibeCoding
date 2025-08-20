import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabase';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Generate } from './pages/Generate';
import { Library } from './pages/Library';
import type { User } from './types';
import './styles/components.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at || new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at || new Date().toISOString()
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loader-container" style={{ minHeight: '100vh' }}>
        <div className="loader-spinner"></div>
        <div className="loader-text">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onSignOut={handleSignOut} />
        <Routes>
          <Route path="/" element={<Landing user={user} />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/generate" 
            element={user ? <Generate user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/library" 
            element={user ? <Library user={user} /> : <Navigate to="/auth" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;