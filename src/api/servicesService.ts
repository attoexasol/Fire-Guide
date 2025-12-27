/// <reference types="vite/client" />
import axios from 'axios';

// TypeScript types for API response
export interface ServiceResponse {
  id: number;
  service_name: string;
  type?: string;
  status: string;
  price: string;
  icon: string | null;
  description: string;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ServicesPaginatedResponse {
  current_page: number;
  data: ServiceResponse[];
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

export interface ServicesApiResponse {
  status: string;
  message: string;
  data: ServicesPaginatedResponse;
}

// TypeScript types for Property Type API response
export interface PropertyTypeResponse {
  id: number;
  property_type_name: string;
  property_type_description: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyTypesPaginatedResponse {
  current_page: number;
  data: PropertyTypeResponse[];
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

export interface PropertyTypesApiResponse {
  status: string;
  message: string;
  data: PropertyTypesPaginatedResponse;
}

// TypeScript types for Approximate People API response
export interface ApproximatePeopleResponse {
  id: number;
  number_of_people: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  creator?: number | null;
  updater?: number | null;
}

export interface ApproximatePeopleApiResponse {
  status: string;
  message: string;
  data: ApproximatePeopleResponse[];
}

// Create axios instance with base configuration
// Uses VITE_API_BASE_URL from .env file, with fallback to default URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

/**
 * Fetch all services
 * @returns Promise with the API response
 */
export const fetchServices = async (): Promise<ServiceResponse[]> => {
  try {
    const response = await apiClient.get<ServicesApiResponse>('/services');
    
    // Handle the paginated response structure
    if (response.data.status === 'success' && response.data.data?.data) {
      return response.data.data.data; // Access the nested data array
    }
    
    // Fallback: return empty array if structure is unexpected
    return [];
  } catch (error) {
    console.error('Error fetching services:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch services',
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
 * Fetch all property types
 * @returns Promise with the API response
 */
export const fetchPropertyTypes = async (): Promise<PropertyTypeResponse[]> => {
  try {
    const response = await apiClient.get<PropertyTypesApiResponse>('/all/property_types');
    
    // Handle the paginated response structure
    if (response.data.status === 'success' && response.data.data?.data) {
      return response.data.data.data; // Access the nested data array
    }
    
    // Fallback: return empty array if structure is unexpected
    return [];
  } catch (error) {
    console.error('Error fetching property types:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch property types',
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
 * Fetch all approximate people options
 * @returns Promise with the API response
 */
export const fetchApproximatePeople = async (): Promise<ApproximatePeopleResponse[]> => {
  try {
    const response = await apiClient.get<ApproximatePeopleApiResponse>('/approximate-people');
    
    // Handle the response structure
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data; // Direct array, not paginated
    }
    
    // Fallback: return empty array if structure is unexpected
    return [];
  } catch (error) {
    console.error('Error fetching approximate people:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch approximate people',
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

// TypeScript types for Selected Service Store request
export interface SelectedServiceStoreRequest {
  api_token: string;
  service_id: number;
  property_type_id: number;
  approximate_people_id: number;
  number_of_floors: string;
  preferred_date: string;
  access_note: string;
  post_code: string;
  search_radius: string;
}

export interface SelectedServiceStoreResponse {
  status: string;
  message: string;
  data?: any;
}

/**
 * Store selected service with all details
 * @param data - Selected service data
 * @returns Promise with the API response
 */
export const storeSelectedService = async (data: SelectedServiceStoreRequest): Promise<SelectedServiceStoreResponse> => {
  try {
    const response = await apiClient.post<SelectedServiceStoreResponse>('/selected_services/store', data);
    return response.data;
  } catch (error) {
    console.error('Error storing selected service:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to store selected service',
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

