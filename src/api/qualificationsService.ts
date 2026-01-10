/// <reference types="vite/client" />
import axios from 'axios';

// TypeScript types for Qualification Certification response
export interface QualificationCertificationResponse {
  id: number;
  title: string;
  certification_date: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: number;
    full_name: string;
  } | null;
  updater: {
    id: number;
    full_name: string;
  } | null;
  professional: {
    id: number;
    name: string;
  } | null;
}

export interface QualificationsApiResponse {
  status: string;
  message: string;
  data: QualificationCertificationResponse[];
}

export interface UpdateCertificationRequest {
  api_token: string;
  id: number;
  title: string;
  certification_date: string; // YYYY-MM-DD format
  professional_id: number;
}

export interface UpdateCertificationResponse {
  status?: string;
  success?: boolean;
  message?: string;
  error?: string;
}

export interface DeleteCertificationRequest {
  api_token: string;
  id: number;
}

export interface DeleteCertificationResponse {
  status?: string;
  success?: boolean;
  message?: string;
  error?: string;
}

export interface CreateCertificationRequest {
  api_token: string;
  title?: string; // Optional for backward compatibility
  certification_date?: string; // Optional: YYYY-MM-DD format
  professional_id?: number; // Optional: may be inferred from token
  // New required fields
  certificate_name: string;
  description: string;
  evidence: string; // File name or base64 encoded file
  status: string; // e.g., "pending", "verified", "rejected"
}

export interface CreateCertificationResponse {
  status?: string;
  success?: boolean;
  message?: string;
  error?: string;
  data?: QualificationCertificationResponse;
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
 * Fetch all qualification certifications
 * @returns Promise with the API response
 */
export const fetchQualifications = async (): Promise<QualificationCertificationResponse[]> => {
  try {
    const response = await apiClient.get<QualificationsApiResponse>('/qualifications-certification');
    
    // Handle the response structure
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data; // Direct array
    }
    
    // Fallback: return empty array if structure is unexpected
    return [];
  } catch (error) {
    console.error('Error fetching qualifications:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch qualifications',
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
 * Update a qualification certification
 * @param data - Update certification data
 * @returns Promise with the API response
 */
export const updateCertification = async (
  data: UpdateCertificationRequest
): Promise<UpdateCertificationResponse> => {
  try {
    const response = await apiClient.post<UpdateCertificationResponse>(
      '/qualifications-certification/update',
      {
        api_token: data.api_token,
        id: data.id,
        title: data.title,
        certification_date: data.certification_date,
        professional_id: data.professional_id
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating certification:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to update certification',
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
 * Delete a qualification certification
 * @param data - Delete certification data (api_token and id)
 * @returns Promise with the API response
 */
export const deleteCertification = async (
  data: DeleteCertificationRequest
): Promise<DeleteCertificationResponse> => {
  try {
    const response = await apiClient.post<DeleteCertificationResponse>(
      '/qualifications-certification/delete',
      {
        api_token: data.api_token,
        id: data.id
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting certification:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to delete certification',
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
 * Create a new qualification certification
 * @param data - Create certification data
 * @returns Promise with the API response
 */
export const createCertification = async (
  data: CreateCertificationRequest
): Promise<CreateCertificationResponse> => {
  try {
    // Build request body with all fields
    const requestBody: any = {
      api_token: data.api_token,
      certificate_name: data.certificate_name,
      description: data.description,
      evidence: data.evidence,
      status: data.status,
    };

    // Add optional fields if provided (for backward compatibility)
    if (data.title) {
      requestBody.title = data.title;
    }
    if (data.certification_date) {
      requestBody.certification_date = data.certification_date;
    }
    if (data.professional_id) {
      requestBody.professional_id = data.professional_id;
    }

    console.log('POST /qualifications-certification/create - Request payload:', {
      endpoint: '/qualifications-certification/create',
      hasApiToken: !!requestBody.api_token,
      certificate_name: requestBody.certificate_name,
      description: requestBody.description,
      evidence: requestBody.evidence ? `${requestBody.evidence.substring(0, 50)}...` : 'not provided',
      status: requestBody.status,
      title: requestBody.title || 'not provided',
      certification_date: requestBody.certification_date || 'not provided',
      professional_id: requestBody.professional_id || 'not provided'
    });

    const response = await apiClient.post<CreateCertificationResponse>(
      '/qualifications-certification/create',
      requestBody
    );
    
    console.log('POST /qualifications-certification/create - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating certification:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create certification',
          error: error.response.data?.error || error.message,
          status: error.response.status,
        };
      } else if (error.request) {
        console.error('No response received. Request was made but no response:', error.request);
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
