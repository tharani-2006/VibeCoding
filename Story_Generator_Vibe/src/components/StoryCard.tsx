import React, { useState } from 'react';
import { Calendar, Eye, Trash2, Download } from 'lucide-react';
import type { Story } from '../types';

interface StoryCardProps {
  story: Story;
  onDelete: (id: string) => void;
  onView: (story: Story) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onDelete, onView }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await onDelete(story.id);
      } catch (error) {
        console.error('Failed to delete story:', error);
        alert('Failed to delete story. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleView = () => {
    onView(story);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="story-card" onClick={handleView}>
      <div className="card-body">
        <div className="story-card-header">
          <h3 className="story-card-title">{story.title}</h3>
          <span className={`story-card-badge ${story.length}`}>
            {story.length}
          </span>
        </div>
        
        <p className="story-card-content line-clamp-3">
          {truncateContent(story.content)}
        </p>
        
        <div className="story-card-footer">
          <div className="story-card-date">
            <Calendar size={16} />
            <span>{formatDate(story.created_at)}</span>
          </div>
          
          <div className="story-card-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(story);
              }}
              className="story-card-action icon-btn-primary"
              title="View story"
              disabled={isDeleting}
            >
              <Eye size={16} />
            </button>
            
            <button
              onClick={handleDownload}
              className="story-card-action"
              title="Download as text file"
              disabled={isDeleting}
            >
              <Download size={16} />
            </button>
            
            <button
              onClick={handleDelete}
              className="story-card-action danger"
              title="Delete story"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};