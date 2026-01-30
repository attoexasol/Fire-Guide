import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://fireguide.attoexasolutions.com/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export interface AdminOverviewSummaryRequest {
  api_token: string;
}

export interface AdminOverviewSummaryData {
  total_revenue: number;
  active_bookings: number;
  total_customer: number;
  active_professionals: number;
  total_experiences: number;
}

export interface AdminOverviewSummaryResponse {
  success: boolean;
  message: string;
  data: AdminOverviewSummaryData;
}

/**
 * Fetch admin dashboard overview summary
 * POST https://fireguide.attoexasolutions.com/api/admin_overview/summary
 */
export const getAdminOverviewSummary = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminOverviewSummaryResponse> => {
  const response = await apiClient.post<AdminOverviewSummaryResponse>(
    '/admin_overview/summary',
    { api_token: data.api_token }
  );
  return response.data;
};

// Recent bookings for admin dashboard
export interface AdminRecentBookingItem {
  id: number;
  selected_date: string;
  selected_time: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  price: string;
  property_address: string;
  status: string;
  selected_service_id: number | null;
  created_at: string;
  updated_at: string;
  professional: { id: number; name: string };
  user: { id: number; full_name: string; image: string | null };
  creator?: { id: number; full_name: string; image: string | null } | null;
  updater?: { id: number; full_name: string; image: string | null } | null;
}

export interface AdminRecentBookingsResponse {
  success: boolean;
  message: string;
  data: AdminRecentBookingItem[];
}

/**
 * Fetch admin dashboard recent bookings
 * POST https://fireguide.attoexasolutions.com/api/admin_overview/recent_booking
 */
export const getAdminRecentBookings = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminRecentBookingsResponse> => {
  const response = await apiClient.post<AdminRecentBookingsResponse>(
    '/admin_overview/recent_booking',
    { api_token: data.api_token }
  );
  return response.data;
};

// Admin customer summary (Customer Management page)
export interface AdminCustomerSummaryData {
  total_customers: number;
  active_this_month: number;
  new_this_month: number;
  total_revenue: number;
}

export interface AdminCustomerSummaryResponse {
  success: boolean;
  message: string;
  data: AdminCustomerSummaryData;
}

/**
 * Fetch admin customer dashboard summary
 * POST https://fireguide.attoexasolutions.com/api/admin_customer/summary
 */
export const getAdminCustomerSummary = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminCustomerSummaryResponse> => {
  const response = await apiClient.post<AdminCustomerSummaryResponse>(
    '/admin_customer/summary',
    { api_token: data.api_token }
  );
  return response.data;
};

// Admin customer list (Customer Management table)
export interface AdminCustomerItem {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  image: string | null;
  soft_delete: string;
  created_at: string;
  updated_at: string;
  total_bookings: number;
  total_price: number;
  property_address: string;
}

export interface AdminCustomerListResponse {
  success: boolean;
  message: string;
  data: AdminCustomerItem[];
}

/**
 * Fetch admin customer list
 * POST https://fireguide.attoexasolutions.com/api/admin_customer/get
 */
export const getAdminCustomers = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminCustomerListResponse> => {
  const response = await apiClient.post<AdminCustomerListResponse>(
    '/admin_customer/get',
    { api_token: data.api_token }
  );
  return response.data;
};

/** Customer status for take_action: "active" | "inactive" | "suspend" */
export type AdminCustomerStatus = 'active' | 'inactive' | 'suspend';

export interface AdminCustomerTakeActionRequest {
  api_token: string;
  user_id: number;
  status: AdminCustomerStatus;
}

export interface AdminCustomerTakeActionResponse {
  success: boolean;
  message: string;
  data?: { user_id: number; new_status: string };
}

/**
 * Update customer status (active / inactive / suspend)
 * POST https://fireguide.attoexasolutions.com/api/admin_customer/take_action
 */
export const adminCustomerTakeAction = async (
  data: AdminCustomerTakeActionRequest
): Promise<AdminCustomerTakeActionResponse> => {
  const response = await apiClient.post<AdminCustomerTakeActionResponse>(
    '/admin_customer/take_action',
    {
      api_token: data.api_token,
      user_id: data.user_id,
      status: data.status,
    }
  );
  return response.data;
};

// Admin professional summary (Professional Management page)
// Response has nested data.data
export interface AdminProfessionalSummaryData {
  total_professional: number;
  approved_professional: number;
  pending_professional: number;
  suspend_professional: number;
}

export interface AdminProfessionalSummaryResponse {
  success: boolean;
  message: string;
  data: { data: AdminProfessionalSummaryData };
}

/**
 * Fetch admin professional dashboard summary
 * POST https://fireguide.attoexasolutions.com/api/admin_professional/summary
 */
export const getAdminProfessionalSummary = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminProfessionalSummaryResponse> => {
  const response = await apiClient.post<AdminProfessionalSummaryResponse>(
    '/admin_professional/summary',
    { api_token: data.api_token }
  );
  return response.data;
};

// Admin professionals list (Professional Management cards)
export interface AdminProfessionalListItem {
  id: number;
  name: string;
  business_name: string;
  about: string;
  email: string;
  number: string;
  business_location: string;
  status: string;
  post_code: string;
  response_time: string | null;
  rating: number | null;
  review: number | null;
  professional_image: string | null;
  services: string[];
  created_at: string;
  updated_at: string;
}

export interface AdminProfessionalListResponse {
  success: boolean;
  message: string;
  data: AdminProfessionalListItem[];
}

/**
 * Fetch admin professionals list
 * POST https://fireguide.attoexasolutions.com/api/admin_professional/get
 */
export const getAdminProfessionals = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminProfessionalListResponse> => {
  const response = await apiClient.post<AdminProfessionalListResponse>(
    '/admin_professional/get',
    { api_token: data.api_token }
  );
  return response.data;
};

/** Professional status for take_action: "approved" | "pending" | "rejected" */
export type AdminProfessionalStatus = 'approved' | 'pending' | 'rejected';

export interface AdminProfessionalTakeActionRequest {
  api_token: string;
  professional_id: number;
  status: AdminProfessionalStatus;
}

export interface AdminProfessionalTakeActionResponse {
  success: boolean;
  message: string;
  data?: { professional_id: number; new_status: string };
}

/**
 * Update professional status (approved / pending / rejected)
 * POST https://fireguide.attoexasolutions.com/api/admin_professional/take_action
 */
export const adminProfessionalTakeAction = async (
  data: AdminProfessionalTakeActionRequest
): Promise<AdminProfessionalTakeActionResponse> => {
  const response = await apiClient.post<AdminProfessionalTakeActionResponse>(
    '/admin_professional/take_action',
    {
      api_token: data.api_token,
      professional_id: data.professional_id,
      status: data.status,
    }
  );
  return response.data;
};

// Admin bookings list (Booking Management page)
export interface AdminBookingListItem {
  id: number;
  selected_date: string;
  selected_time: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  price: string;
  property_address: string;
  city: string;
  post_code: string;
  status: string;
  ref_code: string;
  professional_name: string;
  service_name: string | null;
  created_at: string;
}

export interface AdminBookingListResponse {
  success: boolean;
  message: string;
  data: AdminBookingListItem[];
}

/**
 * Fetch admin bookings list
 * POST https://fireguide.attoexasolutions.com/api/admin_bookings/get
 */
export const getAdminBookings = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminBookingListResponse> => {
  const response = await apiClient.post<AdminBookingListResponse>(
    '/admin_bookings/get',
    { api_token: data.api_token }
  );
  return response.data;
};
