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

