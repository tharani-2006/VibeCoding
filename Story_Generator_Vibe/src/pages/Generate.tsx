import React, { useState } from 'react';
import { Wand2, Save, Copy, RefreshCw } from 'lucide-react';
import { generateStory, saveStory } from '../services/api';
import { Loader, InlineLoader } from '../components/Loader';
import type { User, StoryFormData, GenerateStoryResponse, LoadingState } from '../types';

interface GenerateProps {
  user: User;
}

const STORY_LENGTHS = [
  { value: 'short', label: 'Short (100-300 words)' },
  { value: 'medium', label: 'Medium (300-600 words)' },
  { value: 'long', label: 'Long (600-1000 words)' }
] as const;



export const Generate: React.FC<GenerateProps> = ({ user }) => {
  const [formData, setFormData] = useState<StoryFormData>({
    title: '',
    prompt: '',
    length: 'medium'
  });
  
  const [generatedStory, setGeneratedStory] = useState<GenerateStoryResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prompt.trim()) return;

    setLoadingState('generating');
    setError('');

    try {
      const result = await generateStory({
        prompt: formData.prompt,
        length: formData.length,
        title: formData.title || undefined
      });

      setGeneratedStory(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate story');
      console.error('Story generation error:', err);
    } finally {
      setLoadingState('idle');
    }
  };

  const handleSave = async () => {
    if (!generatedStory) return;

    setLoadingState('saving');
    setError('');

    try {
      await saveStory({
        title: generatedStory.title,
        content: generatedStory.content,
        prompt: formData.prompt,
        length: formData.length
      });

      alert('Story saved to your library!');
    } catch (err: any) {
      setError(err.message || 'Failed to save story');
      console.error('Story save error:', err);
    } finally {
      setLoadingState('idle');
    }
  };

  const handleCopy = async () => {
    if (!generatedStory) return;

    try {
      await navigator.clipboard.writeText(`${generatedStory.title}\n\n${generatedStory.content}`);
      alert('Story copied to clipboard!');
    } catch (err) {
      console.error('Copy error:', err);
      alert('Failed to copy story to clipboard');
    }
  };

  const handleNewStory = () => {
    setGeneratedStory(null);
    setFormData({
      title: '',
      prompt: '',
      length: 'medium'
    });
    setError('');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--color-gray-50)', padding: 'var(--spacing-xl) 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: '800', marginBottom: 'var(--spacing-md)' }}>
            Generate Your Story
          </h1>
          <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-gray-600)', maxWidth: '600px', margin: '0 auto' }}>
            Describe your story idea and let our AI bring it to life with compelling characters and engaging plot.
          </p>
        </div>

        {!generatedStory ? (
          <div className="generator-form fade-in">
            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Story Title <span style={{ color: 'var(--color-gray-400)', fontWeight: '400' }}>(optional)</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter a title or let AI generate one..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="prompt" className="form-label">
                  Story Prompt <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <textarea
                  id="prompt"
                  name="prompt"
                  value={formData.prompt}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Describe your story idea... Include characters, setting, genre, or any specific elements you want included."
                  required
                  rows={5}
                />
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: 'var(--spacing-xs)' }}>
                  Be specific! The more details you provide, the better your story will be.
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="length" className="form-label">
                    Story Length
                  </label>
                  <select
                    id="length"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {STORY_LENGTHS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>


              </div>

              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loadingState === 'generating' || !formData.prompt.trim()}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {loadingState === 'generating' ? (
                  <>
                    <div className="spinner"></div>
                    Generating your story...
                  </>
                ) : (
                  <>
                    <Wand2 size={20} />
                    Generate Story
                  </>
                )}
              </button>
            </form>

            {loadingState === 'generating' && (
              <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <Loader message="Creating your story... This may take a moment." />
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: 'var(--spacing-lg)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-600)'
                }}>
                  <p>Our AI is crafting a unique story just for you...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="story-display fade-in">
            <h2 className="story-title">{generatedStory.title}</h2>
            <div className="story-content">{generatedStory.content}</div>
            
            <div className="story-actions">
              <button
                onClick={handleCopy}
                className="btn btn-secondary"
                disabled={loadingState !== 'idle'}
              >
                <Copy size={16} />
                Copy to Clipboard
              </button>
              
              <button
                onClick={handleSave}
                className="btn btn-primary"
                disabled={loadingState !== 'idle'}
              >
                {loadingState === 'saving' ? (
                  <InlineLoader message="Saving..." />
                ) : (
                  <>
                    <Save size={16} />
                    Save to Library
                  </>
                )}
              </button>
              
              <button
                onClick={handleNewStory}
                className="btn btn-secondary"
                disabled={loadingState !== 'idle'}
              >
                <RefreshCw size={16} />
                Generate New Story
              </button>
            </div>

            {generatedStory.tokensUsed && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: 'var(--spacing-lg)', 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--color-gray-500)' 
              }}>
                Generated using {generatedStory.tokensUsed} tokens
              </div>
            )}

            {error && (
              <div className="alert alert-error" style={{ marginTop: 'var(--spacing-lg)' }}>
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};