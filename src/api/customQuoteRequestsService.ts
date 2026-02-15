import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://fireguide.attoexasolutions.com/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export interface CustomQuoteRequestData {
  building_type: string;
  people_count: string;
  floors: number;
  assessment_type: string;
  notes?: string;
}

export interface CustomQuoteStoreResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    service_id: number;
    user_id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    request_data: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

export interface MyQuoteRequestItem {
  id: number;
  service_id: number;
  user_id: number;
  professional_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  request_data: string;
  status: string;
  created_at: string;
  updated_at: string;
  service?: { id: number; service_name: string };
  professional?: { id: number; name: string; email?: string } | null;
}

export interface MyQuoteRequestsResponse {
  status: boolean;
  message: string;
  data: MyQuoteRequestItem[];
}

export interface AdminQuoteRequestItem {
  id: number;
  service_id: number;
  user_id: number | null;
  professional_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  request_data: string;
  status: string;
  created_at: string;
  updated_at: string;
  service?: { id: number; service_name: string };
  user?: { id: number; full_name: string; email: string } | null;
  professional?: { id: number; name: string; email?: string } | null;
}

export interface AdminQuoteRequestSingleResponse {
  status: boolean;
  message: string;
  data: AdminQuoteRequestItem;
}

/**
 * Fetch a single custom quote request (admin)
 * POST /custom-quote-requests/get-single
 * Body: { api_token, id }
 */
export const getSingleCustomQuoteRequest = async (
  apiToken: string,
  id: number
): Promise<AdminQuoteRequestSingleResponse> => {
  try {
    const response = await apiClient.post<AdminQuoteRequestSingleResponse>(
      '/custom-quote-requests/get-single',
      { api_token: apiToken, id }
    );
    const data = response.data;
    if (!data?.status) {
      throw new Error((data as { message?: string })?.message || 'Fetch failed');
    }
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message;
      throw new Error(typeof msg === 'string' ? msg : 'Failed to fetch quote request');
    }
    throw err;
  }
};

export interface AdminQuoteRequestsResponse {
  status: boolean;
  message: string;
  data: AdminQuoteRequestItem[];
}

/**
 * Fetch all custom quote requests (admin)
 * POST /custom-quote-requests/get-all
 * Body: { api_token }
 */
export const getAllCustomQuoteRequests = async (apiToken: string): Promise<AdminQuoteRequestsResponse> => {
  try {
    const response = await apiClient.post<AdminQuoteRequestsResponse>(
      '/custom-quote-requests/get-all',
      { api_token: apiToken }
    );
    const data = response.data;
    if (!data?.status) {
      throw new Error((data as { message?: string })?.message || 'Fetch failed');
    }
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message;
      throw new Error(typeof msg === 'string' ? msg : 'Failed to fetch quote requests');
    }
    throw err;
  }
};

/**
 * Fetch current user's custom quote requests
 * POST /custom-quote-requests/my-requests
 * Body: { api_token }
 */
export const getMyQuoteRequests = async (apiToken: string): Promise<MyQuoteRequestsResponse> => {
  try {
    const response = await apiClient.post<MyQuoteRequestsResponse>(
      '/custom-quote-requests/my-requests',
      { api_token: apiToken }
    );
    const data = response.data;
    if (!data?.status) {
      throw new Error((data as { message?: string })?.message || 'Fetch failed');
    }
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message;
      throw new Error(typeof msg === 'string' ? msg : 'Failed to fetch quote requests');
    }
    throw err;
  }
};

/**
 * Create a custom quote request
 * POST https://fireguide.attoexasolutions.com/api/custom-quote-requests/store
 * Body: { api_token? (optional), service_id, customer_name, customer_email, customer_phone, request_data }
 */
export const storeCustomQuoteRequest = async (
  apiToken: string | null,
  serviceId: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  requestData: CustomQuoteRequestData
): Promise<CustomQuoteStoreResponse> => {
  try {
  const payload: Record<string, unknown> = {
      service_id: serviceId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      request_data: requestData,
    };
  if (apiToken) {
    payload.api_token = apiToken;
  }
  const response = await apiClient.post<CustomQuoteStoreResponse>(
    '/custom-quote-requests/store',
    payload
  );
  const data = response.data;
  if (!data?.status) {
    throw new Error((data as { message?: string })?.message || 'Submit failed');
  }
  return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message;
      throw new Error(typeof msg === 'string' ? msg : 'Failed to submit custom quote request');
    }
    throw err;
  }
};

/**
 * Update custom quote request status (admin)
 * POST /custom-quote-requests/update-status
 * Body: { api_token, id, status }
 */
export const updateQuoteRequestStatus = async (
  apiToken: string,
  quoteRequestId: number,
  status: string
): Promise<AdminQuoteRequestSingleResponse> => {
  try {
    const response = await apiClient.post<AdminQuoteRequestSingleResponse>(
      '/custom-quote-requests/update-status',
      { api_token: apiToken, id: quoteRequestId, status }
    );
    const data = response.data;
    if (!data?.status) {
      throw new Error((data as { message?: string })?.message || 'Update failed');
    }
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message;
      throw new Error(typeof msg === 'string' ? msg : 'Failed to update status');
    }
    throw err;
  }
};

/**
 * Assign a professional to a custom quote request (admin)
 * POST /custom-quote-requests/assign-professional
 * Body: { api_token, id, professional_id }
 */
export const assignProfessionalToQuoteRequest = async (
  apiToken: string,
  quoteRequestId: number,
  professionalId: number
): Promise<AdminQuoteRequestSingleResponse> => {
  try {
    const response = await apiClient.post<AdminQuoteRequestSingleResponse>(
      '/custom-quote-requests/assign-professional',
      { api_token: apiToken, id: quoteRequestId, professional_id: professionalId }
    );
    const data = response.data;
    if (!data?.status) {
      throw new Error((data as { message?: string })?.message || 'Assign failed');
    }
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message;
      throw new Error(typeof msg === 'string' ? msg : 'Failed to assign professional');
    }
    throw err;
  }
};
