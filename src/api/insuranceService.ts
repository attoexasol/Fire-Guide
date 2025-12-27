/// <reference types="vite/client" />
import axios from 'axios';

// TypeScript types for Insurance Coverage response
export interface InsuranceCoverageResponse {
  id: number;
  title: string;
  price: string;
  expire_date: string;
  provider_id: number | null;
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
}

export interface InsuranceApiResponse {
  status: string;
  message: string;
  data: InsuranceCoverageResponse[];
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
 * Fetch all insurance coverages
 * @returns Promise with the API response
 */
export const fetchInsuranceCoverage = async (): Promise<InsuranceCoverageResponse[]> => {
  try {
    const response = await apiClient.get<InsuranceApiResponse>('/insurance-coverage');
    
    // Handle the response structure
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data; // Direct array
    }
    
    // Fallback: return empty array if structure is unexpected
    return [];
  } catch (error) {
    console.error('Error fetching insurance coverage:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch insurance coverage',
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

