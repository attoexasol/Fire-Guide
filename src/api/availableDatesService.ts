import axios from 'axios';

// Types for available dates API
export interface AvailableDateItem {
  id: number;
  date: string;
  slot: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: number;
    full_name: string;
  } | null;
  updater: {
    id: number;
    full_name: string;
  } | null;
  professional: {
    id: number;
    name: string | null;
  } | null;
}

export interface AvailableDatesApiResponse {
  status: string;
  message: string;
  data: AvailableDateItem[];
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://fireguide.attoexasolutions.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

export interface CreateAvailableDateRequest {
  api_token: string;
  date: string;
  slot: string;
  professional_id: number;
}

export interface CreateAvailableDateResponse {
  status?: string;
  success?: boolean;
  message?: string;
  error?: string;
  data?: AvailableDateItem;
}

export interface UpdateAvailableDateRequest {
  api_token: string;
  id: number;
  date: string;
  slot: string;
}

export interface UpdateAvailableDateResponse {
  status?: string;
  success?: boolean;
  message?: string;
  error?: string;
  data?: AvailableDateItem;
}

export interface DeleteAvailableDateRequest {
  api_token: string;
  id: number;
}

export interface DeleteAvailableDateResponse {
  status?: string;
  success?: boolean;
  message?: string;
  error?: string;
}

/**
 * Fetch all available dates
 * @returns Promise with the API response
 */
export const fetchAvailableDates = async (): Promise<AvailableDateItem[]> => {
  try {
    const response = await apiClient.get<AvailableDatesApiResponse>('/available-dates');
    
    // Handle the response structure
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data; // Direct array
    }
    
    // Fallback: return empty array if structure is unexpected
    return [];
  } catch (error) {
    console.error('Error fetching available dates:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch available dates',
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

/**
 * Create a new available date
 * @param data - Available date creation data
 * @returns Promise with the API response
 */
export const createAvailableDate = async (data: CreateAvailableDateRequest): Promise<CreateAvailableDateResponse> => {
  try {
    const response = await apiClient.post<CreateAvailableDateResponse>('/available-dates/create', data);
    return response.data;
  } catch (error) {
    console.error('Error creating available date:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create available date',
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

/**
 * Update an existing available date
 * @param data - Available date update data
 * @returns Promise with the API response
 */
export const updateAvailableDate = async (data: UpdateAvailableDateRequest): Promise<UpdateAvailableDateResponse> => {
  try {
    const response = await apiClient.post<UpdateAvailableDateResponse>('/available-dates/update', data);
    return response.data;
  } catch (error) {
    console.error('Error updating available date:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to update available date',
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

/**
 * Delete an available date
 * @param data - Available date deletion data
 * @returns Promise with the API response
 */
export const deleteAvailableDate = async (data: DeleteAvailableDateRequest): Promise<DeleteAvailableDateResponse> => {
  try {
    const response = await apiClient.post<DeleteAvailableDateResponse>('/available-dates/delete', data);
    return response.data;
  } catch (error) {
    console.error('Error deleting available date:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to delete available date',
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
