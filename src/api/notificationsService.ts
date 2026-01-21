import axios from 'axios';
import { handleTokenExpired, isTokenExpiredError } from '../lib/auth';

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

export interface MarkAllAsReadRequest {
  api_token: string;
}

export interface MarkAllAsReadResponse {
  status: boolean;
  message?: string;
  updated?: number;
  error?: string;
}

export interface MarkNotificationAsReadRequest {
  api_token: string;
  notification_id: number;
}

export interface MarkNotificationAsReadResponse {
  status: boolean;
  message?: string;
  data?: {
    id: number;
    is_read: boolean;
  };
  error?: string;
}

export interface DeleteAllNotificationsRequest {
  api_token: string;
}

export interface DeleteAllNotificationsResponse {
  status: boolean;
  message?: string;
  deleted?: number;
  error?: string;
}

export interface DeleteNotificationRequest {
  api_token: string;
  notification_id: number;
}

export interface DeleteNotificationResponse {
  status: boolean;
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

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isTokenExpiredError(error)) {
      handleTokenExpired();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

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

/**
 * Fetch unread notifications for the authenticated user
 * @param data - Request data containing api_token
 * @returns Promise with the API response containing array of unread notifications
 */
export const fetchUnreadNotifications = async (
  data: FetchNotificationsRequest
): Promise<FetchNotificationsResponse> => {
  try {
    const response = await apiClient.post<FetchNotificationsResponse>(
      '/notifications/unread',
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
          message: error.response.data?.message || 'Failed to fetch unread notifications',
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

/**
 * Fetch bookings notifications for the authenticated user
 * @param data - Request data containing api_token
 * @returns Promise with the API response containing array of bookings notifications
 */
export const fetchBookingsNotifications = async (
  data: FetchNotificationsRequest
): Promise<FetchNotificationsResponse> => {
  try {
    const response = await apiClient.post<FetchNotificationsResponse>(
      '/notifications/bookings',
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
          message: error.response.data?.message || 'Failed to fetch bookings notifications',
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

/**
 * Fetch payments notifications for the authenticated user
 * @param data - Request data containing api_token
 * @returns Promise with the API response containing array of payments notifications
 */
export const fetchPaymentsNotifications = async (
  data: FetchNotificationsRequest
): Promise<FetchNotificationsResponse> => {
  try {
    const response = await apiClient.post<FetchNotificationsResponse>(
      '/notifications/payments',
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
          message: error.response.data?.message || 'Failed to fetch payments notifications',
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

/**
 * Fetch reviews notifications for the authenticated user
 * @param data - Request data containing api_token
 * @returns Promise with the API response containing array of reviews notifications
 */
export const fetchReviewsNotifications = async (
  data: FetchNotificationsRequest
): Promise<FetchNotificationsResponse> => {
  try {
    const response = await apiClient.post<FetchNotificationsResponse>(
      '/notifications/reviews',
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
          message: error.response.data?.message || 'Failed to fetch reviews notifications',
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

/**
 * Fetch system notifications for the authenticated user
 * @param data - Request data containing api_token
 * @returns Promise with the API response containing array of system notifications
 */
export const fetchSystemNotifications = async (
  data: FetchNotificationsRequest
): Promise<FetchNotificationsResponse> => {
  try {
    const response = await apiClient.post<FetchNotificationsResponse>(
      '/notifications/system',
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
          message: error.response.data?.message || 'Failed to fetch system notifications',
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

/**
 * Mark all notifications as read for the authenticated user
 * @param data - Request data containing api_token
 * @returns Promise with the API response
 */
export const markAllNotificationsAsRead = async (
  data: MarkAllAsReadRequest
): Promise<MarkAllAsReadResponse> => {
  try {
    const response = await apiClient.post<MarkAllAsReadResponse>(
      '/notifications/mark_asaa_read_all',
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
          message: error.response.data?.message || 'Failed to mark all notifications as read',
          error: error.response.data?.error || error.message,
          updated: 0,
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          status: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
          updated: 0,
        };
      }
    }
    // Handle other errors
    throw {
      status: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
      updated: 0,
    };
  }
};

/**
 * Mark a single notification as read for the authenticated user
 * @param data - Request data containing api_token and notification_id
 * @returns Promise with the API response
 */
export const markNotificationAsRead = async (
  data: MarkNotificationAsReadRequest
): Promise<MarkNotificationAsReadResponse> => {
  try {
    const response = await apiClient.post<MarkNotificationAsReadResponse>(
      '/notifications/mark_asaa_read',
      {
        api_token: data.api_token,
        notification_id: data.notification_id,
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
          message: error.response.data?.message || 'Failed to mark notification as read',
          error: error.response.data?.error || error.message,
          data: undefined,
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          status: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
          data: undefined,
        };
      }
    }
    // Handle other errors
    throw {
      status: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
      data: undefined,
    };
  }
};

/**
 * Delete all notifications for the authenticated user
 * @param data - Request data containing api_token
 * @returns Promise with the API response
 */
export const deleteAllNotifications = async (
  data: DeleteAllNotificationsRequest
): Promise<DeleteAllNotificationsResponse> => {
  try {
    const response = await apiClient.post<DeleteAllNotificationsResponse>(
      '/notifications/all_delete',
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
          message: error.response.data?.message || 'Failed to delete all notifications',
          error: error.response.data?.error || error.message,
          deleted: 0,
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          status: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
          deleted: 0,
        };
      }
    }
    // Handle other errors
    throw {
      status: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
      deleted: 0,
    };
  }
};

/**
 * Delete a single notification for the authenticated user
 * @param data - Request data containing api_token and notification_id
 * @returns Promise with the API response
 */
export const deleteNotification = async (
  data: DeleteNotificationRequest
): Promise<DeleteNotificationResponse> => {
  try {
    const response = await apiClient.post<DeleteNotificationResponse>(
      '/notifications/single_delete',
      {
        api_token: data.api_token,
        notification_id: data.notification_id,
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
          message: error.response.data?.message || 'Failed to delete notification',
          error: error.response.data?.error || error.message,
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          status: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
        };
      }
    }
    // Handle other errors
    throw {
      status: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
