import axios from 'axios';

// Types for notifications API
export interface NotificationApiItem {
  id: number;
  user_id: number;
  title: string;
  content: string;
  priority: "low" | "medium" | "high";
  category: "system" | "reviews" | "payments" | "bookings";
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface FetchNotificationsRequest {
  api_token: string;
}

export interface FetchNotificationsResponse {
  status: boolean;
  data: NotificationApiItem[];
  message?: string;
  error?: string;
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
 * Fetch all notifications for the authenticated user
 * @param data - Request data containing api_token
 * @returns Promise with the API response containing array of notifications
 */
export const fetchNotifications = async (
  data: FetchNotificationsRequest
): Promise<FetchNotificationsResponse> => {
  try {
    const response = await apiClient.post<FetchNotificationsResponse>(
      '/notifications',
      {
        api_token: data.api_token,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        throw {
          status: false,
          message: error.response.data?.message || 'Failed to fetch notifications',
          error: error.response.data?.error || error.message,
          data: [],
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          status: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
          data: [],
        };
      }
    }
    // Handle other errors
    throw {
      status: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    };
  }
};
