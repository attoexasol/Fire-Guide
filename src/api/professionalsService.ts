/// <reference types="vite/client" />
import axios from 'axios';
import { handleTokenExpired, isTokenExpiredError } from '../lib/auth';

/**
 * API ENDPOINT PATTERNS - IMPORTANT REFERENCE
 * ===========================================
 * 
 * This file contains all professional-related API endpoints. To prevent 404 errors,
 * ensure all endpoints match the exact patterns documented below:
 * 
 * VERIFIED WORKING ENDPOINTS:
 * ---------------------------
 * 1. Professional Identity: '/professional_wise_identity'
 * 2. Professional DBS: '/professional_wise_bds' (note: "bds" not "dbs")
 * 3. Professional Evidence: '/qualifications-certification/professional_wise_evidence'
 * 4. Verification Summary: '/professional/verification_summary'
 * 5. Selected Services: '/professional/get_selected_service'
 * 6. Profile Completion: '/professional/profile_completion_percentage'
 * 7. Certificates: '/professional/get_certificate'
 * 8. Store Service Prices: '/professional/service_price_store' (note: singular "price" and no "/store" suffix)
 * 9. Working Days: '/professional_working_days/list' (note: underscore format with "/list" suffix)
 * 10. Blocked Days: '/professional_days/block' (note: underscore format with "/block" suffix)
 * 11. Monthly Availability Summary: '/professional/monthly_availability/summary' (note: nested path format)
 * 12. Create Professional Day: '/professional_days/create' (note: underscore format with "/create" suffix)
 * 13. Delete Professional Day: '/professional_days/delete' (note: underscore format with "/delete" suffix)
 * 
 * ENDPOINT NAMING CONVENTIONS:
 * -----------------------------
 * - "professional_wise_*" endpoints: Use underscore format (e.g., professional_wise_identity)
 * - "professional/*" endpoints: Use slash format (e.g., professional/get_selected_service)
 * - "qualifications-certification/*": Use hyphen in path segment
 * 
 * IMPORTANT NOTES:
 * ---------------
 * - DO NOT add "/show" suffix to these endpoints
 * - DO NOT change "bds" to "dbs" in professional_wise_bds
 * - Always verify endpoint paths match API documentation before making changes
 * - Test endpoints after any modifications to prevent 404 errors
 */

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://fireguide.attoexasolutions.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
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

// TypeScript types for Professional User Account Settings
export interface ProfessionalUserAccountData {
  full_name: string;
  email: string;
  phone: string;
  business_location: string;
}

export interface GetProfessionalUserRequest {
  api_token: string;
}

export interface GetProfessionalUserResponse {
  status: boolean;
  message: string;
  data: ProfessionalUserAccountData;
}

export interface UpdateProfessionalUserRequest {
  api_token: string;
  full_name: string;
  email: string;
  phone: string;
  business_location: string;
}

export interface UpdateProfessionalUserResponse {
  status: boolean;
  message: string;
  data: ProfessionalUserAccountData;
}

/**
 * Get professional user account data
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_user/get
 * Method: POST
 * @param data - API token
 * @returns Promise with the API response containing professional user account data
 */
