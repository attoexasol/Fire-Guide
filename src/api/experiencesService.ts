/// <reference types="vite/client" />
import axios from 'axios';

// TypeScript types for Experiences response
export interface ExperienceResponse {
  id: number;
  years_experience: string;
  assessment: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: number;
    user_name: string;
  } | null;
  updater: {
    id: number;
    user_name: string;
  } | null;
  professional: {
    id: number;
    name: string;
  } | null;
  specialization: {
    id: number;
    title: string;
  } | null;
}

export interface ExperiencesApiResponse {
  status: string;
  message: string;
  data: ExperienceResponse[];
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://fireguide.attoexasolutions.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

/**
 * Fetch all experiences
 * @returns Promise with the API response
 */
export const fetchExperiences = async (): Promise<ExperienceResponse[]> => {
  try {
    const response = await apiClient.get<ExperiencesApiResponse>('/experiences');
    
    // Handle the response structure
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data; // Direct array
    }
    
    // Fallback: return empty array if structure is unexpected
    return [];
  } catch (error) {
    console.error('Error fetching experiences:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch experiences',
          error: error.response.data?.error || error.message,
          status: error.response.status,
        };
      } else if (error.request) {
        throw {
          success: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
        };
      }
    }
    throw {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

