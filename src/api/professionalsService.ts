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
  service_id?: number; // Optional - API may return service.id nested instead
  price: string | null;
  service_area: string | null;
  created_by: number | { id: number; full_name: string } | null;
  updated_by: number | { id: number; full_name: string } | null;
  created_at: string;
  updated_at: string;
  service?: {
    id: number;
    service_name: string;
    description: string | null;
  } | null;
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

// TypeScript types for store service price request
export interface StoreServicePriceRequest {
  api_token: string;
  services: Array<{
    service_id: number;
    price: number; // Price as number (e.g., 220, 800, 1200)
  }>;
}

// TypeScript types for store service price response
export interface StoreServicePriceResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: SelectedServiceItem[];
  error?: string;
}

/**
 * Store service prices for a professional
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional/service_price_store
 * Method: POST
 * @param data - Store service price request data (api_token, services array)
 * @returns Promise with the API response
 */
export const storeServicePrices = async (
  data: StoreServicePriceRequest
): Promise<StoreServicePriceResponse> => {
  try {
    const requestBody: any = {
      api_token: data.api_token,
      services: data.services.map(service => ({
        service_id: service.service_id,
        price: service.price // Send as number
      }))
    };

    console.log('POST /professional/service_price_store - Request payload:', {
      endpoint: '/professional/service_price_store',
      services_count: requestBody.services.length,
      services: requestBody.services
    });

    const response = await apiClient.post<StoreServicePriceResponse>(
      '/professional/service_price_store',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional/service_price_store - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error storing service prices:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to store service prices',
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

// TypeScript types for working days API
export interface WorkingDayResponse {
  id: number;
  week_day: string;
  start_time: string;
  end_time: string;
  is_closed: number;
  professional_id: number;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  professional: {
    id: number;
    name: string;
  };
}

export interface GetWorkingDaysRequest {
  api_token: string;
}

export interface GetWorkingDaysResponse {
  status: boolean;
  message: string;
  data: WorkingDayResponse[];
  error?: string;
}

/**
 * Get working days for a professional
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_working_days/list
 * Method: POST
 * @param data - Get working days request data (api_token)
 * @returns Promise with the API response
 */
export const getWorkingDays = async (
  data: GetWorkingDaysRequest
): Promise<GetWorkingDaysResponse> => {
  try {
    const requestBody: any = {
      api_token: data.api_token,
    };

    console.log('POST /professional_working_days/list - Request payload:', {
      endpoint: '/professional_working_days/list',
      has_api_token: !!requestBody.api_token,
    });

    const response = await apiClient.post<GetWorkingDaysResponse>(
      '/professional_working_days/list',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional_working_days/list - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching working days:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch working days',
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
// TypeScript types for Professional Days API
export interface CreateProfessionalDayRequest {
  api_token: string;
  type: "block";
  date: string;
  start_time: string;
  end_time: string;
  reason: string;
}

export interface ProfessionalDayResponse {
  id: number;
  professional_id: number;
  type: string;
  date: string;
  start_time: string;
  end_time: string;
  reason: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProfessionalDayResponse {
  status: boolean;
  message: string;
  data?: ProfessionalDayResponse;
  error?: string;
}

/**
 * Create a professional day (block)
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_days/create
 * Method: POST
 * @param data - Create professional day request data
 * @returns Promise with the API response
 */
export const createProfessionalDay = async (
  data: CreateProfessionalDayRequest
): Promise<CreateProfessionalDayResponse> => {
  try {
    const requestBody: any = {
      api_token: data.api_token,
      type: data.type,
      date: data.date,
      start_time: data.start_time,
      end_time: data.end_time,
      reason: data.reason,
    };

    console.log('POST /professional_days/create - Request payload:', {
      endpoint: '/professional_days/create',
      has_api_token: !!requestBody.api_token,
      type: requestBody.type,
      date: requestBody.date,
      start_time: requestBody.start_time,
      end_time: requestBody.end_time,
      reason: requestBody.reason,
    });

    const response = await apiClient.post<CreateProfessionalDayResponse>(
      '/professional_days/create',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional_days/create - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating professional day:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create professional day',
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

// TypeScript types for Get Blocked Days API
export interface GetBlockedDaysRequest {
  api_token: string;
}

export interface GetBlockedDaysResponse {
  status: boolean;
  message: string;
  data?: ProfessionalDayResponse[];
  error?: string;
}

/**
 * Get blocked days for a professional
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_days/block
 * Method: POST
 * @param data - Get blocked days request data (api_token)
 * @returns Promise with the API response
 */
export const getBlockedDays = async (
  data: GetBlockedDaysRequest
): Promise<GetBlockedDaysResponse> => {
  try {
    const requestBody: any = {
      api_token: data.api_token,
    };

    console.log('POST /professional_days/block - Request payload:', {
      endpoint: '/professional_days/block',
      has_api_token: !!requestBody.api_token,
    });

    const response = await apiClient.post<GetBlockedDaysResponse>(
      '/professional_days/block',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional_days/block - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching blocked days:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch blocked days',
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

// TypeScript types for Delete Professional Day API
export interface DeleteProfessionalDayRequest {
  api_token: string;
  id: number;
}

export interface DeleteProfessionalDayResponse {
  status: boolean;
  message: string;
  error?: string;
}

/**
 * Delete a professional day (block)
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_days/delete
 * Method: POST
 * @param data - Delete professional day request data (api_token, id)
 * @returns Promise with the API response
 */
export const deleteProfessionalDay = async (
  data: DeleteProfessionalDayRequest
): Promise<DeleteProfessionalDayResponse> => {
  try {
    const requestBody: any = {
      api_token: data.api_token,
      id: data.id,
    };

    console.log('POST /professional_days/delete - Request payload:', {
      endpoint: '/professional_days/delete',
      has_api_token: !!requestBody.api_token,
      id: requestBody.id,
    });

    const response = await apiClient.post<DeleteProfessionalDayResponse>(
      '/professional_days/delete',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional_days/delete - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting professional day:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to delete professional day',
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

// TypeScript types for Monthly Availability API
export interface GetMonthlyAvailabilityRequest {
  api_token: string;
}

export interface MonthlyAvailabilityData {
  month: string;
  past: string[];
  booked: string[];
  blocked: string[];
  available: string[];
}

export interface GetMonthlyAvailabilityResponse {
  status?: boolean;
  message: string;
  data?: MonthlyAvailabilityData;
  error?: string;
}

/**
 * Get monthly availability for a professional
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional/monthly_availability
 * Method: POST
 * @param data - Get monthly availability request data (api_token)
 * @returns Promise with the API response
 */
export const getMonthlyAvailability = async (
  data: GetMonthlyAvailabilityRequest
): Promise<GetMonthlyAvailabilityResponse> => {
  try {
    const requestBody: any = {
      api_token: data.api_token,
    };

    console.log('POST /professional/monthly_availability - Request payload:', {
      endpoint: '/professional/monthly_availability',
      has_api_token: !!requestBody.api_token,
    });

    const response = await apiClient.post<GetMonthlyAvailabilityResponse>(
      '/professional/monthly_availability',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional/monthly_availability - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly availability:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch monthly availability',
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

// TypeScript types for Monthly Availability Summary API
export interface GetMonthlyAvailabilitySummaryRequest {
  api_token: string;
}

export interface MonthlyAvailabilitySummaryData {
  month: string;
  book_count: number;
  block_count: number;
  available_count: number;
}

export interface GetMonthlyAvailabilitySummaryResponse {
  status: boolean;
  message: string;
  data?: MonthlyAvailabilitySummaryData;
  error?: string;
}

/**
 * Get monthly availability summary for a professional
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional/monthly_availability/summary
 * Method: POST
 * @param data - Get monthly availability summary request data (api_token)
 * @returns Promise with the API response
 */
export const getMonthlyAvailabilitySummary = async (
  data: GetMonthlyAvailabilitySummaryRequest
): Promise<GetMonthlyAvailabilitySummaryResponse> => {
  try {
    const requestBody: any = {
      api_token: data.api_token,
    };

    console.log('POST /professional/monthly_availability/summary - Request payload:', {
      endpoint: '/professional/monthly_availability/summary',
      has_api_token: !!requestBody.api_token,
    });

    const response = await apiClient.post<GetMonthlyAvailabilitySummaryResponse>(
      '/professional/monthly_availability/summary',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional/monthly_availability/summary - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly availability summary:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch monthly availability summary',
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