export const getProfessionalUser = async (
  data: GetProfessionalUserRequest
): Promise<ProfessionalUserAccountData> => {
  try {
    const response = await apiClient.post<GetProfessionalUserResponse>(
      '/professional_user/get',
      {
        api_token: data.api_token
      }
    );
    
    console.log('POST /professional_user/get - Response:', response.data);
    
    // Handle the response structure: { status: true, data: {...} }
    if (response.data.status === true && response.data.data) {
      console.log('Professional user account data fetched successfully');
      return response.data.data;
    }
    
    throw {
      success: false,
      message: response.data.message || 'Failed to fetch professional user account data',
      error: 'Invalid response structure',
    };
  } catch (error) {
    console.error('Error fetching professional user account data:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch professional user account data',
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

/**
 * Update professional user account settings
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_user/update
 * Method: POST
 * @param data - Account settings data
 * @returns Promise with the API response containing updated account data
 */
export const updateProfessionalUser = async (
  data: UpdateProfessionalUserRequest
): Promise<ProfessionalUserAccountData> => {
  try {
    const response = await apiClient.post<UpdateProfessionalUserResponse>(
      '/professional_user/update',
      {
        api_token: data.api_token,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        business_location: data.business_location,
      }
    );
    
    console.log('POST /professional_user/update - Response:', response.data);
    
    // Handle the response structure: { status: true, data: {...} }
    if (response.data.status === true && response.data.data) {
      console.log('Professional user account updated successfully');
      return response.data.data;
    }
    
    throw {
      success: false,
      message: response.data.message || 'Failed to update professional user account',
      error: 'Invalid response structure',
    };
  } catch (error) {
    console.error('Error updating professional user account:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to update professional user account',
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
    };1
  }
};

// TypeScript types for Professional Identity
export interface ProfessionalIdentityItem {
  id: number;
  professional_id: number;
  file: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GetProfessionalWiseIdentityRequest {
  api_token: string;
}

export interface GetProfessionalWiseIdentityResponse {
  status: boolean;
  message: string;
  data: ProfessionalIdentityItem[];
}

export interface UpdateProfessionalIdentityRequest {
  api_token: string;
  id: number;
  professional_id: number;
  file: string | File;
}

export interface UpdateProfessionalIdentityResponse {
  status: boolean;
  message: string;
  data?: any;
  error?: string;
}

export const getProfessionalWiseIdentity = async (
  data: GetProfessionalWiseIdentityRequest
): Promise<GetProfessionalWiseIdentityResponse> => {
  try {
    const response = await apiClient.post<GetProfessionalWiseIdentityResponse>(
      '/professional_wise_identity',
      { api_token: data.api_token }
    );
    console.log('POST /professional_wise_identity - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching professional identity:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch professional identity',
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

export const updateProfessionalIdentity = async (
  data: UpdateProfessionalIdentityRequest
): Promise<UpdateProfessionalIdentityResponse> => {
  try {
    const isFileObject = data.file instanceof File;
    let response: any;

    if (isFileObject) {
      const formData = new FormData();
      formData.append('api_token', data.api_token);
      formData.append('id', data.id.toString());
      formData.append('professional_id', data.professional_id.toString());
      formData.append('file', data.file as File);

      response = await apiClient.post<UpdateProfessionalIdentityResponse>(
        '/professional_identity/update',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } else {
      const requestBody: any = {
        api_token: data.api_token,
        id: data.id,
        professional_id: data.professional_id,
        file: data.file as string,
      };

      response = await apiClient.post<UpdateProfessionalIdentityResponse>(
        '/professional_identity/update',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    console.log('POST /professional_identity/update - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating professional identity:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to update professional identity',
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

// TypeScript types for Professional DBS
export interface ProfessionalDBSItem {
  id: number;
  professional_id: number;
  file: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GetProfessionalWiseDBSRequest {
  api_token: string;
}

export interface GetProfessionalWiseDBSResponse {
  status: boolean;
  message: string;
  data: ProfessionalDBSItem[];
}

export interface UpdateProfessionalDBSRequest {
  api_token: string;
  id: number;
  professional_id: number;
  file: string | File;
}

export interface UpdateProfessionalDBSResponse {
  status: boolean;
  message: string;
  data?: any;
  error?: string;
}

export const getProfessionalWiseDBS = async (
  data: GetProfessionalWiseDBSRequest
): Promise<GetProfessionalWiseDBSResponse> => {
  try {
    const response = await apiClient.post<GetProfessionalWiseDBSResponse>(
      '/professional_wise_bds',
      { api_token: data.api_token }
    );
    console.log('POST /professional_wise_bds - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching professional DBS:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch professional DBS',
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

export const updateProfessionalDBS = async (
  data: UpdateProfessionalDBSRequest
): Promise<UpdateProfessionalDBSResponse> => {
  try {
    const isFileObject = data.file instanceof File;
    let response: any;

    if (isFileObject) {
      const formData = new FormData();
      formData.append('api_token', data.api_token);
      formData.append('id', data.id.toString());
      formData.append('professional_id', data.professional_id.toString());
      formData.append('file', data.file as File);

      response = await apiClient.post<UpdateProfessionalDBSResponse>(
        '/professional_dbs/update',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } else {
      const requestBody: any = {
        api_token: data.api_token,
        id: data.id,
        professional_id: data.professional_id,
        file: data.file as string,
      };

      response = await apiClient.post<UpdateProfessionalDBSResponse>(
        '/professional_dbs/update',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    console.log('POST /professional_dbs/update - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating professional DBS:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to update professional DBS',
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

// TypeScript types for Professional Evidence (Qualifications)
export interface ProfessionalEvidenceItem {
  id: number;
  professional_id: number;
  qualification_id: number;
  file: string;
  evidence?: string; // Alternative property name for file/evidence
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GetProfessionalWiseEvidenceRequest {
  api_token: string;
}

export interface GetProfessionalWiseEvidenceResponse {
  status: boolean;
  message: string;
  data: ProfessionalEvidenceItem[];
}

export const getProfessionalWiseEvidence = async (
  data: GetProfessionalWiseEvidenceRequest
): Promise<GetProfessionalWiseEvidenceResponse> => {
  try {
    const response = await apiClient.post<GetProfessionalWiseEvidenceResponse>(
      '/qualifications-certification/professional_wise_evidence',
      { api_token: data.api_token }
    );
    console.log('POST /qualifications-certification/professional_wise_evidence - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching professional evidence:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch professional evidence',
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

// TypeScript types for Verification Summary
export interface VerificationSummaryData {
  identity_verified: boolean;
  dbs_verified: boolean;
  qualifications_verified: boolean;
  insurance_verified: boolean;
  overall_status: string;
  completion_percentage: number;
  active_status?: string;
  progress_percentage?: number;
  title?: string;
  subtitle?: string;
  checks?: {
    identity?: boolean;
    dbs?: boolean;
    qualifications?: boolean;
    insurance?: boolean;
    [key: string]: boolean | undefined;
  };
}

export interface GetVerificationSummaryRequest {
  api_token: string;
}

export interface GetVerificationSummaryResponse {
  status: boolean;
  message: string;
  data: VerificationSummaryData;
}

export const getVerificationSummary = async (
  data: GetVerificationSummaryRequest
): Promise<GetVerificationSummaryResponse> => {
  try {
    const response = await apiClient.post<GetVerificationSummaryResponse>(
      '/professional/verification_summary',
      { api_token: data.api_token }
    );
    console.log('POST /professional/verification_summary - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching verification summary:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch verification summary',
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

// TypeScript types for Professional Response
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
  creator: { id: number; user_name?: string; full_name?: string } | null;
  updater: { id: number; user_name?: string; full_name?: string } | null;
}

export interface ProfessionalsPaginatedResponse {
  current_page: number;
  data: ProfessionalResponse[];
  per_page: number;
  total: number;
}

export interface ProfessionalsApiResponse {
  status: string;
  message: string;
  data: ProfessionalsPaginatedResponse;
}

export const fetchProfessionals = async (page: number = 1): Promise<ProfessionalResponse[]> => {
  try {
    const response = await apiClient.get<ProfessionalsApiResponse>('/professional/list', { params: { page } });
    if (response.data.status === 'success' && response.data.data?.data) {
      return response.data.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching professionals:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw { success: false, message: error.response.data?.message || 'Failed to fetch professionals', error: error.response.data?.error || error.message, status: error.response.status };
      } else if (error.request) {
        throw { success: false, message: 'No response from server. Please check your connection.', error: 'Network error' };
      }
    }
    throw { success: false, message: 'An unexpected error occurred', error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// TypeScript types for Privacy Settings
export interface PrivacySettings {
  id: number;
  profile_visibility: string;
  is_show_phone: boolean | number;
  is_show_email: boolean | number;
  is_allow_customer_review: boolean | number;
  professional_id: number;
  created_at: string;
  updated_at: string;
}

export interface GetPrivacySettingsRequest {
  api_token: string;
}

export interface GetPrivacySettingsResponse {
  status: boolean;
  message: string;
  data: PrivacySettings;
}

export interface CreatePrivacySettingsRequest {
  api_token: string;
  profile_visibility: string;
  is_show_phone: boolean;
  is_show_email: boolean;
  is_allow_customer_review: boolean;
}

export interface CreatePrivacySettingsResponse {
  status: boolean;
  message: string;
  data: PrivacySettings;
}

export const getPrivacySettings = async (
  api_token: string
): Promise<PrivacySettings | null> => {
  try {
    const response = await apiClient.post<GetPrivacySettingsResponse>(
      '/professional_privacy_settings/show',
      { api_token }
    );
    
    console.log('POST /professional_privacy_settings/show - Response:', response.data);
    
    if (response.data.status === true && response.data.data) {
      console.log('Privacy settings fetched successfully');
      return response.data.data;
    }
    
    console.warn('No privacy settings found in API response');
    return null;
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch privacy settings',
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

export const createOrUpdatePrivacySettings = async (
  data: CreatePrivacySettingsRequest
): Promise<PrivacySettings> => {
  try {
    const response = await apiClient.post<CreatePrivacySettingsResponse>(
      '/professional_privacy_settings/create',
      {
        api_token: data.api_token,
        profile_visibility: data.profile_visibility,
        is_show_phone: data.is_show_phone,
        is_show_email: data.is_show_email,
        is_allow_customer_review: data.is_allow_customer_review,
      }
    );
    
    console.log('POST /professional_privacy_settings/create - Response:', response.data);
    
    if (response.data.status === true && response.data.data) {
      console.log('Privacy settings created/updated successfully');
      return response.data.data;
    }
    
    throw {
      success: false,
      message: response.data.message || 'Failed to create/update privacy settings',
      error: 'Invalid response structure',
    };
  } catch (error) {
    console.error('Error creating/updating privacy settings:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create/update privacy settings',
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

// TypeScript types for Notification Settings
export interface NotificationSettings {
  id: number;
  is_email_notifications: number | boolean;
  is_sms_notifications: number | boolean;
  is_push_notifications: number | boolean;
  is_booking_alert: number | boolean;
  is_payment_alert: number | boolean;
  is_marketing_emails: number | boolean;
  professional_id: number;
  created_at: string;
  updated_at: string;
}

export interface GetNotificationSettingsRequest {
  api_token: string;
}

export interface GetNotificationSettingsResponse {
  status: boolean;
  message: string;
  data: NotificationSettings;
}

export interface CreateNotificationSettingsRequest {
  api_token: string;
  is_email_notifications: boolean;
  is_sms_notifications: boolean;
  is_push_notifications: boolean;
  is_booking_alert: boolean;
  is_payment_alert: boolean;
  is_marketing_emails: boolean;
}

export interface CreateNotificationSettingsResponse {
  status: boolean;
  message: string;
  data: NotificationSettings;
}

export const getNotificationSettings = async (
  api_token: string
): Promise<NotificationSettings | null> => {
  try {
    const response = await apiClient.post<GetNotificationSettingsResponse>(
      '/professional_notification_settings/show',
      { api_token }
    );
    
    console.log('POST /professional_notification_settings/show - Response:', response.data);
    
    if (response.data.status === true && response.data.data) {
      console.log('Notification settings fetched successfully');
      return response.data.data;
    }
    
    console.warn('No notification settings found in API response');
    return null;
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch notification settings',
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

export const createOrUpdateNotificationSettings = async (
  data: CreateNotificationSettingsRequest
): Promise<NotificationSettings> => {
  try {
    const response = await apiClient.post<CreateNotificationSettingsResponse>(
      '/professional_notification_settings/create',
      {
        api_token: data.api_token,
        is_email_notifications: data.is_email_notifications,
        is_sms_notifications: data.is_sms_notifications,
        is_push_notifications: data.is_push_notifications,
        is_booking_alert: data.is_booking_alert,
        is_payment_alert: data.is_payment_alert,
        is_marketing_emails: data.is_marketing_emails,
      }
    );
    
    console.log('POST /professional_notification_settings/create - Response:', response.data);
    
    if (response.data.status === true && response.data.data) {
      console.log('Notification settings created/updated successfully');
      return response.data.data;
    }
    
    throw {
      success: false,
      message: response.data.message || 'Failed to create/update notification settings',
      error: 'Invalid response structure',
    };
  } catch (error) {
    console.error('Error creating/updating notification settings:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create/update notification settings',
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

// TypeScript types for Create Professional
export interface CreateProfessionalRequest {
  api_token: string;
  name: string;
  business_name: string;
  about: string;
  email: string;
  number: string;
  business_location: string;
  post_code: string;
  services: Array<{ service_id: number }>;
  certificate_name?: string;
  description?: string;
  evidence?: string;
  status?: string;
  [key: string]: any;
}

export interface CreateProfessionalResponse {
  status: boolean | string;
  success?: boolean;
  message: string;
  data?: any;
  error?: string;
  professional_id?: number;
}

export const createProfessional = async (
  data: CreateProfessionalRequest
): Promise<CreateProfessionalResponse> => {
  try {
    const response = await apiClient.post<CreateProfessionalResponse>(
      '/professional/create',
      data
    );
    
    console.log('POST /professional/create - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating professional:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create professional',
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

// TypeScript types for Selected Services
export interface SelectedServiceItem {
  id?: number;
  service_id: number;
  service?: {
    id: number;
    name?: string;
  };
}

export interface GetSelectedServicesRequest {
  api_token: string;
  professional_id: number;
}

export interface GetSelectedServicesResponse {
  status: boolean;
  message: string;
  data: SelectedServiceItem[];
  error?: string;
}

export const getSelectedServices = async (
  data: GetSelectedServicesRequest
): Promise<GetSelectedServicesResponse> => {
  try {
    const response = await apiClient.post<GetSelectedServicesResponse>(
      '/professional/get_selected_service',
      {
        api_token: data.api_token,
        professional_id: data.professional_id,
      }
    );
    console.log('POST /professional/get_selected_service - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching selected services:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
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

// TypeScript types for Profile Completion
export interface ProfileCompletionDetails {
  basic_info?: boolean;
  contact_info?: boolean;
  services?: boolean;
  qualifications?: boolean;
  [key: string]: boolean | undefined;
}

export interface GetProfileCompletionPercentageRequest {
  api_token: string;
  professional_id: number;
}

export interface GetProfileCompletionPercentageResponse {
  status: boolean;
  message: string;
  profile_completion_percentage: number;
  details: ProfileCompletionDetails;
  error?: string;
}

export const getProfileCompletionPercentage = async (
  data: GetProfileCompletionPercentageRequest
): Promise<GetProfileCompletionPercentageResponse> => {
  try {
    const response = await apiClient.post<GetProfileCompletionPercentageResponse>(
      '/professional/profile_completion_percentage',
      {
        api_token: data.api_token,
        professional_id: data.professional_id,
      }
    );
    console.log('POST /professional/profile_completion_percentage - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile completion:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch profile completion',
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

// TypeScript types for Certificates
export interface CertificateItem {
  id: number;
  professional_id: number;
  certificate_name: string;
  description: string;
  evidence: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GetCertificatesRequest {
  api_token: string;
  professional_id: number;
}

export interface GetCertificatesResponse {
  status: boolean;
  message: string;
  data: CertificateItem[];
  error?: string;
}

export const getCertificates = async (
  data: GetCertificatesRequest
): Promise<GetCertificatesResponse> => {
  try {
    const response = await apiClient.post<GetCertificatesResponse>(
      '/professional/get_certificate',
      {
        api_token: data.api_token,
        professional_id: data.professional_id,
      }
    );
    console.log('POST /professional/get_certificate - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
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

// TypeScript types for Store Service Prices
export interface ServicePriceItem {
  service_id: number;
  price: string | number;
  [key: string]: any;
}

export interface StoreServicePricesRequest {
  api_token: string;
  services: ServicePriceItem[];
}

export interface StoreServicePricesResponse {
  status: boolean | string;
  success?: boolean;
  message: string;
  data?: any;
  error?: string;
}

export const storeServicePrices = async (
  data: StoreServicePricesRequest
): Promise<StoreServicePricesResponse> => {
  try {
    const response = await apiClient.post<StoreServicePricesResponse>(
      '/professional/service_price_store',
      data
    );
    
    console.log('POST /professional/service_price_store - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error storing service prices:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
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

// TypeScript types for Professional Day (Working Days, Blocked Days, etc.)
export interface ProfessionalDayResponse {
  id: number;
  date: string;
  type?: string;
  start_time?: string;
  end_time?: string;
  reason?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WorkingDayResponse {
  status: boolean;
  message: string;
  data: ProfessionalDayResponse[];
  error?: string;
}

export interface GetWorkingDaysRequest {
  api_token: string;
}

export interface CreateProfessionalDayRequest {
  api_token: string;
  type: string;
  date: string;
  start_time?: string;
  end_time?: string;
  reason?: string;
}

export interface CreateProfessionalDayResponse {
  status: boolean;
  message: string;
  data?: ProfessionalDayResponse;
  error?: string;
}

export interface GetBlockedDaysRequest {
  api_token: string;
}

export interface GetBlockedDaysResponse {
  status: boolean;
  message: string;
  data: ProfessionalDayResponse[];
  error?: string;
}

export interface DeleteProfessionalDayRequest {
  api_token: string;
  id: number;
}

export interface DeleteProfessionalDayResponse {
  status: boolean;
  message: string;
  error?: string;
}

export interface MonthlyAvailabilityData {
  [date: string]: {
    available: boolean;
    booked: boolean;
    blocked: boolean;
    bookings?: Array<{
      id: string;
      time: string;
      customer_name?: string;
    }>;
  };
}

export interface GetMonthlyAvailabilityRequest {
  api_token: string;
  month?: number; // Optional: 1-12 (January = 1, December = 12)
  year?: number; // Optional: e.g., 2026
}

export interface GetMonthlyAvailabilityResponse {
  status: boolean;
  message: string;
  data: MonthlyAvailabilityData;
  error?: string;
}

export interface MonthlyAvailabilitySummaryData {
  total_days: number;
  available_days: number;
  booked_days: number;
  blocked_days: number;
  unavailable_days: number;
}

export interface GetMonthlyAvailabilitySummaryRequest {
  api_token: string;
  month?: number; // Optional: 1-12 (January = 1, December = 12)
  year?: number; // Optional: e.g., 2026
}

export interface GetMonthlyAvailabilitySummaryResponse {
  status: boolean;
  message: string;
  data: MonthlyAvailabilitySummaryData;
  error?: string;
}

export const getWorkingDays = async (
  data: GetWorkingDaysRequest
): Promise<WorkingDayResponse> => {
  try {
    const response = await apiClient.post<WorkingDayResponse>(
      '/professional_working_days/list',
      { api_token: data.api_token }
    );
    console.log('POST /professional_working_days/list - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching working days:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
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

export const createProfessionalDay = async (
  data: CreateProfessionalDayRequest
): Promise<CreateProfessionalDayResponse> => {
  try {
    const response = await apiClient.post<CreateProfessionalDayResponse>(
      '/professional_days/create',
      data
    );
    
    console.log('POST /professional_days/create - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating professional day:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
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

export const getBlockedDays = async (
  data: GetBlockedDaysRequest
): Promise<GetBlockedDaysResponse> => {
  try {
    const response = await apiClient.post<GetBlockedDaysResponse>(
      '/professional_days/block',
      { api_token: data.api_token }
    );
    console.log('POST /professional_days/block - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching blocked days:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
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

export const deleteProfessionalDay = async (
  data: DeleteProfessionalDayRequest
): Promise<DeleteProfessionalDayResponse> => {
  try {
    const response = await apiClient.post<DeleteProfessionalDayResponse>(
      '/professional_days/delete',
      {
        api_token: data.api_token,
        id: data.id,
      }
    );
    
    console.log('POST /professional_days/delete - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting professional day:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
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

export const getMonthlyAvailability = async (
  data: GetMonthlyAvailabilityRequest
): Promise<GetMonthlyAvailabilityResponse> => {
  try {
    const requestBody: any = { api_token: data.api_token };
    
    // Add month and year if provided
    if (data.month !== undefined) {
      requestBody.month = data.month;
    }
    if (data.year !== undefined) {
      requestBody.year = data.year;
    }
    
    const response = await apiClient.post<GetMonthlyAvailabilityResponse>(
      '/professional/monthly_availability',
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly availability:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
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

export const getMonthlyAvailabilitySummary = async (
  data: GetMonthlyAvailabilitySummaryRequest
): Promise<GetMonthlyAvailabilitySummaryResponse> => {
  try {
    const requestBody: any = { api_token: data.api_token };
    
    // Add month and year if provided
    if (data.month !== undefined) {
      requestBody.month = data.month;
    }
    if (data.year !== undefined) {
      requestBody.year = data.year;
    }
    
    const response = await apiClient.post<GetMonthlyAvailabilitySummaryResponse>(
      '/professional/monthly_availability/summary',
      requestBody
    );
    console.log('POST /professional/monthly_availability/summary - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly availability summary:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
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

// TypeScript types for Dashboard Summary
export interface DashboardSummaryData {
  upcoming_jobs: {
    count: number;
    this_week: number;
  };
  earnings: {
    total: string;
    this_month: string;
  };
  reports: {
    pending: number;
  };
}

export interface DashboardSummaryResponse {
  status: string;
  data: DashboardSummaryData;
}

/**
 * Get professional dashboard summary
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_dashboard/summary
 * Method: POST
 * @param api_token - The API token for authentication
 * @returns Promise with the API response containing dashboard summary data
 */
export const getDashboardSummary = async (
  api_token: string
): Promise<DashboardSummaryResponse> => {
  try {
    console.log('POST /professional_dashboard/summary - Requesting...');
    
    const response = await apiClient.post<DashboardSummaryResponse>(
      '/professional_dashboard/summary',
      { api_token }
    );
    
    console.log('POST /professional_dashboard/summary - Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch dashboard summary',
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

// TypeScript types for Report Upload
export interface UploadReportRequest {
  api_token: string;
  user_id: number | null;
  booking_id: number;
  note: string;
  report_file: string; // Base64 encoded file
}

export interface UploadReportResponse {
  status: string;
  message: string;
  data?: {
    report_image: string;
    note: string;
    user_id: number;
    created_by: number;
    professional_id: number;
    booking_id: number;
    updated_at: string;
    created_at: string;
    id: number;
  };
}

/**
 * Upload a report for a booking
 * BaseURL: https://fireguide.attoexasolutions.com/api/reports/store
 * Method: POST
 * @param data - Report upload data including Base64 file
 * @returns Promise with the API response
 */
export const uploadReport = async (
  data: UploadReportRequest
): Promise<UploadReportResponse> => {
  try {
    console.log('POST /reports/store - Uploading report...');
    
    const response = await apiClient.post<UploadReportResponse>(
      '/reports/store',
      {
        api_token: data.api_token,
        user_id: data.user_id,
        booking_id: data.booking_id,
        note: data.note,
        report_file: data.report_file
      }
    );
    
    console.log('POST /reports/store - Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error uploading report:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to upload report',
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
