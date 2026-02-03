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

// Admin professional single (Professional Profile modal)
export interface AdminProfessionalCertificate {
  id: number;
  name: string;
  evidence: string;
  status: string;
}

export interface AdminProfessionalService {
  id: number;
  name: string;
  status: string;
}

export interface AdminProfessionalSingleData {
  id: number;
  name: string;
  business_name: string;
  about: string;
  email: string;
  number: string;
  business_location: string;
  longitude: number | null;
  latitude: number | null;
  status: string;
  post_code: string;
  response_time: string | null;
  rating: number | null;
  review: number | null;
  professional_image: string | null;
  services: AdminProfessionalService[];
  certificates: AdminProfessionalCertificate[];
  created_at: string;
  updated_at: string;
}

export interface AdminProfessionalSingleResponse {
  success: boolean;
  message: string;
  data: AdminProfessionalSingleData;
}

export interface AdminProfessionalSingleRequest {
  api_token: string;
  professional_id: number;
}

/**
 * Fetch single professional details (for profile modal)
 * POST https://fireguide.attoexasolutions.com/api/admin_professional/single-get
 */
export const getAdminProfessionalSingle = async (
  data: AdminProfessionalSingleRequest
): Promise<AdminProfessionalSingleResponse> => {
  const response = await apiClient.post<AdminProfessionalSingleResponse>(
    '/admin_professional/single-get',
    {
      api_token: data.api_token,
      professional_id: data.professional_id,
    }
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

/** Certificate status for change-certificate-status: "verified" | "rejected" | "pending" */
export type AdminCertificateStatus = 'verified' | 'rejected' | 'pending';

export interface AdminProfessionalChangeCertificateStatusRequest {
  api_token: string;
  professional_id: number;
  certificate_id: number;
  status: AdminCertificateStatus;
}

export interface AdminProfessionalChangeCertificateStatusResponse {
  success: boolean;
  message: string;
  data?: {
    professional_name: string;
    certificate: { id: number; name: string; status: string; created_at: string; updated_at: string };
  };
}

/**
 * Change certificate/evidence status (verified / rejected / pending)
 * POST https://fireguide.attoexasolutions.com/api/admin_professional/change-certificate-status
 */
export const adminProfessionalChangeCertificateStatus = async (
  data: AdminProfessionalChangeCertificateStatusRequest
): Promise<AdminProfessionalChangeCertificateStatusResponse> => {
  const response = await apiClient.post<AdminProfessionalChangeCertificateStatusResponse>(
    '/admin_professional/change-certificate-status',
    {
      api_token: data.api_token,
      professional_id: data.professional_id,
      certificate_id: data.certificate_id,
      status: data.status,
    }
  );
  return response.data;
};

/** Service status for change-service-status: "approved" | "rejected" */
export type AdminServiceStatus = 'approved' | 'rejected';

export interface AdminProfessionalChangeServiceStatusRequest {
  api_token: string;
  professional_id: number;
  selected_service_id: number;
  status: AdminServiceStatus;
}

export interface AdminProfessionalChangeServiceStatusResponse {
  success: boolean;
  message: string;
  data?: {
    professional_name: string;
    service: { selected_service_id: number; service_name: string; status: string; created_at: string; updated_at: string };
  };
}

/**
 * Change service status (approved / rejected)
 * POST https://fireguide.attoexasolutions.com/api/admin_professional/change-servicce-status
 * Note: Backend uses "servicce" (double c) in the path
 */
export const adminProfessionalChangeServiceStatus = async (
  data: AdminProfessionalChangeServiceStatusRequest
): Promise<AdminProfessionalChangeServiceStatusResponse> => {
  const response = await apiClient.post<AdminProfessionalChangeServiceStatusResponse>(
    '/admin_professional/change-servicce-status',
    {
      api_token: data.api_token,
      professional_id: data.professional_id,
      selected_service_id: data.selected_service_id,
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

// Admin bookings summary (Booking Management stat cards)
export interface AdminBookingsSummaryData {
  total_booking: number;
  pending_booking: number;
  confirmed_booking: number;
  completed_booking: number;
  cancel_booking: number;
}

export interface AdminBookingsSummaryResponse {
  success: boolean;
  message: string;
  data: { data: AdminBookingsSummaryData };
}

/**
 * Fetch admin bookings summary
 * POST https://fireguide.attoexasolutions.com/api/admin_bookings/summary
 */
export const getAdminBookingsSummary = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminBookingsSummaryResponse> => {
  const response = await apiClient.post<AdminBookingsSummaryResponse>(
    '/admin_bookings/summary',
    { api_token: data.api_token }
  );
  return response.data;
};

// Admin reviews summary (Review Management stat cards)
export interface AdminReviewsSummaryData {
  total_review: number;
  pending_review: number;
  approved_review: number;
  rejected_review: number;
}

export interface AdminReviewsSummaryResponse {
  success: boolean;
  data: AdminReviewsSummaryData;
}

/**
 * Fetch admin reviews summary
 * POST https://fireguide.attoexasolutions.com/api/admin-reviews/summary
 */
export const getAdminReviewsSummary = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminReviewsSummaryResponse> => {
  const response = await apiClient.post<AdminReviewsSummaryResponse>(
    '/admin-reviews/summary',
    { api_token: data.api_token }
  );
  return response.data;
};

// Admin reviews list (Review Management - individual review cards)
export interface AdminReviewListItem {
  id: number;
  reviewer_name: string;
  reviewer_email: string;
  rating: string;
  feedback: string;
  status: string;
  professional_name: string;
  professional_email: string;
  services: string[];
  created_at: string;
}

export interface AdminReviewsListResponse {
  success: boolean;
  data: AdminReviewListItem[];
}

/**
 * Fetch admin reviews list
 * POST https://fireguide.attoexasolutions.com/api/admin-reviews/list
 */
export const getAdminReviewsList = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminReviewsListResponse> => {
  const response = await apiClient.post<AdminReviewsListResponse>(
    '/admin-reviews/list',
    { api_token: data.api_token }
  );
  return response.data;
};

// Admin notification details (Notifications page - cards + list)
export interface AdminNotificationCards {
  total_notifications: number;
  unread: number;
  critical: number;
  system_alerts: number;
}

export interface AdminNotificationItem {
  id: number;
  title: string;
  priority: string;
  message: string;
  category: string;
  is_read: number;
  date: string;
  actions: { can_mark_read: boolean; can_delete: boolean };
}

export interface AdminNotificationDetailsData {
  cards: AdminNotificationCards;
  notifications: AdminNotificationItem[];
}

export interface AdminNotificationDetailsResponse {
  status: boolean;
  data: AdminNotificationDetailsData;
}

/**
 * Fetch admin notification details (summary cards + notification list)
 * POST https://fireguide.attoexasolutions.com/api/admin_notification/details
 */
export const getAdminNotificationDetails = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminNotificationDetailsResponse> => {
  const response = await apiClient.post<AdminNotificationDetailsResponse>(
    '/admin_notification/details',
    { api_token: data.api_token }
  );
  return response.data;
};

// Admin payment summary (Payment Management stat cards)
export interface AdminPaymentSummaryData {
  total_revenue: number;
  platform_commission: string;
  commission_rate: string;
  pending_payouts: number;
  total_transactions: number;
}

export interface AdminPaymentSummaryResponse {
  success: boolean;
  data: AdminPaymentSummaryData;
}

/**
 * Fetch admin payment summary
 * POST https://fireguide.attoexasolutions.com/api/admin-payment/summary
 */
export const getAdminPaymentSummary = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminPaymentSummaryResponse> => {
  const response = await apiClient.post<AdminPaymentSummaryResponse>(
    '/admin-payment/summary',
    { api_token: data.api_token }
  );
  return response.data;
};

// Admin payment list (Payment Management table)
export interface AdminPaymentListItem {
  reference: string;
  date: string;
  Parties: string;
  services: { id: number; name: string }[];
  amount: string;
  commission: { rate: string; amount: string };
  professional_earning: string;
  payment_status: string;
  booking_status: string;
}

export interface AdminPaymentListResponse {
  success: boolean;
  data: AdminPaymentListItem[];
}

/**
 * Fetch admin payment list
 * POST https://fireguide.attoexasolutions.com/api/admin-payment/list
 */
export const getAdminPaymentList = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminPaymentListResponse> => {
  const response = await apiClient.post<AdminPaymentListResponse>(
    '/admin-payment/list',
    { api_token: data.api_token }
  );
  return response.data;
};

// Platform commission (Commission Settings modal)
export interface PlatformCommissionCreateRequest {
  api_token: string;
  commission_rate: number;
}

export interface PlatformCommissionCreateResponse {
  success: boolean;
  message: string;
  data?: { id: number; commission_rate: string; created_at: string; updated_at: string };
}

/**
 * Create/update platform commission rate
 * POST https://fireguide.attoexasolutions.com/api/platform-commission/create
 */
export const createPlatformCommission = async (
  data: PlatformCommissionCreateRequest
): Promise<PlatformCommissionCreateResponse> => {
  const response = await apiClient.post<PlatformCommissionCreateResponse>(
    '/platform-commission/create',
    { api_token: data.api_token, commission_rate: data.commission_rate }
  );
  return response.data;
};

// Admin SEO settings
export interface AdminSeoSettingsData {
  meta_title: string;
  meta_description: string;
  keywords: string;
  updated_at?: string;
  last_updated_at?: string;
}

export interface AdminSeoSettingsSaveRequest {
  api_token: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
}

export interface AdminSeoSettingsResponse {
  status: boolean;
  message: string;
  data: AdminSeoSettingsData;
}

/**
 * Save admin SEO settings
 * POST https://fireguide.attoexasolutions.com/api/admin/seo/setting
 * Body: { api_token, meta_title, meta_description, keywords }
 */
export const saveAdminSeoSettings = async (
  data: AdminSeoSettingsSaveRequest
): Promise<AdminSeoSettingsResponse> => {
  const body = {
    api_token: data.api_token,
    meta_title: String(data.meta_title ?? "").trim(),
    meta_description: String(data.meta_description ?? "").trim(),
    keywords: String(data.keywords ?? "").trim()
  };
  const response = await apiClient.post<AdminSeoSettingsResponse>(
    '/admin/seo/setting',
    body
  );
  return response.data;
};

/**
 * Fetch admin SEO settings
 * POST https://fireguide.attoexasolutions.com/api/admin/get-seo-setting
 * Body: { api_token }
 */
export const getAdminSeoSettings = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminSeoSettingsResponse> => {
  const response = await apiClient.post<AdminSeoSettingsResponse>(
    '/admin/get-seo-setting',
    { api_token: data.api_token }
  );
  return response.data;
};

// Admin notification settings (Platform Settings - Notification Settings card)
export interface AdminNotificationSettingsData {
  admin_alert_email: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  updated_at?: string;
}

export interface AdminNotificationSettingsSaveRequest {
  api_token: string;
  admin_alert_email: string;
  email_notifications: boolean;
  sms_notifications: boolean;
}

export interface AdminNotificationSettingsResponse {
  status: boolean;
  message?: string;
  data: AdminNotificationSettingsData;
}

/**
 * Save admin notification settings
 * POST https://fireguide.attoexasolutions.com/api/admin/notification/setting
 */
export const saveAdminNotificationSettings = async (
  data: AdminNotificationSettingsSaveRequest
): Promise<AdminNotificationSettingsResponse> => {
  const response = await apiClient.post<AdminNotificationSettingsResponse>(
    '/admin/notification/setting',
    {
      api_token: data.api_token,
      admin_alert_email: data.admin_alert_email,
      email_notifications: data.email_notifications,
      sms_notifications: data.sms_notifications
    }
  );
  return response.data;
};

/**
 * Fetch admin notification settings
 * POST https://fireguide.attoexasolutions.com/api/admin/notification/setting/get
 */
export const getAdminNotificationSettings = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminNotificationSettingsResponse> => {
  const response = await apiClient.post<AdminNotificationSettingsResponse>(
    '/admin/notification/setting/get',
    { api_token: data.api_token }
  );
  return response.data;
};

// Admin system settings (Platform Settings - System Settings card)
export interface AdminSystemSettingsData {
  maintenance_mode: boolean;
  auto_approve_professionals: boolean;
  booking_buffer_time: number;
  cancellation_window: number;
  updated_at?: string;
}

export interface AdminSystemSettingsSaveRequest {
  api_token: string;
  maintenance_mode: boolean;
  auto_approve_professionals: boolean;
  booking_buffer_time: number;
  cancellation_window: number;
}

export interface AdminSystemSettingsResponse {
  status: boolean;
  message?: string;
  data: AdminSystemSettingsData;
}

/**
 * Save admin system settings
 * POST https://fireguide.attoexasolutions.com/api/admin/system/settings
 */
export const saveAdminSystemSettings = async (
  data: AdminSystemSettingsSaveRequest
): Promise<AdminSystemSettingsResponse> => {
  const response = await apiClient.post<AdminSystemSettingsResponse>(
    '/admin/system/settings',
    {
      api_token: data.api_token,
      maintenance_mode: data.maintenance_mode,
      auto_approve_professionals: data.auto_approve_professionals,
      booking_buffer_time: Number(data.booking_buffer_time) || 0,
      cancellation_window: Number(data.cancellation_window) || 0
    }
  );
  return response.data;
};

/**
 * Fetch admin system settings
 * POST https://fireguide.attoexasolutions.com/api/admin/system/control-settings/get
 */
export const getAdminSystemSettings = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminSystemSettingsResponse> => {
  const response = await apiClient.post<AdminSystemSettingsResponse>(
    '/admin/system/control-settings/get',
    { api_token: data.api_token }
  );
  return response.data;
};

// Admin security settings (Platform Settings - Security Settings card)
export interface AdminSecuritySettingsData {
  session_timeout: number;
  max_login_attempts: number;
  updated_at?: string;
}

export interface AdminSecuritySettingsSaveRequest {
  api_token: string;
  session_timeout: number;
  max_login_attempts: number;
}

export interface AdminSecuritySettingsResponse {
  status: boolean;
  message?: string;
  data: AdminSecuritySettingsData;
}

/**
 * Save admin security settings
 * POST https://fireguide.attoexasolutions.com/api/admin/system/security-settings
 */
export const saveAdminSecuritySettings = async (
  data: AdminSecuritySettingsSaveRequest
): Promise<AdminSecuritySettingsResponse> => {
  const response = await apiClient.post<AdminSecuritySettingsResponse>(
    '/admin/system/security-settings',
    {
      api_token: data.api_token,
      session_timeout: Number(data.session_timeout) || 30,
      max_login_attempts: Number(data.max_login_attempts) || 5
    }
  );
  return response.data;
};

/**
 * Fetch admin security settings
 * POST https://fireguide.attoexasolutions.com/api/admin/system/security-settings/get
 */
export const getAdminSecuritySettings = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminSecuritySettingsResponse> => {
  const response = await apiClient.post<AdminSecuritySettingsResponse>(
    '/admin/system/security-settings/get',
    { api_token: data.api_token }
  );
  return response.data;
};

// Admin payment settings (Platform Settings - Payment Settings card)
export interface AdminPaymentSettingsData {
  stripe_public_key?: string;
  stripe_secret_key?: string;
  default_currency?: string;
  updated_at?: string;
}

export interface AdminPaymentSettingsSaveRequest {
  api_token: string;
  stripe_public_key: string;
  stripe_secret_key: string;
  default_currency: string;
}

export interface AdminPaymentSettingsResponse {
  status: boolean;
  message?: string;
  data: AdminPaymentSettingsData;
}

/**
 * Save admin payment settings
 * POST https://fireguide.attoexasolutions.com/api/admin/payment-settings/save
 */
export const saveAdminPaymentSettings = async (
  data: AdminPaymentSettingsSaveRequest
): Promise<AdminPaymentSettingsResponse> => {
  const response = await apiClient.post<AdminPaymentSettingsResponse>(
    '/admin/payment-settings/save',
    {
      api_token: data.api_token,
      stripe_public_key: data.stripe_public_key,
      stripe_secret_key: data.stripe_secret_key,
      default_currency: (data.default_currency || "GBP").toUpperCase()
    }
  );
  return response.data;
};

/**
 * Fetch admin payment settings
 * POST https://fireguide.attoexasolutions.com/api/admin/payment-settings/get
 */
export const getAdminPaymentSettings = async (
  data: AdminOverviewSummaryRequest
): Promise<AdminPaymentSettingsResponse> => {
  const response = await apiClient.post<AdminPaymentSettingsResponse>(
    '/admin/payment-settings/get',
    { api_token: data.api_token }
  );
  return response.data;
};
