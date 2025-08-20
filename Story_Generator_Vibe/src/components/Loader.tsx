import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const iconSize = {
    sm: 16,
    md: 24,
    lg: 32
  };

  return (
    <div className="loader-container">
      <div className="loader-spinner" style={{ 
        width: size === 'sm' ? 24 : size === 'lg' ? 48 : 32,
        height: size === 'sm' ? 24 : size === 'lg' ? 48 : 32
      }}></div>
      <div className="loader-text">
        <Sparkles size={iconSize[size]} style={{ marginRight: '8px', display: 'inline' }} />
        {message}
      </div>
    </div>
  );
};

export const InlineLoader: React.FC<{ message?: string }> = ({ message = 'Processing...' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gray-600)' }}>
    <div className="spinner"></div>
    <span style={{ fontSize: 'var(--font-size-sm)' }}>{message}</span>
  </div>
);