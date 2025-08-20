import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Download, Trash2 } from 'lucide-react';
import { getStories, deleteStory } from '../services/api';
import { StoryCard } from '../components/StoryCard';
import { StoryModal } from '../components/Modal';
import { Loader } from '../components/Loader';
import type { User, Story } from '../types';

interface LibraryProps {
  user: User;
}

export const Library: React.FC<LibraryProps> = ({ user }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    // Filter stories based on search query
    if (!searchQuery.trim()) {
      setFilteredStories(stories);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = stories.filter(story => 
        story.title.toLowerCase().includes(query) ||
        story.content.toLowerCase().includes(query) ||
        story.prompt.toLowerCase().includes(query)
      );
      setFilteredStories(filtered);
    }
  }, [stories, searchQuery]);

  const loadStories = async () => {
    try {
      setLoading(true);
      setError('');
      const userStories = await getStories();
      // Sort stories by creation date (newest first)
      const sortedStories = userStories.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setStories(sortedStories);
    } catch (err: any) {
      setError(err.message || 'Failed to load stories');
      console.error('Load stories error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      await deleteStory(id);
      setStories(prev => prev.filter(story => story.id !== id));
      
      // Close modal if the deleted story was being viewed
      if (selectedStory?.id === id) {
        setSelectedStory(null);
      }
    } catch (err: any) {
      console.error('Delete story error:', err);
      throw err;
    }
  };

  const handleViewStory = (story: Story) => {
    setSelectedStory(story);
  };

  const handleDownloadAll = () => {
    if (stories.length === 0) return;

    const allStoriesText = stories.map(story => 
      `${story.title}\nCreated: ${new Date(story.created_at).toLocaleDateString()}\nLength: ${story.length}\n\n${story.content}\n\n${'='.repeat(50)}\n`
    ).join('\n');

    const blob = new Blob([allStoriesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_stories_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Loader message="Loading your stories..." />
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--color-gray-50)', padding: 'var(--spacing-xl) 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: '800', marginBottom: 'var(--spacing-sm)' }}>
                Your Story Library
              </h1>
              <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-gray-600)' }}>
                {stories.length} {stories.length === 1 ? 'story' : 'stories'} saved
              </p>
            </div>
            
            {stories.length > 0 && (
              <button
                onClick={handleDownloadAll}
                className="btn btn-secondary"
              >
                <Download size={16} />
                Download All
              </button>
            )}
          </div>

          {/* Search */}
          {stories.length > 0 && (
            <div style={{ position: 'relative', maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
              <Search 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--color-gray-400)'
                }} 
              />
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-xl)' }}>
            {error}
            <button
              onClick={loadStories}
              className="btn btn-sm btn-secondary"
              style={{ marginLeft: 'var(--spacing-md)' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {stories.length === 0 && !error && (
          <div className="empty-state">
            <BookOpen size={64} className="empty-state-icon" />
            <h3 className="empty-state-title">No stories yet</h3>
            <p className="empty-state-description">
              Start creating your first AI-generated story to build your personal library.
            </p>
            <a href="/generate" className="btn btn-primary">
              Generate Your First Story
            </a>
          </div>
        )}

        {/* Stories Grid */}
        {filteredStories.length > 0 && (
          <div className="library-grid">
            {filteredStories.map(story => (
              <StoryCard
                key={story.id}
                story={story}
                onDelete={handleDeleteStory}
                onView={handleViewStory}
              />
            ))}
          </div>
        )}

        {/* No Search Results */}
        {stories.length > 0 && filteredStories.length === 0 && searchQuery && (
          <div className="empty-state">
            <Search size={64} className="empty-state-icon" />
            <h3 className="empty-state-title">No stories found</h3>
            <p className="empty-state-description">
              No stories match your search "{searchQuery}". Try a different search term.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="btn btn-secondary"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Story Modal */}
        {selectedStory && (
          <StoryModal
            isOpen={true}
            onClose={() => setSelectedStory(null)}
            story={selectedStory}
          />
        )}
      </div>
    </div>
  );
};