/// <reference types="vite/client" />
import axios from 'axios';

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
