import axios from 'axios';

// TypeScript types for registration request
export interface RegisterUserRequest {
  full_name: string;
  email: string;
  phone: string;
  password: string;
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

/**
 * Register a new user
 * @param data - User registration data
 * @returns Promise with the API response
 */
export const registerUser = async (
  data: RegisterUserRequest
): Promise<RegisterUserResponse> => {
  try {
    // Send POST request with exact body fields: full_name, email, password, phone
    // No custom headers - axios will automatically add Content-Type: application/json
    const response = await apiClient.post<RegisterUserResponse>(
      '/user/register',
      {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
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

