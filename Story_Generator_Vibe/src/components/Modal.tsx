import React from 'react';
import { X } from 'lucide-react';
import type { Story } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story;
}

export const StoryModal: React.FC<ModalProps> = ({ isOpen, onClose, story }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    const content = `${story.title}\n\n${story.content}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${story.title}\n\n${story.content}`);
      alert('Story copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy story:', error);
      alert('Failed to copy story to clipboard.');
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal fade-in">
        <div className="modal-header">
          <h2 className="modal-title">{story.title}</h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
            <strong>Length:</strong> {story.length} | <strong>Created:</strong> {new Date(story.created_at).toLocaleDateString()}
          </div>
          <div className="story-content">
            {story.content}
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={handleCopy} className="btn btn-secondary">
            Copy Text
          </button>
          <button onClick={handleDownload} className="btn btn-primary">
            Download
          </button>
        </div>
      </div>
    </div>
  );
};