import axios from 'axios';
import { handleTokenExpired, isTokenExpiredError } from '../lib/auth';

// TypeScript types for registration request
export interface RegisterUserRequest {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}

// TypeScript types for registration response
export interface RegisterUserResponse {
  success?: boolean;
  status?: boolean | string;
  message?: string;
  data?: {
    id?: string;
    name?: string;
    user_name?: string;
    email?: string;
    token?: string;
    api_token?: string;
    [key: string]: any;
  };
  error?: string;
  token?: string;
  api_token?: string;
}

// Create axios instance with base configuration
// Note: No custom headers - only default Content-Type from axios
const apiClient = axios.create({
  baseURL: 'https://fireguide.attoexasolutions.com/api',
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
 * Register a new user
 * @param data - User registration data
 * @returns Promise with the API response
 */
export const registerUser = async (
  data: RegisterUserRequest
): Promise<RegisterUserResponse> => {
  try {
    // Send POST request with exact body fields: full_name, email, password, phone, role
    // No custom headers - axios will automatically add Content-Type: application/json
    const requestBody: any = {
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      phone: data.phone
    };
    
    // Only include role if it's provided
    if (data.role) {
      requestBody.role = data.role;
    }
    
    const response = await apiClient.post<RegisterUserResponse>(
      '/user/register',
      requestBody
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        throw {
          success: false,
          message: error.response.data?.message || 'Registration failed',
          error: error.response.data?.error || error.message,
          status: error.response.status,
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          success: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
        };
      }
    }
    // Handle other errors
    throw {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// TypeScript types for login request
export interface LoginUserRequest {
  email: string;
  password: string;
}

// TypeScript types for login response
export interface LoginUserResponse {
  success?: boolean;
  status?: boolean | string;
  message?: string;
  data?: {
    id?: string;
    name?: string;
    user_name?: string;
    email?: string;
    token?: string;
    api_token?: string;
    [key: string]: any;
  };
  error?: string;
  token?: string;
  api_token?: string;
}

/**
 * Login a user
 * @param data - User login data (email and password)
 * @returns Promise with the API response
 */
export const loginUser = async (
  data: LoginUserRequest
): Promise<LoginUserResponse> => {
  try {
    // Send POST request with exact body fields: email, password
    // No custom headers - axios will automatically add Content-Type: application/json
    const response = await apiClient.post<LoginUserResponse>(
      '/user/login',
      {
        email: data.email,
        password: data.password
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        throw {
          success: false,
          status: false,
          message: error.response.data?.message || 'Login failed',
          error: error.response.data?.error || error.message,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          success: false,
          status: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
        };
      }
    }
    // Handle other errors
    throw {
      success: false,
      status: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// TypeScript types for send OTP request
export interface SendOtpRequest {
  email: string;
}

// TypeScript types for send OTP response
export interface SendOtpResponse {
  success?: boolean;
  status?: boolean | string;
  message?: string;
  data?: {
    [key: string]: any;
  };
  error?: string;
}

/**
 * Send OTP to user's email
 * @param data - Email address to send OTP to
 * @returns Promise with the API response
 */
export const sendOtp = async (
  data: SendOtpRequest
): Promise<SendOtpResponse> => {
  try {
    // Send POST request with email in body
    // No custom headers - axios will automatically add Content-Type: application/json
    const response = await apiClient.post<SendOtpResponse>(
      '/user/send-otp',
      {
        email: data.email
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to send OTP',
          error: error.response.data?.error || error.message,
          status: error.response.status,
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          success: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
        };
      }
    }
    // Handle other errors
    throw {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// TypeScript types for verify OTP request
export interface VerifyOtpRequest {
  email: string;
  otp: string | number;
}

// TypeScript types for verify OTP response
export interface VerifyOtpResponse {
  success?: boolean;
  status?: boolean | string;
  message?: string;
  data?: {
    [key: string]: any;
  };
  error?: string;
}

/**
 * Verify OTP sent to user's email
 * @param data - Email and OTP to verify
 * @returns Promise with the API response
 */
export const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
  try {
    // Send POST request with email and otp in body
    // No custom headers - axios will automatically add Content-Type: application/json
    const response = await apiClient.post<VerifyOtpResponse>(
      '/user/verify-otp',
      {
        email: data.email,
        otp: typeof data.otp === 'string' ? parseInt(data.otp, 10) : data.otp
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to verify OTP',
          error: error.response.data?.error || error.message,
          status: error.response.status,
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          success: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
        };
      }
    }
    // Handle other errors
    throw {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// TypeScript types for reset password request
export interface ResetPasswordRequest {
  email: string;
  password: string;
  password_confirmation: string;
}

// TypeScript types for reset password response
export interface ResetPasswordResponse {
  success?: boolean;
  status?: boolean | string;
  message?: string;
  data?: {
    [key: string]: any;
  };
  error?: string;
}

/**
 * Reset user password after OTP verification
 * @param data - Email, new password, and password confirmation
 * @returns Promise with the API response
 */
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  try {
    // Send POST request with email, password, and password_confirmation in body
    // No custom headers - axios will automatically add Content-Type: application/json
    const response = await apiClient.post<ResetPasswordResponse>(
      '/user/reset-password',
      {
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to reset password',
          error: error.response.data?.error || error.message,
          status: error.response.status,
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          success: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
        };
      }
    }
    // Handle other errors
    throw {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// TypeScript types for update user request
export interface UpdateUserRequest {
  api_token: string;
  full_name: string;
  phone: string;
}

// TypeScript types for update user response
export interface UpdateUserResponse {
  success?: boolean;
  status?: boolean | string;
  message?: string;
  data?: {
    id?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  error?: string;
}

/**
 * Update user information
 * @param data - API token, full name, and phone number
 * @returns Promise with the API response
 */
export const updateUser = async (
  data: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  try {
    // Send POST request with api_token, full_name, and phone in body
    // No custom headers - axios will automatically add Content-Type: application/json
    const response = await apiClient.post<UpdateUserResponse>(
      '/user/update',
      {
        api_token: data.api_token,
        full_name: data.full_name,
        phone: data.phone
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to update user',
          error: error.response.data?.error || error.message,
          status: error.response.status,
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          success: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
        };
      }
    }
    // Handle other errors
    throw {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// TypeScript types for change password request
export interface ChangePasswordRequest {
  api_token: string;
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// TypeScript types for change password response
export interface ChangePasswordResponse {
  status: boolean;
  message: string;
  error?: string;
}

/**
 * Change user password
 * BaseURL: https://fireguide.attoexasolutions.com/api/user/change_password
 * Method: POST
 * @param data - API token, current password, new password, and confirmation
 * @returns Promise with the API response
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  try {
    const response = await apiClient.post<ChangePasswordResponse>(
      '/user/change_password',
      {
        api_token: data.api_token,
        current_password: data.current_password,
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
      }
    );
    console.log('POST /user/change_password - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to change password',
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

// TypeScript types for upload profile image request
export interface UploadProfileImageRequest {
  api_token: string;
  file: File;
}

// TypeScript types for upload profile image response
export interface UploadProfileImageResponse {
  status?: boolean;
  message?: string;
  image_url?: string;
  error?: string;
}

/**
 * Upload profile image
 * @param data - API token and image file
 * @returns Promise with the API response
 */
export const uploadProfileImage = async (
  data: UploadProfileImageRequest
): Promise<UploadProfileImageResponse> => {
  try {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('api_token', data.api_token);

    // Send POST request with FormData
    // axios will automatically set Content-Type to multipart/form-data
    const response = await apiClient.post<UploadProfileImageResponse>(
      '/user/upload_profile_image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
          message: error.response.data?.message || 'Failed to upload profile image',
          error: error.response.data?.error || error.message,
          statusCode: error.response.status,
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

// TypeScript types for Customer Dashboard Overview Summary
export interface CustomerDashboardSummaryData {
  month: string;
  jobs: {
    upcoming: number;
    completed: number;
  };
  spending: {
    total_spent: string;
  };
}

export interface CustomerDashboardSummaryResponse {
  status: string;
  data?: CustomerDashboardSummaryData;
  message?: string;
  error?: string;
}

/**
 * Get customer dashboard overview summary
 * BaseURL: https://fireguide.attoexasolutions.com/api/user_dashboard/overview_summary
 * Method: POST
 * @param apiToken - The API token for authentication
 * @returns Promise with the dashboard summary data
 */
export const getCustomerDashboardSummary = async (
  apiToken: string
): Promise<CustomerDashboardSummaryResponse> => {
  try {
    console.log('POST /user_dashboard/overview_summary - Fetching customer dashboard summary...');
    
    const response = await apiClient.post<CustomerDashboardSummaryResponse>(
      '/user_dashboard/overview_summary',
      {
        api_token: apiToken
      }
    );
    
    console.log('POST /user_dashboard/overview_summary - Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching customer dashboard summary:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          status: 'error',
          message: error.response.data?.message || 'Failed to fetch dashboard summary',
          error: error.response.data?.error || error.message,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        throw {
          status: 'error',
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
        };
      }
    }
    throw {
      status: 'error',
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
