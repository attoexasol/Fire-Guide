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

