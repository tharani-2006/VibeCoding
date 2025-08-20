import axios from 'axios';
import { getAuthHeaders } from './supabase';
import type { Story, GenerateStoryRequest, GenerateStoryResponse, ApiResponse } from '../types';

// Use environment variable for API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // 30 seconds for story generation
});

// Request interceptor to add auth headers
apiClient.interceptors.request.use(async (config) => {
  try {
    const headers = await getAuthHeaders();
    config.headers = { ...config.headers, ...headers };
  } catch (error) {
    console.warn('Failed to add auth headers:', error);
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to auth
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const generateStory = async (request: GenerateStoryRequest): Promise<GenerateStoryResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<GenerateStoryResponse>>('/api/generate', request);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to generate story');
    }
    
    return response.data.data!;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || 'Failed to generate story');
  }
};

export const saveStory = async (storyData: Omit<Story, 'id' | 'user_id' | 'created_at'>): Promise<Story> => {
  try {
    const response = await apiClient.post<ApiResponse<Story>>('/api/stories', storyData);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to save story');
    }
    
    return response.data.data!;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || 'Failed to save story');
  }
};

export const getStories = async (): Promise<Story[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Story[]>>('/api/stories');
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch stories');
    }
    
    return response.data.data!;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || 'Failed to fetch stories');
  }
};

export const deleteStory = async (id: string): Promise<void> => {
  try {
    const response = await apiClient.delete<ApiResponse>(`/api/stories/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete story');
    }
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || 'Failed to delete story');
  }
};