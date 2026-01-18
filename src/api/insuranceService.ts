import axios from 'axios';

// Types for insurance coverage API
export interface InsuranceItem {
  id: number;
  title: string;
  price: string;
  provider_name?: string;
  document?: string;
  status?: string;
  provider_id?: number | null;
  expire_date: string;
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
    name: string | null;
  } | null;
}

export interface InsuranceApiResponse {
  status: string;
  message: string;
  data: InsuranceItem[];
}

export interface CreateInsuranceRequest {
  api_token: string;
  title: string;
  price: string;
  expire_date: string;
  professional_id: number;
}

export interface CreateInsuranceResponse {
  status: string;
  message: string;
  data?: InsuranceItem;
  success?: boolean;
  error?: string;
}

export interface UpdateInsuranceRequest {
  api_token: string;
  id: number;
  title: string;
  price: string;
  expire_date: string;
  professional_id: number;
}

export interface UpdateInsuranceResponse {
  status: string;
  message: string;
  data?: InsuranceItem;
  success?: boolean;
  error?: string;
}

export interface DeleteInsuranceRequest {
  api_token: string;
  id: number;
}

export interface DeleteInsuranceResponse {
  status: string;
  message: string;
  success?: boolean;
  error?: string;
}

export interface UpdateInsuranceDocumentRequest {
  api_token: string;
  id: number; // Insurance ID
  professional_id: number;
  document: string | File; // Base64 encoded file data (for images) or File object (for documents)
}

export interface UpdateInsuranceDocumentResponse {
  status?: boolean | string;
  success?: boolean;
  message?: string;
  data?: {
    insurance_id: number; // API returns insurance_id, not id
    document: string;
    status: string;
  };
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
 * Show insurance coverages (POST endpoint)
 * @param data - Request data with api_token
 * @returns Promise with the API response
 */
export const showInsuranceCoverage = async (data: { api_token: string }): Promise<InsuranceApiResponse> => {
  try {
    const response = await apiClient.post<InsuranceApiResponse>('/insurance-coverage/show', {
      api_token: data.api_token
    });
    
    // Handle the response structure
    if (response.data.status === 'success' && response.data.data) {
      return response.data;
    }
    
    // Fallback: return response as is
    return response.data;
  } catch (error) {
    console.error('Error showing insurance coverages:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch insurance coverages',
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
 * Fetch all insurance coverages
 * @returns Promise with the API response
 */
export const fetchInsuranceCoverages = async (): Promise<InsuranceItem[]> => {
  try {
    const response = await apiClient.get<InsuranceApiResponse>('/insurance-coverage');
    
    // Handle the response structure
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data; // Direct array
    }
    
    // Fallback: return empty array if structure is unexpected
    return [];
  } catch (error) {
    console.error('Error fetching insurance coverages:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch insurance coverages',
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
 * Create a new insurance coverage
 * @param data - Insurance coverage data
 * @returns Promise with the API response
 */
export const createInsuranceCoverage = async (data: CreateInsuranceRequest): Promise<CreateInsuranceResponse> => {
  try {
    const response = await apiClient.post<CreateInsuranceResponse>('/insurance-coverage/create', data);
    
    // Handle the response structure
    if (response.data.status === 'success' || response.data.success) {
      return response.data;
    }
    
    // Fallback: return response as is
    return response.data;
  } catch (error) {
    console.error('Error creating insurance coverage:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create insurance coverage',
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
 * Update an existing insurance coverage
 * @param data - Insurance coverage data with id
 * @returns Promise with the API response
 */
export const updateInsuranceCoverage = async (data: UpdateInsuranceRequest): Promise<UpdateInsuranceResponse> => {
  try {
    const response = await apiClient.post<UpdateInsuranceResponse>('/insurance-coverage/update', data);
    
    // Handle the response structure
    if (response.data.status === 'success' || response.data.success) {
      return response.data;
    }
    
    // Fallback: return response as is
    return response.data;
  } catch (error) {
    console.error('Error updating insurance coverage:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to update insurance coverage',
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
 * Update insurance document
 * BaseURL: https://fireguide.attoexasolutions.com/api/insurance-coverage/update_document
 * Method: POST
 * - Images: JSON body with base64 document
 * - Documents (PDF, Word, Excel, etc.): FormData with File object
 */
export const updateInsuranceDocument = async (
  data: UpdateInsuranceDocumentRequest
): Promise<UpdateInsuranceDocumentResponse> => {
  try {
    const isFileObject = data.document instanceof File;
    let response: any;

    if (isFileObject) {
      // For documents (PDF, Word, Excel, etc.): send File object as FormData
      const formData = new FormData();
      formData.append('api_token', data.api_token);
      formData.append('insurance_id', data.id.toString()); // API expects insurance_id, not id
      formData.append('professional_id', data.professional_id.toString());
      formData.append('document', data.document as File);

      console.log('POST /insurance-coverage/update_document - Request (FormData):', {
        endpoint: '/insurance-coverage/update_document',
        hasApiToken: !!data.api_token,
        insurance_id: data.id,
        professional_id: data.professional_id,
        document: `File: ${(data.document as File).name}`,
      });

      response = await apiClient.post<UpdateInsuranceDocumentResponse>(
        '/insurance-coverage/update_document',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    } else {
      // For images: send base64 string as JSON body
      const requestBody: any = {
        api_token: data.api_token,
        insurance_id: data.id, // API expects insurance_id, not id
        professional_id: data.professional_id,
        document: data.document as string,
      };

      console.log('POST /insurance-coverage/update_document - Request (JSON):', {
        endpoint: '/insurance-coverage/update_document',
        hasApiToken: !!requestBody.api_token,
        insurance_id: requestBody.insurance_id,
        professional_id: requestBody.professional_id,
        document: requestBody.document ? `${requestBody.document.substring(0, 50)}...` : 'not provided',
      });

      response = await apiClient.post<UpdateInsuranceDocumentResponse>(
        '/insurance-coverage/update_document',
        requestBody,
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('POST /insurance-coverage/update_document - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating insurance document:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to update insurance document',
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

/**
 * Delete an insurance coverage
 * @param data - Delete request with api_token and id
 * @returns Promise with the API response
 */
export const deleteInsuranceCoverage = async (data: DeleteInsuranceRequest): Promise<DeleteInsuranceResponse> => {
  try {
    const response = await apiClient.post<DeleteInsuranceResponse>('/insurance-coverage/delete', data);
    
    // Handle the response structure
    if (response.data.status === 'success' || response.data.success) {
      return response.data;
    }
    
    // Fallback: return response as is
    return response.data;
  } catch (error) {
    console.error('Error deleting insurance coverage:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to delete insurance coverage',
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
