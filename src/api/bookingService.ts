/// <reference types="vite/client" />
import axios from 'axios';

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
  service_name: string;
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
  data?: UpcomingBookingItem[];
  error?: string;
}

/**
 * Get upcoming bookings for a professional
 * BaseURL: https://fireguide.attoexasolutions.com/api/upcomming_bookings
 * Method: POST
 * @param data - Get upcoming bookings request data (api_token)
 * @returns Promise with the API response
 */
export const getUpcomingBookings = async (
  data: GetUpcomingBookingsRequest
): Promise<GetUpcomingBookingsResponse> => {
  try {
    const requestBody: any = {
      api_token: data.api_token,
    };

    console.log('POST /upcomming_bookings - Request payload:', {
      endpoint: '/upcomming_bookings',
      has_api_token: !!requestBody.api_token,
    });

    const response = await apiClient.post<GetUpcomingBookingsResponse>(
      '/upcomming_bookings',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /upcomming_bookings - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming bookings:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch upcoming bookings',
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

// TypeScript types for Professional Booking API Response
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
  } | null;
  professional: {
    id: number;
    name: string;
  };
}

export interface GetProfessionalBookingsResponse {
  status: string;
  message: string;
  data: ProfessionalBookingItem[];
}

/**
 * Get all professional bookings
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_booking
 * Method: GET
 * @returns Promise with the API response containing array of professional bookings
 */
export const getProfessionalBookings = async (): Promise<ProfessionalBookingItem[]> => {
  try {
    const response = await apiClient.get<GetProfessionalBookingsResponse>(
      '/professional_booking'
    );
    
    console.log('GET /professional_booking - Response:', response.data);
    
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
