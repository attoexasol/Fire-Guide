/// <reference types="vite/client" />
import axios from 'axios';

// TypeScript types for Professional API response
export interface ProfessionalResponse {
  id: number;
  name: string;
  business_name?: string;
  about: string;
  location?: string;
  business_location?: string;
  longitude: number | null;
  latitude: number | null;
  post_code?: string;
  response_time: string | null;
  rating: string | null;
  review: string | null;
  number: string;
  email: string;
  user_id?: number;
  created_at: string;
  updated_at: string;
  creator: {
    id: number;
    user_name?: string;
    full_name?: string;
  } | null;
  updater: {
    id: number;
    user_name?: string;
    full_name?: string;
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

// TypeScript types for create professional request
export interface CreateProfessionalRequest {
  api_token: string;
  name: string;
  business_name: string;
  about: string;
  email: string;
  number: string;
  business_location: string;
  post_code: string;
  services: Array<{
    service_id: number;
  }>;
  certificate_name?: string;
  description?: string;
  evidence?: string;
  status?: string;
}

// TypeScript types for create professional response
export interface CreateProfessionalResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: any;
  error?: string;
}

/**
 * Create a professional profile
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional/create
 * Method: POST
 * @param data - Professional profile data
 * @returns Promise with the API response
 */
export const createProfessional = async (
  data: CreateProfessionalRequest
): Promise<CreateProfessionalResponse> => {
  try {
    // Build request body exactly as per API specification
    const requestBody: any = {
      api_token: data.api_token,
      name: data.name,
      business_name: data.business_name,
      about: data.about,
      email: data.email,
      number: data.number,
      business_location: data.business_location,
      post_code: data.post_code,
      services: data.services,
    };

    // Add optional certification fields only if provided
    if (data.certificate_name) {
      requestBody.certificate_name = data.certificate_name;
    }
    if (data.description) {
      requestBody.description = data.description;
    }
    if (data.evidence) {
      requestBody.evidence = data.evidence;
    }
    if (data.status) {
      requestBody.status = data.status;
    }

    console.log('POST /professional/create - Request payload:', {
      endpoint: '/professional/create',
      hasApiToken: !!requestBody.api_token,
      name: requestBody.name,
      business_name: requestBody.business_name,
      email: requestBody.email,
      number: requestBody.number,
      business_location: requestBody.business_location,
      post_code: requestBody.post_code,
      services_count: requestBody.services.length,
      services: requestBody.services,
      certificate_name: requestBody.certificate_name || 'not provided',
      description: requestBody.description || 'not provided',
      evidence: requestBody.evidence || 'not provided',
      status: requestBody.status || 'not provided'
    });

    const response = await apiClient.post<CreateProfessionalResponse>(
      '/professional/create',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional/create - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating professional profile:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create professional profile',
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

// TypeScript types for get selected service request
export interface GetSelectedServiceRequest {
  professional_id: number;
  api_token?: string;
}

// Selected service item from API
export interface SelectedServiceItem {
  id: number;
  professional_id: number;
  service_id: number;
  price: string | null;
  service_area: string | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

// TypeScript types for get selected service response
export interface GetSelectedServiceResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: SelectedServiceItem[];
  error?: string;
}

/**
 * Get selected services for a professional
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional/get_selected_service
 * Method: POST
 * @param data - Get selected service request data (professional_id)
 * @returns Promise with the API response
 */
export const getSelectedServices = async (
  data: GetSelectedServiceRequest
): Promise<GetSelectedServiceResponse> => {
  try {
    const requestBody: any = {
      professional_id: data.professional_id,
    };

    // Add api_token if provided
    if (data.api_token) {
      requestBody.api_token = data.api_token;
    }

    console.log('POST /professional/get_selected_service - Request payload:', {
      endpoint: '/professional/get_selected_service',
      professional_id: requestBody.professional_id,
    });

    const response = await apiClient.post<GetSelectedServiceResponse>(
      '/professional/get_selected_service',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional/get_selected_service - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching selected services:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch selected services',
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

// TypeScript types for profile completion percentage request
export interface GetProfileCompletionRequest {
  professional_id: number;
  api_token?: string;
}

// Profile completion details
export interface ProfileCompletionDetails {
  basic_info: number;
  contact_info: number;
  profile_image: number;
  selected_services: number;
  certificates: number;
}

// TypeScript types for profile completion percentage response
export interface GetProfileCompletionResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  profile_completion_percentage?: number;
  details?: ProfileCompletionDetails;
  error?: string;
}

/**
 * Get profile completion percentage for a professional
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional/profile_completion_percentage
 * Method: POST
 * @param data - Get profile completion request data (professional_id)
 * @returns Promise with the API response
 */
export const getProfileCompletionPercentage = async (
  data: GetProfileCompletionRequest
): Promise<GetProfileCompletionResponse> => {
  try {
    const requestBody: any = {
      professional_id: data.professional_id,
    };

    // Add api_token if provided
    if (data.api_token) {
      requestBody.api_token = data.api_token;
    }

    console.log('POST /professional/profile_completion_percentage - Request payload:', {
      endpoint: '/professional/profile_completion_percentage',
      professional_id: requestBody.professional_id,
    });

    const response = await apiClient.post<GetProfileCompletionResponse>(
      '/professional/profile_completion_percentage',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional/profile_completion_percentage - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile completion percentage:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch profile completion percentage',
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

// TypeScript types for get certificate request
export interface GetCertificateRequest {
  professional_id: number;
  api_token?: string;
}

// Certificate item from API
export interface CertificateItem {
  id: number;
  name: string;
  description: string;
  evidence: string;
  status: string; // "pending", "verified", "rejected"
  professional_id: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

// TypeScript types for get certificate response
export interface GetCertificateResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: CertificateItem[];
  error?: string;
}

/**
 * Get certificates for a professional
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional/get_certificate
 * Method: POST
 * @param data - Get certificate request data (professional_id)
 * @returns Promise with the API response
 */
export const getCertificates = async (
  data: GetCertificateRequest
): Promise<GetCertificateResponse> => {
  try {
    const requestBody: any = {
      professional_id: data.professional_id,
    };

    // Add api_token if provided
    if (data.api_token) {
      requestBody.api_token = data.api_token;
    }

    console.log('POST /professional/get_certificate - Request payload:', {
      endpoint: '/professional/get_certificate',
      professional_id: requestBody.professional_id,
    });

    const response = await apiClient.post<GetCertificateResponse>(
      '/professional/get_certificate',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional/get_certificate - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch certificates',
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