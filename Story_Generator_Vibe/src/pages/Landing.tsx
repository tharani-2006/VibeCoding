import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Wand2, Heart, ArrowRight } from 'lucide-react';
import type { User } from '../types';

interface LandingProps {
  user: User | null;
}

export const Landing: React.FC<LandingProps> = ({ user }) => {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Create Magical Stories with AI
          </h1>
          <p className="hero-subtitle">
            Transform your ideas into captivating narratives with the power of artificial intelligence. 
            Generate, save, and share your unique stories in seconds.
          </p>
          <div className="hero-actions">
            <Link
              to={user ? "/generate" : "/auth"}
              className="btn btn-primary btn-lg"
              style={{ background: 'white', color: 'var(--color-primary)' }}
            >
              <Sparkles size={20} />
              Generate Your Story
              <ArrowRight size={20} />
            </Link>
            {!user && (
              <Link
                to="/auth"
                className="btn btn-secondary btn-lg"
                style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: 'var(--spacing-3xl) 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
            <p style={{ 
              color: 'var(--color-primary)', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              fontSize: 'var(--font-size-sm)',
              letterSpacing: '0.05em',
              marginBottom: 'var(--spacing-md)'
            }}>
              Features
            </p>
            <h2 style={{ 
              fontSize: 'var(--font-size-4xl)', 
              fontWeight: '800',
              color: 'var(--color-gray-900)',
              marginBottom: 'var(--spacing-md)'
            }}>
              Everything you need to create amazing stories
            </h2>
            <p style={{ 
              fontSize: 'var(--font-size-lg)', 
              color: 'var(--color-gray-600)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Powerful AI-driven tools designed to unleash your creativity and bring your stories to life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-lg">
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                borderRadius: 'var(--border-radius-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg)',
                color: 'white'
              }}>
                <Wand2 size={28} />
              </div>
              <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
                AI-Powered Generation
              </h3>
              <p style={{ color: 'var(--color-gray-600)' }}>
                Advanced AI technology creates unique, engaging stories based on your prompts and desired length.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                background: 'linear-gradient(135deg, var(--color-accent) 0%, #059669 100%)',
                borderRadius: 'var(--border-radius-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg)',
                color: 'white'
              }}>
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
                Personal Library
              </h3>
              <p style={{ color: 'var(--color-gray-600)' }}>
                Save, organize, and manage all your generated stories in your personal library with easy search and filtering.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
                borderRadius: 'var(--border-radius-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg)',
                color: 'white'
              }}>
                <Heart size={28} />
              </div>
              <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
                Easy Sharing
              </h3>
              <p style={{ color: 'var(--color-gray-600)' }}>
                Download your stories as text files, copy them to clipboard, or share them with friends and family effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        color: 'white',
        padding: 'var(--spacing-3xl) 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ 
            fontSize: 'var(--font-size-4xl)', 
            fontWeight: '800',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Ready to create?<br />
            Start writing with AI today.
          </h2>
          <p style={{ 
            fontSize: 'var(--font-size-lg)', 
            opacity: 0.9,
            marginBottom: 'var(--spacing-xl)',
            maxWidth: '500px',
            margin: '0 auto var(--spacing-xl)'
          }}>
            Join thousands of writers who are already creating amazing stories with our AI-powered platform.
          </p>
          <Link
            to={user ? "/generate" : "/auth"}
            className="btn btn-lg"
            style={{ 
              background: 'white', 
              color: 'var(--color-primary)',
              fontWeight: '600'
            }}
          >
            <Sparkles size={20} />
            Get Started Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};