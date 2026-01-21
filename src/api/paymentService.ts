/// <reference types="vite/client" />
import axios from 'axios';
import { handleTokenExpired, isTokenExpiredError } from '../lib/auth';

// TypeScript types for Payment Invoice Store request
export interface PaymentInvoiceStoreRequest {
  api_token: string;
  card_number: string;
  cardholder_name: string;
  expiry_date: string; // Format: YYYY-MM-DD
  cvv: number;
  is_terms_privacy: boolean;
  professional_booking_id: number;
}

export interface PaymentInvoiceStoreResponse {
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
  timeout: 30000, // 30 seconds timeout for payment submission
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

/**
 * Store payment invoice
 * @param data - Payment invoice data
 * @returns Promise with the API response
 */
export const storePaymentInvoice = async (
  data: PaymentInvoiceStoreRequest
): Promise<PaymentInvoiceStoreResponse> => {
  try {
    const response = await apiClient.post<PaymentInvoiceStoreResponse>(
      '/payment_invoice/store',
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error storing payment invoice:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to process payment',
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

// TypeScript types for Payment Invoice Item
export interface PaymentInvoiceItem {
  id: number;
  card_number: string;
  cardholder_name: string;
  expiry_date: string;
  cvv: number;
  is_terms_privacy: number;
  status: string;
  price: string;
  tx_ref: string;
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
  professional_booking: {
    id: number;
    first_name: string;
    professional_id: number;
  } | null;
  service: {
    id: number;
    name: string;
    price: string;
  } | null;
  professional?: {
    id: number;
    name: string;
  } | null;
}

export interface GetPaymentInvoicesRequest {
  api_token: string;
}

export interface GetPaymentInvoicesResponse {
  status: string;
  message: string;
  data: PaymentInvoiceItem[];
}

/**
 * Get all payment invoices
 * BaseURL: https://fireguide.attoexasolutions.com/api/payment_invoice
 * Method: POST
 * @param api_token - The API token for authentication
 * @returns Promise with the API response containing array of payment invoices
 */
export const getPaymentInvoices = async (
  api_token: string
): Promise<PaymentInvoiceItem[]> => {
  try {
    const response = await apiClient.post<GetPaymentInvoicesResponse>(
      '/payment_invoice',
      { api_token }
    );
    
    console.log('POST /payment_invoice - Response:', response.data);
    
    // Handle the response structure: { status: 'success', data: [...] }
    if (response.data.status === 'success' && Array.isArray(response.data.data)) {
      console.log('Payment invoices found:', response.data.data.length);
      return response.data.data;
    }
    
    // Fallback: return empty array if structure is unexpected
    console.warn('Unexpected payment invoices API response structure:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching payment invoices:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch payment invoices',
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

// TypeScript types for Earnings Summary request
export interface EarningsSummaryRequest {
  api_token: string;
}

export interface EarningsSummaryResponse {
  success: boolean;
  data: {
    available_balance: number;
    pending: number;
    total_earned: number;
  };
}

/**
 * Get earnings summary
 * BaseURL: https://fireguide.attoexasolutions.com/api/payment_invoice/earnings_summary
 * Method: POST
 * @param api_token - The API token for authentication
 * @returns Promise with the API response containing earnings summary
 */
export const getEarningsSummary = async (
  api_token: string
): Promise<EarningsSummaryResponse> => {
  try {
    const response = await apiClient.post<EarningsSummaryResponse>(
      '/payment_invoice/earnings_summary',
      { api_token }
    );
    
    console.log('POST /payment_invoice/earnings_summary - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching earnings summary:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch earnings summary',
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

// TypeScript types for Monthly Earnings request
export interface MonthlyEarningsRequest {
  api_token: string;
}

export interface MonthlyEarningsItem {
  month: string;
  earnings: number;
  jobs: number;
}

export interface MonthlyEarningsResponse {
  status: string;
  message: string;
  data: MonthlyEarningsItem[];
}

/**
 * Get monthly earnings
 * BaseURL: https://fireguide.attoexasolutions.com/api/payment_invoice/earnings_monthly
 * Method: POST
 * @param api_token - The API token for authentication
 * @returns Promise with the API response containing monthly earnings data
 */
export const getMonthlyEarnings = async (
  api_token: string
): Promise<MonthlyEarningsItem[]> => {
  try {
    const response = await apiClient.post<MonthlyEarningsResponse>(
      '/payment_invoice/earnings_monthly',
      { api_token }
    );
    
    console.log('POST /payment_invoice/earnings_monthly - Response:', response.data);
    
    // Handle the response structure: { status: 'success', data: [...] }
    if (response.data.status === 'success' && Array.isArray(response.data.data)) {
      console.log('Monthly earnings found:', response.data.data.length);
      return response.data.data;
    }
    
    // Fallback: return empty array if structure is unexpected
    console.warn('Unexpected monthly earnings API response structure:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching monthly earnings:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch monthly earnings',
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

// TypeScript types for Payout Details
export interface PayoutDetails {
  id: number;
  account_holder_name: string;
  sort_code: string;
  account_number: string;
  note?: string | null;
  professional_id: number;
  created_by?: number | null;
  updated_by?: number | null;
  created_at: string;
  updated_at: string;
}

export interface GetPayoutDetailsRequest {
  api_token: string;
}

export interface GetPayoutDetailsResponse {
  status: boolean;
  message: string;
  data: PayoutDetails;
}

/**
 * Get payout details for the authenticated professional
 * BaseURL: https://fireguide.attoexasolutions.com/api/payout_details/get
 * Method: POST
 * @param api_token - The API token for authentication
 * @returns Promise with the API response containing payout details
 */
export const getPayoutDetails = async (
  api_token: string
): Promise<PayoutDetails | null> => {
  try {
    const response = await apiClient.post<GetPayoutDetailsResponse>(
      '/payout_details/get',
      { api_token }
    );
    
    console.log('POST /payout_details/get - Response:', response.data);
    
    // Handle the response structure: { status: true, data: {...} }
    if (response.data.status === true && response.data.data) {
      console.log('Payout details fetched successfully');
      return response.data.data;
    }
    
    // Fallback: return null if no data
    console.warn('No payout details found in API response');
    return null;
  } catch (error) {
    console.error('Error fetching payout details:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch payout details',
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

// TypeScript types for Create/Update Payout Details
export interface CreatePayoutDetailsRequest {
  api_token: string;
  account_holder_name: string;
  sort_code: string;
  account_number: string;
  note?: string;
}

export interface CreatePayoutDetailsResponse {
  status: boolean;
  message: string;
  data: PayoutDetails;
}

/**
 * Create or update payout details for the authenticated professional
 * BaseURL: https://fireguide.attoexasolutions.com/api/payout_details/create
 * Method: POST
 * @param data - Payout details data
 * @returns Promise with the API response containing payout details
 */
export const createOrUpdatePayoutDetails = async (
  data: CreatePayoutDetailsRequest
): Promise<PayoutDetails> => {
  try {
    const response = await apiClient.post<CreatePayoutDetailsResponse>(
      '/payout_details/create',
      {
        api_token: data.api_token,
        account_holder_name: data.account_holder_name,
        sort_code: data.sort_code,
        account_number: data.account_number,
        note: data.note || '',
      }
    );
    
    console.log('POST /payout_details/create - Response:', response.data);
    
    // Handle the response structure: { status: true, data: {...} }
    if (response.data.status === true && response.data.data) {
      console.log('Payout details created/updated successfully');
      return response.data.data;
    }
    
    throw {
      success: false,
      message: response.data.message || 'Failed to create/update payout details',
      error: 'Invalid response structure',
    };
  } catch (error) {
    console.error('Error creating/updating payout details:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create/update payout details',
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

// TypeScript types for Professional Invoice
export interface ProfessionalInvoiceBooking {
  id: number;
  selected_date: string;
  selected_time: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  price: string;
  property_address: string;
  longitude: string;
  latitude: string;
  city: string;
  reason: string | null;
  post_code: string;
  ref_code: string | null;
  additional_notes: string | null;
  status: string;
  selected_service_id: number;
  professional_id: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalInvoiceItem {
  id: number;
  user_id: number;
  professional_id: number;
  booking_id: number;
  invoice_number: string;
  total_amount: string;
  created_at: string;
  user: {
    id: number;
    full_name: string;
  };
  professional: {
    id: number;
    name: string;
  };
  booking: ProfessionalInvoiceBooking;
}

export interface GetProfessionalInvoicesResponse {
  success: boolean;
  user_id: number;
  professional_id: number;
  total_invoices: number;
  data: ProfessionalInvoiceItem[];
}

/**
 * Get professional invoices for statement download
 * BaseURL: https://fireguide.attoexasolutions.com/api/invoice/professional_get
 * Method: POST
 * @param api_token - The API token for authentication
 * @returns Promise with the API response containing professional invoices
 */
export const getProfessionalInvoices = async (
  api_token: string
): Promise<GetProfessionalInvoicesResponse> => {
  try {
    console.log('POST /invoice/professional_get - Requesting...');
    
    const response = await apiClient.post<GetProfessionalInvoicesResponse>(
      '/invoice/professional_get',
      { api_token }
    );
    
    console.log('POST /invoice/professional_get - Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching professional invoices:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch invoices',
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