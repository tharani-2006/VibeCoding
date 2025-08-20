export interface Story {
  id: string;
  user_id: string;
  title: string;
  content: string;
  prompt: string;
  length: 'short' | 'medium' | 'long';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface GenerateStoryRequest {
  prompt: string;
  length: 'short' | 'medium' | 'long';
  title?: string;
}

export interface GenerateStoryResponse {
  id?: string;
  title: string;
  content: string;
  tokensUsed?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StoryFormData {
  title?: string;
  prompt: string;
  length: 'short' | 'medium' | 'long';
}

export type LoadingState = 'idle' | 'generating' | 'saving' | 'deleting';