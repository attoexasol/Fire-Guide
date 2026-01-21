/// <reference types="vite/client" />
import axios from 'axios';
import { getApiToken, handleTokenExpired, isTokenExpiredError } from '../lib/auth';

// TypeScript types for Professional Booking Store request
export interface ProfessionalBookingStoreRequest {
  api_token: string;
  selected_date: string;
  selected_time: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_address: string;
  longitude: number;
  latitude: number;
  city: string;
  post_code: string;
  additional_notes?: string;
  professional_id: number;
}

export interface ProfessionalBookingStoreResponse {
  status: string;
  message: string;
  data?: any;
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://fireguide.attoexasolutions.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for booking submission
});

// Add response interceptor to handle token expiration
// Exclude login/register endpoints - 401 on these means wrong credentials, not token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error?.config?.url || '';
    const isAuthEndpoint = requestUrl.includes('/login') || 
                          requestUrl.includes('/register') || 
                          requestUrl.includes('/send_otp') ||
                          requestUrl.includes('/verify_otp') ||
                          requestUrl.includes('/reset_password');
    
    if (!isAuthEndpoint && isTokenExpiredError(error)) {
      handleTokenExpired();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

/**
 * Store professional booking
 * @param data - Professional booking data
 * @returns Promise with the API response
 */
export const storeProfessionalBooking = async (
  data: ProfessionalBookingStoreRequest
): Promise<ProfessionalBookingStoreResponse> => {
  try {
    const response = await apiClient.post<ProfessionalBookingStoreResponse>(
      '/professional_booking/store',
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error storing professional booking:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to submit booking',
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


// TypeScript types for Upcoming Bookings API
export interface UpcomingBookingItem {
  id?: number | string;
  selected_date: string;
  selected_time: string;
  additional_notes?: string;
  status: string;
  service_name: string | null;
  first_name?: string;
  last_name?: string;
  client_name?: string;
  email?: string;
  phone?: string;
}

export interface GetUpcomingBookingsRequest {
  api_token: string;
}

export interface GetUpcomingBookingsResponse {
  status: boolean;
  message: string;
  error?: string;
  data?: UpcomingBookingItem[];
}

/**
 * Get upcoming bookings for the authenticated user
 * BaseURL: https://fireguide.attoexasolutions.com/api/upcomming_bookings
 * Method: POST
 * @param api_token - The API token for authentication
 * @returns Promise with the API response containing array of upcoming bookings
 */
export const getUpcomingBookings = async (
  api_token: string
): Promise<GetUpcomingBookingsResponse> => {
  try {
    const response = await apiClient.post<GetUpcomingBookingsResponse>(
      '/upcomming_bookings',
      { api_token }
    );
    
    console.log('POST /upcomming_bookings - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming bookings:', error);
    if (axios.isAxiosError(error)) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        throw {
          success: false,
          status: 'error',
          message: error.response.data?.message || 'Failed to fetch upcoming bookings',
          error: error.response.data?.error || error.message,
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          success: false,
          status: 'error',
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
        };
      }
    }
    // Handle other errors
    throw {
      success: false,
      status: 'error',
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// TypeScript types for Professional Booking Item
export interface ProfessionalBookingItem {
  id: number;
  selected_date: string;
  selected_time: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  price: string;
  property_address: string;
  longitude: string;
  latitude: string;
  city: string;
  post_code: string;
  ref_code: string | null;
  additional_notes: string;
  status: string;
  user_id: number | null;
  created_at: string;
  updated_at: string;
  selected_service: {
    id: number;
    name: string;
    price: string;
  } | null;
  creator: {
    id: number;
    full_name: string;
  };
  updater: {
    id: number;
    full_name: string;
  };
}

export interface GetProfessionalBookingsResponse {
  status: string;
  message: string;
  data: ProfessionalBookingItem[];
}

/**
 * Get all professional bookings
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_booking/professional_wise_get
 * Method: POST
 * @returns Promise with the API response containing array of professional bookings
 */
export const getProfessionalBookings = async (): Promise<ProfessionalBookingItem[]> => {
  try {
    const api_token = getApiToken();
    
    if (!api_token) {
      console.warn('No API token available for fetching professional bookings');
      return [];
    }
    
    console.log('POST /professional_booking/professional_wise_get - Requesting...');
    
    const response = await apiClient.post<GetProfessionalBookingsResponse>(
      '/professional_booking/professional_wise_get',
      { api_token }
    );
    
    console.log('POST /professional_booking/professional_wise_get - Response:', response.data);
    
    // Handle the response structure: { status: 'success', data: [...] }
    if (response.data.status === 'success' && Array.isArray(response.data.data)) {
      console.log('Professional bookings found:', response.data.data.length);
      return response.data.data;
    }
    
    // Fallback: return empty array if structure is unexpected
    console.warn('Unexpected professional bookings API response structure:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching professional bookings:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch professional bookings',
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

// TypeScript types for Accept Professional Booking request
export interface AcceptProfessionalBookingRequest {
  api_token: string;
  id: number;
}

export interface AcceptProfessionalBookingResponse {
  status: string;
  message: string;
  data?: any;
}

/**
 * Accept a professional booking
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_booking/accept
 * Method: POST
 * @param data - Accept booking request data (api_token and booking id)
 * @returns Promise with the API response
 */
export const acceptProfessionalBooking = async (
  data: AcceptProfessionalBookingRequest
): Promise<AcceptProfessionalBookingResponse> => {
  try {
    const response = await apiClient.post<AcceptProfessionalBookingResponse>(
      '/professional_booking/accept',
      data
    );
    
    console.log('POST /professional_booking/accept - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error accepting professional booking:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to accept booking',
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

// TypeScript types for Update Professional Booking request
export interface UpdateProfessionalBookingRequest {
  api_token: string;
  id: number;
  selected_date: string;
  selected_time: string;
  price: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_address: string;
  longitude: number;
  latitude: number;
  city: string;
  post_code: string;
  additional_notes?: string;
  reason?: string;
  professional_id: number;
}

export interface UpdateProfessionalBookingResponse {
  status: string;
  message: string;
  data?: any;
}

/**
 * Update a professional booking (Reschedule)
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_booking/update
 * Method: POST
 * @param data - Update booking request data
 * @returns Promise with the API response
 */
export const updateProfessionalBooking = async (
  data: UpdateProfessionalBookingRequest
): Promise<UpdateProfessionalBookingResponse> => {
  try {
    const response = await apiClient.post<UpdateProfessionalBookingResponse>(
      '/professional_booking/update',
      data
    );
    
    console.log('POST /professional_booking/update - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating professional booking:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to update booking',
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

// TypeScript types for Search Professional Bookings request
export interface SearchProfessionalBookingsRequest {
  api_token?: string;
  search?: string;
  status?: string;
}

export interface SearchProfessionalBookingsResponse {
  status: string;
  message: string;
  data: ProfessionalBookingItem[];
}

/**
 * Search professional bookings
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_booking/search
 * Method: POST
 * @param data - Search request data (search term and/or status filter)
 * @returns Promise with the API response containing array of matching bookings
 */
export const searchProfessionalBookings = async (
  data: SearchProfessionalBookingsRequest
): Promise<ProfessionalBookingItem[]> => {
  try {
    const api_token = getApiToken();
    
    if (!api_token) {
      console.warn('No API token available for searching bookings');
      return [];
    }
    
    const requestData = {
      api_token,
      ...data
    };
    
    const response = await apiClient.post<SearchProfessionalBookingsResponse>(
      '/professional_booking/search',
      requestData
    );
    
    console.log('POST /professional_booking/search - Request:', requestData);
    console.log('POST /professional_booking/search - Response:', response.data);
    
    // Handle the response structure: { status: 'success', data: [...] }
    if (response.data.status === 'success' && Array.isArray(response.data.data)) {
      console.log('Search results found:', response.data.data.length);
      return response.data.data;
    }
    
    // Fallback: return empty array if structure is unexpected
    console.warn('Unexpected search API response structure:', response.data);
    return [];
  } catch (error) {
    console.error('Error searching professional bookings:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to search bookings',
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

// TypeScript types for Booking Summary request
export interface BookingSummaryRequest {
  api_token: string;
}

export interface BookingSummaryResponse {
  status: boolean;
  message: string;
  data: {
    upcoming: number;
    pending: number;
    completed: number;
  };
}

/**
 * Get booking summary (stats)
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_booking/summary
 * Method: POST
 * @param api_token - The API token for authentication
 * @returns Promise with the API response containing booking summary
 */
export const getBookingSummary = async (
  api_token: string
): Promise<BookingSummaryResponse> => {
  try {
    console.log('POST /professional_booking/summary - Requesting with token:', api_token.substring(0, 20) + '...');
    
    const response = await apiClient.post<BookingSummaryResponse>(
      '/professional_booking/summary',
      { api_token }
    );
    
    console.log('POST /professional_booking/summary - Response:', response.data);
    console.log('POST /professional_booking/summary - Status:', response.status);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching booking summary:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch booking summary',
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
