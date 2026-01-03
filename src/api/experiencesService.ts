/// <reference types="vite/client" />
import axios from 'axios';

// TypeScript types for Experience API response
export interface ExperienceCreator {
  id: number;
  full_name: string;
}

export interface ExperienceUpdater {
  id: number;
  full_name: string;
}

export interface ExperienceProfessional {
  id: number;
  name: string | null;
}

export interface ExperienceSpecialization {
  id: number;
  title: string;
}

export interface ExperienceResponse {
  id: number;
  years_experience: string;
  assessment: string;
  created_at: string;
  updated_at: string;
  creator: ExperienceCreator;
  updater: ExperienceUpdater | null;
  professional: ExperienceProfessional;
  specialization: ExperienceSpecialization;
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
    console.log('Experiences API Response:', response.data);
    
    // Handle the response structure: { status: 'success', data: [...] }
    if (response.data.status === 'success' && response.data.data) {
      if (Array.isArray(response.data.data)) {
        console.log('Experiences found:', response.data.data.length);
        return response.data.data;
      }
    }
    
    // Fallback: return empty array if structure is unexpected
    console.warn('Unexpected experiences API response structure:', response.data);
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

// TypeScript types for Create Experience request
export interface CreateExperienceRequest {
  api_token: string;
  years_experience: string;
  assessment: string;
  specialization_id: number;
  professional_id: number;
}

// TypeScript types for Create Experience response
export interface CreateExperienceResponse {
  status: string;
  message: string;
  data?: ExperienceResponse;
  success?: boolean;
  error?: string;
}

/**
 * Create a new experience
 * @param data - Experience creation data
 * @returns Promise with the API response
 */
export const createExperience = async (
  data: CreateExperienceRequest
): Promise<CreateExperienceResponse> => {
  try {
    const response = await apiClient.post<CreateExperienceResponse>(
      '/experiences/store',
      {
        api_token: data.api_token,
        years_experience: data.years_experience,
        assessment: data.assessment,
        specialization_id: data.specialization_id,
        professional_id: data.professional_id
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating experience:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create experience',
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

// TypeScript types for Update Experience request
export interface UpdateExperienceRequest {
  api_token: string;
  id: number;
  years_experience: string;
  assessment: string;
  specialization_id: number;
  professional_id: number;
}

// TypeScript types for Update Experience response
export interface UpdateExperienceResponse {
  status: string;
  message: string;
  data?: ExperienceResponse;
  success?: boolean;
  error?: string;
}

/**
 * Update an existing experience
 * @param data - Experience update data
 * @returns Promise with the API response
 */
export const updateExperience = async (
  data: UpdateExperienceRequest
): Promise<UpdateExperienceResponse> => {
  try {
    const response = await apiClient.post<UpdateExperienceResponse>(
      '/experiences/update',
      {
        api_token: data.api_token,
        id: data.id,
        years_experience: data.years_experience,
        assessment: data.assessment,
        specialization_id: data.specialization_id,
        professional_id: data.professional_id
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating experience:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to update experience',
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

// TypeScript types for Delete Experience request
export interface DeleteExperienceRequest {
  api_token: string;
  id: number;
}

// TypeScript types for Delete Experience response
export interface DeleteExperienceResponse {
  status?: string;
  success?: boolean;
  message?: string;
  error?: string;
}

/**
 * Delete an experience
 * @param data - Experience deletion data
 * @returns Promise with the API response
 */
export const deleteExperience = async (
  data: DeleteExperienceRequest
): Promise<DeleteExperienceResponse> => {
  try {
    const response = await apiClient.post<DeleteExperienceResponse>(
      '/experiences/delete',
      {
        api_token: data.api_token,
        id: data.id
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting experience:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to delete experience',
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
