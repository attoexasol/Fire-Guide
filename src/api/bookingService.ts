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
