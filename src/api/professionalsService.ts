/// <reference types="vite/client" />
import axios from 'axios';

// TypeScript types for Professional API response
export interface ProfessionalResponse {
  id: number;
  name: string;
  about: string;
  location: string;
  longitude: number;
  latitude: number;
  response_time: string;
  rating: string;
  review: string;
  number: string;
  email: string;
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
}

export interface ProfessionalsPaginatedResponse {
  current_page: number;
  data: ProfessionalResponse[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ProfessionalsApiResponse {
  status: string;
  message: string;
  data: ProfessionalsPaginatedResponse;
}

// Create axios instance with base configuration
// Uses VITE_API_BASE_URL from .env file, with fallback to default URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://fireguide.attoexasolutions.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

/**
 * Fetch all professionals
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with the API response
 */
export const fetchProfessionals = async (page: number = 1): Promise<ProfessionalResponse[]> => {
  try {
    const response = await apiClient.get<ProfessionalsApiResponse>('/professional/list', {
      params: { page },
    });
    
    // Handle the paginated response structure
    if (response.data.status === 'success' && response.data.data?.data) {
      return response.data.data.data; // Access the nested data array
    }
    
    // Fallback: return empty array if structure is unexpected
    return [];
  } catch (error) {
    console.error('Error fetching professionals:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch professionals',
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

