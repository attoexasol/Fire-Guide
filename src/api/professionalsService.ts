/// <reference types="vite/client" />
import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://fireguide.attoexasolutions.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Professional identity item from API
export interface ProfessionalIdentityItem {
  id: number;
  file: string;
  status: string;
  professional: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

// TypeScript types for professional wise identity request
export interface GetProfessionalWiseIdentityRequest {
  api_token: string;
}

// TypeScript types for professional wise identity response
export interface GetProfessionalWiseIdentityResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: ProfessionalIdentityItem[];
  error?: string;
}

/**
 * Get professional wise identity
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_wise_identity
 * Method: POST
 */
export const getProfessionalWiseIdentity = async (
  data: GetProfessionalWiseIdentityRequest
): Promise<GetProfessionalWiseIdentityResponse> => {
  try {
    const requestBody: any = {
      api_token: data.api_token,
    };

    console.log('POST /professional_wise_identity - Request payload:', {
      endpoint: '/professional_wise_identity',
    });

    const response = await apiClient.post<GetProfessionalWiseIdentityResponse>(
      '/professional_wise_identity',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional_wise_identity - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching professional wise identity:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch professional wise identity',
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

// TypeScript types for update professional identity request
export interface UpdateProfessionalIdentityRequest {
  api_token: string;
  id: number;
  professional_id: number;
  file: string | File; // Base64 encoded file data (for images) or File object (for documents)
}

// TypeScript types for update professional identity response
export interface UpdateProfessionalIdentityResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: ProfessionalIdentityItem;
  error?: string;
}

/**
 * Update professional identity
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_identity/update
 * Method: POST
 */
export const updateProfessionalIdentity = async (
  data: UpdateProfessionalIdentityRequest
): Promise<UpdateProfessionalIdentityResponse> => {
  try {
    // Check if file is a File object (FormData) or base64 string (JSON)
    const isFileObject = data.file instanceof File;

    let response: any;

    if (isFileObject) {
      // Use FormData for non-image files (PDF, Word, Excel, etc.)
      const formData = new FormData();
      formData.append('api_token', data.api_token);
      formData.append('id', data.id.toString());
      formData.append('professional_id', data.professional_id.toString());
      formData.append('file', data.file as File);

      console.log('POST /professional_identity/update - Request payload (FormData):', {
        endpoint: '/professional_identity/update',
        has_api_token: !!data.api_token,
        id: data.id,
        professional_id: data.professional_id,
        file_name: (data.file as File).name,
        file_type: (data.file as File).type,
        file_size: (data.file as File).size,
      });

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
      // Use JSON body for base64 encoded files (images)
      const requestBody: any = {
        api_token: data.api_token,
        id: data.id,
        professional_id: data.professional_id,
        file: data.file as string, // Base64 encoded string
      };

      console.log('POST /professional_identity/update - Request payload (JSON):', {
        endpoint: '/professional_identity/update',
        has_api_token: !!requestBody.api_token,
        id: requestBody.id,
        professional_id: requestBody.professional_id,
        file_length: (requestBody.file as string)?.length || 0,
      });

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
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
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

// ========== MISSING CRITICAL EXPORTS ==========

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
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
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
}

export interface CreateProfessionalResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export const createProfessional = async (data: CreateProfessionalRequest): Promise<CreateProfessionalResponse> => {
  try {
    const requestBody: any = { api_token: data.api_token, name: data.name, business_name: data.business_name, about: data.about, email: data.email, number: data.number, business_location: data.business_location, post_code: data.post_code, services: data.services };
    if (data.certificate_name) requestBody.certificate_name = data.certificate_name;
    if (data.description) requestBody.description = data.description;
    if (data.evidence) requestBody.evidence = data.evidence;
    if (data.status) requestBody.status = data.status;
    const response = await apiClient.post<CreateProfessionalResponse>('/professional/create', requestBody);
    return response.data;
  } catch (error) {
    console.error('Error creating professional profile:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw { success: false, message: error.response.data?.message || 'Failed to create professional profile', error: error.response.data?.error || error.message, status: error.response.status };
      } else if (error.request) {
        throw { success: false, message: 'No response from server. Please check your connection.', error: 'Network error' };
      }
    }
    throw { success: false, message: 'An unexpected error occurred', error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export interface GetSelectedServiceRequest {
  professional_id: number;
  api_token?: string;
}

export interface SelectedServiceItem {
  id: number;
  professional_id: number;
  service_id?: number;
  price: string | null;
  service_area: string | null;
  created_by: number | { id: number; full_name: string } | null;
  updated_by: number | { id: number; full_name: string } | null;
  created_at: string;
  updated_at: string;
  service?: { id: number; service_name: string; description: string | null } | null;
}

export interface GetSelectedServiceResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: SelectedServiceItem[];
  error?: string;
}

export const getSelectedServices = async (data: GetSelectedServiceRequest): Promise<GetSelectedServiceResponse> => {
  try {
    const requestBody: any = { professional_id: data.professional_id };
    if (data.api_token) requestBody.api_token = data.api_token;
    const response = await apiClient.post<GetSelectedServiceResponse>('/professional/get_selected_service', requestBody);
    return response.data;
  } catch (error) {
    console.error('Error fetching selected services:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw { success: false, message: error.response.data?.message || 'Failed to fetch selected services', error: error.response.data?.error || error.message, status: error.response.status };
      } else if (error.request) {
        throw { success: false, message: 'No response from server. Please check your connection.', error: 'Network error' };
      }
    }
    throw { success: false, message: 'An unexpected error occurred', error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export interface StoreServicePriceRequest {
  api_token: string;
  services: Array<{ service_id: number; price: number }>;
}

export interface StoreServicePriceResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: SelectedServiceItem[];
  error?: string;
}

export const storeServicePrices = async (data: StoreServicePriceRequest): Promise<StoreServicePriceResponse> => {
  try {
    const requestBody: any = { api_token: data.api_token, services: data.services.map(s => ({ service_id: s.service_id, price: s.price })) };
    const response = await apiClient.post<StoreServicePriceResponse>('/professional/service_price_store', requestBody);
    return response.data;
  } catch (error) {
    console.error('Error storing service prices:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw { success: false, message: error.response.data?.message || 'Failed to store service prices', error: error.response.data?.error || error.message, status: error.response.status };
      } else if (error.request) {
        throw { success: false, message: 'No response from server. Please check your connection.', error: 'Network error' };
      }
    }
    throw { success: false, message: 'An unexpected error occurred', error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export interface GetProfileCompletionRequest {
  professional_id: number;
  api_token?: string;
}

export interface ProfileCompletionDetails {
  basic_info: number;
  contact_info: number;
  profile_image: number;
  selected_services: number;
  certificates: number;
}

export interface GetProfileCompletionResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  profile_completion_percentage?: number;
  details?: ProfileCompletionDetails;
  error?: string;
}

export const getProfileCompletionPercentage = async (data: GetProfileCompletionRequest): Promise<GetProfileCompletionResponse> => {
  try {
    const requestBody: any = { professional_id: data.professional_id };
    if (data.api_token) requestBody.api_token = data.api_token;
    const response = await apiClient.post<GetProfileCompletionResponse>('/professional/profile_completion_percentage', requestBody);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile completion percentage:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw { success: false, message: error.response.data?.message || 'Failed to fetch profile completion percentage', error: error.response.data?.error || error.message, status: error.response.status };
      } else if (error.request) {
        throw { success: false, message: 'No response from server. Please check your connection.', error: 'Network error' };
      }
    }
    throw { success: false, message: 'An unexpected error occurred', error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export interface GetCertificateRequest {
  professional_id: number;
  api_token?: string;
}

export interface CertificateItem {
  id: number;
  name: string;
  description: string;
  evidence: string;
  status: string;
  professional_id: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface GetCertificateResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: CertificateItem[];
  error?: string;
}

export const getCertificates = async (data: GetCertificateRequest): Promise<GetCertificateResponse> => {
  try {
    const requestBody: any = { professional_id: data.professional_id };
    if (data.api_token) requestBody.api_token = data.api_token;
    const response = await apiClient.post<GetCertificateResponse>('/professional/get_certificate', requestBody);
    return response.data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw { success: false, message: error.response.data?.message || 'Failed to fetch certificates', error: error.response.data?.error || error.message, status: error.response.status };
      } else if (error.request) {
        throw { success: false, message: 'No response from server. Please check your connection.', error: 'Network error' };
      }
    }
    throw { success: false, message: 'An unexpected error occurred', error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Placeholder exports for availability functions
export interface WorkingDayResponse {
  id: number;
  week_day: string;
  start_time: string;
  end_time: string;
  is_closed: number;
  professional_id: number;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  professional: { id: number; name: string };
}

export interface ProfessionalDayResponse {
  id: number;
  professional_id: number;
  type: string;
  date: string;
  start_time: string;
  end_time: string;
  reason: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyAvailabilityData {
  month: string;
  past: string[];
  booked: string[];
  blocked: string[];
  available: string[];
}

export interface MonthlyAvailabilitySummaryData {
  month: string;
  book_count: number;
  block_count: number;
  available_count: number;
}

export const getWorkingDays = async (data: { api_token: string }): Promise<any> => { throw new Error('Not implemented'); };
export const createProfessionalDay = async (data: any): Promise<any> => { throw new Error('Not implemented'); };
export const getBlockedDays = async (data: { api_token: string }): Promise<any> => { throw new Error('Not implemented'); };
export const deleteProfessionalDay = async (data: any): Promise<any> => { throw new Error('Not implemented'); };
export const getMonthlyAvailability = async (data: { api_token: string }): Promise<any> => { throw new Error('Not implemented'); };
export const getMonthlyAvailabilitySummary = async (data: { api_token: string }): Promise<any> => { throw new Error('Not implemented'); };

// Verification Summary
export interface GetVerificationSummaryRequest {
  api_token: string;
}

export interface VerificationSummaryData {
  title: string;
  subtitle: string;
  active_status: string;
  progress_percentage: number;
  checks: {
    insurance: boolean;
    certificate: boolean;
    identity: boolean;
    dbs: boolean;
  };
}

export interface GetVerificationSummaryResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: VerificationSummaryData;
  error?: string;
}

export const getVerificationSummary = async (
  data: GetVerificationSummaryRequest
): Promise<GetVerificationSummaryResponse> => {
  try {
    const requestBody: any = {
      api_token: data.api_token,
    };

    console.log('POST /professional/verification_summary - Request payload:', {
      endpoint: '/professional/verification_summary',
      has_api_token: !!requestBody.api_token,
    });

    const response = await apiClient.post<GetVerificationSummaryResponse>(
      '/professional/verification_summary',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional/verification_summary - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching verification summary:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
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

// Professional DBS item from API (same structure as identity)
export interface ProfessionalDBSItem {
  id: number;
  file: string;
  status: string;
  professional: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

// TypeScript types for professional wise DBS request
export interface GetProfessionalWiseDBSRequest {
  api_token: string;
}

// TypeScript types for professional wise DBS response
export interface GetProfessionalWiseDBSResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: ProfessionalDBSItem[];
  error?: string;
}

/**
 * Get professional wise DBS
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_wise_bds
 * Method: POST
 */
export const getProfessionalWiseDBS = async (
  data: GetProfessionalWiseDBSRequest
): Promise<GetProfessionalWiseDBSResponse> => {
  try {
    const requestBody: any = {
      api_token: data.api_token,
    };

    console.log('POST /professional_wise_bds - Request payload:', {
      endpoint: '/professional_wise_bds',
    });

    const response = await apiClient.post<GetProfessionalWiseDBSResponse>(
      '/professional_wise_bds',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /professional_wise_bds - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching professional wise DBS:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch professional wise DBS',
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

// TypeScript types for update professional DBS request
export interface UpdateProfessionalDBSRequest {
  api_token: string;
  id: number;
  professional_id: number;
  file: string | File; // Base64 encoded file data (for images) or File object (for documents)
}

// TypeScript types for update professional DBS response
export interface UpdateProfessionalDBSResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: ProfessionalDBSItem;
  error?: string;
}

/**
 * Update professional DBS
 * BaseURL: https://fireguide.attoexasolutions.com/api/professional_dbs/update
 * Method: POST
 */
export const updateProfessionalDBS = async (
  data: UpdateProfessionalDBSRequest
): Promise<UpdateProfessionalDBSResponse> => {
  try {
    // Check if file is a File object (FormData) or base64 string (JSON)
    const isFileObject = data.file instanceof File;

    let response: any;

    if (isFileObject) {
      // Use FormData for non-image files (PDF, Word, Excel, etc.)
      const formData = new FormData();
      formData.append('api_token', data.api_token);
      formData.append('id', data.id.toString());
      formData.append('professional_id', data.professional_id.toString());
      formData.append('file', data.file as File);

      console.log('POST /professional_dbs/update - Request payload (FormData):', {
        endpoint: '/professional_dbs/update',
        has_api_token: !!data.api_token,
        id: data.id,
        professional_id: data.professional_id,
        file_name: (data.file as File).name,
        file_type: (data.file as File).type,
        file_size: (data.file as File).size,
      });

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
      // Use JSON body for base64 encoded files (images)
      const requestBody: any = {
        api_token: data.api_token,
        id: data.id,
        professional_id: data.professional_id,
        file: data.file as string, // Base64 encoded string
      };

      console.log('POST /professional_dbs/update - Request payload (JSON):', {
        endpoint: '/professional_dbs/update',
        has_api_token: !!requestBody.api_token,
        id: requestBody.id,
        professional_id: requestBody.professional_id,
        file_length: (requestBody.file as string)?.length || 0,
      });

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
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
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

// Professional Qualifications/Certifications Evidence
export interface ProfessionalEvidenceItem {
  id: number;
  evidence: string; // URL or filename
  status: string;
  created_at?: string; // ISO date string
}

// TypeScript types for professional wise evidence request
export interface GetProfessionalWiseEvidenceRequest {
  api_token: string;
}

// TypeScript types for professional wise evidence response
export interface GetProfessionalWiseEvidenceResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: ProfessionalEvidenceItem[];
  error?: string;
}

/**
 * Get professional wise evidence (qualifications/certifications)
 * BaseURL: https://fireguide.attoexasolutions.com/api/qualifications-certification/professional_wise_evidence
 * Method: POST
 */
export const getProfessionalWiseEvidence = async (
  data: GetProfessionalWiseEvidenceRequest
): Promise<GetProfessionalWiseEvidenceResponse> => {
  try {
    const requestBody: any = {
      api_token: data.api_token,
    };

    console.log('POST /qualifications-certification/professional_wise_evidence - Request payload:', {
      endpoint: '/qualifications-certification/professional_wise_evidence',
    });

    const response = await apiClient.post<GetProfessionalWiseEvidenceResponse>(
      '/qualifications-certification/professional_wise_evidence',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('POST /qualifications-certification/professional_wise_evidence - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching professional wise evidence:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch professional wise evidence',
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
