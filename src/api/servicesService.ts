/// <reference types="vite/client" />
import axios from 'axios';
import { handleTokenExpired, isTokenExpiredError } from '../lib/auth';

// TypeScript types for API response
export interface ServiceResponse {
  id: number;
  service_name: string;
  type?: string;
  status: string;
  price: string;
  icon: string | null;
  description: string;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ServicesPaginatedResponse {
  current_page: number;
  data: ServiceResponse[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ServicesApiResponse {
  status: string;
  message: string;
  data: ServiceResponse[] | ServicesPaginatedResponse;
}

// TypeScript types for Property Type API response
export interface PropertyTypeResponse {
  id: number;
  property_type_name: string;
  property_type_description: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyTypesPaginatedResponse {
  current_page: number;
  data: PropertyTypeResponse[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PropertyTypesApiResponse {
  status: string;
  message: string;
  data: PropertyTypeResponse[] | PropertyTypesPaginatedResponse;
}

// TypeScript types for Approximate People API response
export interface ApproximatePeopleResponse {
  id: number;
  number_of_people: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  creator?: number | null;
  updater?: number | null;
}

export interface ApproximatePeopleApiResponse {
  status: string;
  message: string;
  data: ApproximatePeopleResponse[];
}

/** Format people option for display: serial ranges like "1–10 People", "11–25 People" (en-dash, " People") */
export function formatPeopleOptionLabel(text: string): string {
  const t = (text ?? "").replace(/\r\n/g, "").trim();
  const rangeMatch = t.match(/^(\d+)\s*[-–]\s*(\d+)\s*(people)?$/i);
  if (rangeMatch) return `${rangeMatch[1]}–${rangeMatch[2]} People`;
  if (/100\+/i.test(t) && !/people/i.test(t)) return "100+ Custom quote";
  if (/more than 500|500\+/i.test(t)) return "More than 500 people";
  return t || text;
}

/** Sort key for people options: 1→1, 11→11, 26→26, 51→51, 100+→100, 500+→500 so order is serial */
export function getPeopleOptionSortKey(text: string): number {
  const t = (text ?? "").trim();
  if (/more than 500|500\+/i.test(t)) return 500;
  if (/100\+/i.test(t)) return 100;
  const rangeMatch = t.match(/^(\d+)\s*[-–]\s*\d+/);
  if (rangeMatch) return parseInt(rangeMatch[1], 10);
  const firstNum = t.match(/\d+/);
  return firstNum ? parseInt(firstNum[0], 10) : 999;
}

export interface FloorPricingItem {
  id?: number;
  floor: string;
  price: string | null;
  label: string;
  custom_quote?: boolean;
}

export interface FloorPricingApiResponse {
  status: boolean;
  data: FloorPricingItem[];
}

/** Fire Alarm get-alarm API: option item for dropdowns (detectors, call_points, floors, alarm_panels, system_type, etc.) */
export interface FireAlarmOptionItem {
  id: number;
  type: string;
  value: string;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface FireAlarmGetAlarmResponse {
  status: boolean;
  message: string;
  data: FireAlarmOptionItem[];
}

/** GET /fra-durations — urgency/duration options for FRA (e.g. "7+ days", "Same / next day") */
export interface FraDurationItem {
  id: number;
  duration: string;
  created_at?: string;
  updated_at?: string;
}

export interface FraDurationsApiResponse {
  status: boolean;
  message: string;
  data: FraDurationItem[];
}

// FRA Price store-update (POST /fra-price/store-update)
export interface FraPriceStoreUpdateRequest {
  professional_id: number;
  property_type_id: number;
  floor_id: number;
  people_id: number;
  duration_id: number;
  property_type_price: number;
  people_price: number;
  floor_price: number;
  duration_price: number;
}

export interface FraPriceStoreUpdateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    property_type_id: number;
    people_id: number;
    floor_id: number;
    duration_id: number;
    property_type_price: number;
    people_price: number;
    floor_price: number;
    duration_price: number;
    total_price: number;
    created_at: string;
    updated_at: string;
  };
}

// POST /fra-price/professional — body: api_token, property_type_id, floor_id, people_id, duration_id
export interface FraPriceProfessionalRequest {
  api_token: string;
  property_type_id?: number;
  floor_id?: number;
  people_id?: number;
  duration_id?: number;
}

export interface FraPriceProfessionalDataItem {
  property_type: {
    id: number;
    property_type_name: string;
    property_type_price: string;
  };
  people: Array<{ id: number; number_of_people: string; people_price: string }>;
  floors: Array<{ id: number; floor: string; floor_price: string }>;
  durations: Array<{ id: number; duration: string; duration_price: string }>;
}

export interface FraPriceProfessionalResponse {
  status: boolean;
  professional?: { id: number; Professional_name: string };
  data: FraPriceProfessionalDataItem[];
}

/**
 * POST /fra-price/professional. Sends api_token in body and Authorization header; optional body params: property_type_id, floor_id, people_id, duration_id.
 * Response includes property_type, people[], floors[], and durations[] (with duration_price) for matching item.
 */
export const getFraPriceProfessional = async (
  data: FraPriceProfessionalRequest
): Promise<FraPriceProfessionalResponse> => {
  const body: Record<string, string | number> = { api_token: data.api_token };
  if (data.property_type_id != null) body.property_type_id = data.property_type_id;
  if (data.floor_id != null) body.floor_id = data.floor_id;
  if (data.people_id != null) body.people_id = data.people_id;
  if (data.duration_id != null) body.duration_id = data.duration_id;
  const response = await apiClient.post<FraPriceProfessionalResponse>('/fra-price/professional', body, {
    headers: {
      Authorization: `Bearer ${data.api_token}`,
    },
  });
  return response.data;
};

/**
 * Store or update FRA price for the logged-in professional
 */
export const storeUpdateFraPrice = async (
  data: FraPriceStoreUpdateRequest
): Promise<FraPriceStoreUpdateResponse> => {
  const response = await apiClient.post<FraPriceStoreUpdateResponse>('/fra-price/store-update', data);
  return response.data;
};

/** POST /professional/fra-property-type — save base price for a property type (api_token from login, property_type_id from selection, price from input) */
export interface FraPropertyTypePriceRequest {
  api_token: string;
  property_type_id: number;
  price: number;
}

export interface FraPropertyTypePriceResponse {
  status?: boolean;
  message?: string;
  data?: unknown;
}

export const saveFraPropertyTypePrice = async (
  data: FraPropertyTypePriceRequest
): Promise<FraPropertyTypePriceResponse> => {
  const response = await apiClient.post<FraPropertyTypePriceResponse>('/professional/fra-property-type', data);
  return response.data;
};

/** POST /professional/fra-people — save people price (api_token from login, people_id from selection, price from input) */
export interface FraPeoplePriceRequest {
  api_token: string;
  people_id: number;
  price: number;
}

export interface FraPeoplePriceResponse {
  status?: boolean;
  message?: string;
  data?: {
    id?: number;
    professional_id?: number;
    people_id?: number;
    price?: number;
    created_at?: string;
    updated_at?: string;
  };
}

export const saveFraPeoplePrice = async (
  data: FraPeoplePriceRequest
): Promise<FraPeoplePriceResponse> => {
  const response = await apiClient.post<FraPeoplePriceResponse>('/professional/fra-people', data);
  return response.data;
};

/** POST /professional-fra-floor — save floor price (api_token from login, floor_id from selection, price from input) */
export interface FraFloorPriceRequest {
  api_token: string;
  floor_id: number;
  price: number;
}

export interface FraFloorPriceResponse {
  status?: boolean;
  message?: string;
  data?: {
    id?: number;
    professional_id?: number;
    floor_id?: number;
    price?: number;
    created_at?: string;
    updated_at?: string;
  };
}

export const saveFraFloorPrice = async (
  data: FraFloorPriceRequest
): Promise<FraFloorPriceResponse> => {
  const response = await apiClient.post<FraFloorPriceResponse>('/professional-fra-floor', data);
  return response.data;
};

/** POST /professional-fra-duration — save duration/urgency price (api_token from login, duration_id from selection, price from input) */
export interface FraDurationPriceRequest {
  api_token: string;
  duration_id: number;
  price: number;
}

export interface FraDurationPriceResponse {
  status?: boolean;
  message?: string;
  data?: {
    id?: number;
    professional_id?: number;
    duration_id?: number;
    price?: number;
    created_at?: string;
    updated_at?: string;
  };
}

export const saveFraDurationPrice = async (
  data: FraDurationPriceRequest
): Promise<FraDurationPriceResponse> => {
  const response = await apiClient.post<FraDurationPriceResponse>('/professional-fra-duration', data);
  return response.data;
};

// Create axios instance with base configuration
// Uses VITE_API_BASE_URL from .env file, with fallback to default URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://fireguide.attoexasolutions.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// On 401 (expired/invalid token), log out and redirect to home so user must log in again.
// Do NOT redirect for public booking endpoints (e.g. selected_services/store) so Location → Compare flow works without login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error?.config?.url || '';
    const isAuthEndpoint = requestUrl.includes('/login') || requestUrl.includes('/register') || requestUrl.includes('/send_otp') || requestUrl.includes('/verify_otp') || requestUrl.includes('/reset_password');
    const isPublicBookingEndpoint =
      requestUrl.includes('selected_services/store') || requestUrl.includes('fire-alarm/selected-servie/create') || requestUrl.includes('fire-extingusher/selected-servie/create') || requestUrl.includes('fire-emergency-light/selected-servie/create') || requestUrl.includes('fire-marshal/selected-servie/create') || requestUrl.includes('fire-marshal/get-marshal') || requestUrl.includes('fire-consultation/selected-servie/create') || requestUrl.includes('fire-consultation/get-consultation') || requestUrl.includes('emergency-lighting-testing/get-emergency-light');
    if (!isAuthEndpoint && !isPublicBookingEndpoint && isTokenExpiredError(error)) {
      handleTokenExpired();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

/**
 * Fire Alarm: fetch options for dropdowns (detectors, call_points, floors, alarm_panels, system_type, last_service).
 * POST /fire-alarm/get-alarm  Body: { api_token?, type }
 * Response: { status: true, message: string, data: [{ id, type, value, ... }] } — "value" is shown in dropdowns.
 * api_token optional for guest/public booking flow.
 */
export const fetchFireAlarmOptions = async (
  apiToken: string | null,
  type: string
): Promise<FireAlarmOptionItem[]> => {
  try {
    const response = await apiClient.post<FireAlarmGetAlarmResponse>('/fire-alarm/get-alarm', {
      ...(apiToken != null && apiToken !== '' && { api_token: apiToken }),
      type,
    });
    const raw = response.data as FireAlarmGetAlarmResponse | { data?: unknown };
    const list = Array.isArray(raw?.data) ? raw.data : [];
    return list.map((item) => ({
      ...item,
      id: Number(item.id),
      value: String(item.value ?? ''),
    })) as FireAlarmOptionItem[];
  } catch (_err) {
    return [];
  }
};

/**
 * Fire Extinguisher Service: fetch options for dropdowns.
 * POST /fire-extinguisher-service/get-extinguisher-service  Body: { api_token, type }
 * type: "extinguisher" | "floor" | "metarials" | "last_service"
 * Response: { status, message, data: [{ id, type, value, ... }] }
 */
export interface ExtinguisherServiceOptionItem {
  id: number;
  value: string;
  type?: string;
}

export const fetchExtinguisherServiceOptions = async (
  apiToken: string,
  type: string
): Promise<ExtinguisherServiceOptionItem[]> => {
  try {
    const response = await apiClient.post<{ status?: boolean; data?: Array<{ id: number; value?: string; type?: string }> }>(
      '/fire-extinguisher-service/get-extinguisher-service',
      { api_token: apiToken, type }
    );
    const raw = response.data;
    const list = Array.isArray(raw?.data) ? raw.data : [];
    // Only include items whose type matches the requested type (so e.g. floor dropdown shows only floor values from response)
    const filtered = list.filter((item) => (item.type ?? '').toLowerCase() === (type ?? '').toLowerCase());
    return filtered.map((item) => ({
      id: Number(item.id),
      value: String(item.value ?? '').trim() || String(item.id),
      type: item.type,
    }));
  } catch (_err) {
    return [];
  }
};

/**
 * Emergency Light Service: fetch options for dropdowns.
 * POST /emergency-lighting-testing/get-emergency-light  Body: { type }
 * type: "light" | "floor" | "light_type" | "light_test"
 * Response: { status, message, data: [{ id, type, value, ... }] }
 */
export interface EmergencyLightServiceOptionItem {
  id: number;
  value: string;
}

export const fetchEmergencyLightOptions = async (
  type: string
): Promise<EmergencyLightServiceOptionItem[]> => {
  try {
    const response = await apiClient.post<{ status?: boolean; data?: Array<{ id: number; value?: string; type?: string }> }>(
      '/emergency-lighting-testing/get-emergency-light',
      { type }
    );
    const raw = response.data;
    const list = Array.isArray(raw?.data) ? raw.data : [];
    return list.map((item) => ({
      id: Number(item.id),
      value: String(item.value ?? '').trim() || String(item.id),
    }));
  } catch (_err) {
    return [];
  }
};

/**
 * Fire Marshal (Training): fetch options for dropdowns.
 * POST /fire-marshal/get-marshal  Body: { type }
 * type: "people" | "training_place" | "building_type" | "experience"
 * Response: { status, message, data: [{ id, type, value, ... }] }
 * Dropdowns display the value from each item in data.
 */
export interface MarshalServiceOptionItem {
  id: number;
  value: string;
}

export const fetchMarshalOptions = async (
  _apiToken: string,
  type: string
): Promise<MarshalServiceOptionItem[]> => {
  try {
    const response = await apiClient.post<{ status?: boolean; data?: Array<{ id: number; value?: string; type?: string }> }>(
      '/fire-marshal/get-marshal',
      { type }
    );
    const raw = response.data;
    const list = Array.isArray(raw?.data) ? raw.data : [];
    return list.map((item) => ({
      id: Number(item.id),
      value: String(item.value ?? '').trim() || String(item.id),
    }));
  } catch (_err) {
    return [];
  }
};

/**
 * Fire Consultation: fetch options for dropdowns.
 * POST /fire-consultation/get-consultation  Body: { api_token, type }
 * type: "hour" | "mode"
 * Response: { status, message, data: [{ id, type, value, ... }] }
 */
export interface ConsultationOptionItem {
  id: number;
  value: string;
}

export const fetchFireConsultationOptions = async (
  apiToken: string,
  type: string
): Promise<ConsultationOptionItem[]> => {
  try {
    const response = await apiClient.post<{ status?: boolean; data?: Array<{ id: number; value?: string; type?: string }> }>(
      '/fire-consultation/get-consultation',
      { api_token: apiToken, type }
    );
    const raw = response.data;
    const list = Array.isArray(raw?.data) ? raw.data : [];
    return list.map((item) => ({
      id: Number(item.id),
      value: String(item.value ?? '').trim() || String(item.id),
    }));
  } catch (_err) {
    return [];
  }
};

/** Response for POST /professional-consultation/base-price-create */
export interface ProfessionalConsultationBasePriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Consultation base price.
 * POST /professional-consultation/base-price-create  Body: { api_token, price }
 */
export const saveProfessionalConsultationBasePrice = async (
  apiToken: string,
  price: number
): Promise<ProfessionalConsultationBasePriceResponse> => {
  const response = await apiClient.post<ProfessionalConsultationBasePriceResponse>(
    '/professional-consultation/base-price-create',
    { api_token: apiToken, price }
  );
  return response.data;
};

/** Response for POST /professional-consultation/base-price-get */
export interface ProfessionalConsultationBasePriceGetResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    price: number | string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Get professional Consultation base price.
 * POST /professional-consultation/base-price-get  Body: { api_token }
 */
export const getProfessionalConsultationBasePrice = async (
  apiToken: string
): Promise<ProfessionalConsultationBasePriceGetResponse> => {
  const response = await apiClient.post<ProfessionalConsultationBasePriceGetResponse>(
    '/professional-consultation/base-price-get',
    { api_token: apiToken }
  );
  return response.data;
};

/** Response for POST /professional-consultation/mode-price-create */
export interface ProfessionalConsultationModePriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    mode_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Consultation Model price.
 * POST /professional-consultation/mode-price-create  Body: { api_token, mode_id, type: "mode", price }
 */
export const saveProfessionalConsultationModePrice = async (
  apiToken: string,
  modeId: number,
  price: number
): Promise<ProfessionalConsultationModePriceResponse> => {
  const response = await apiClient.post<ProfessionalConsultationModePriceResponse>(
    '/professional-consultation/mode-price-create',
    { api_token: apiToken, mode_id: modeId, type: 'mode', price }
  );
  return response.data;
};

/** Response for POST /professional-consultation/hour-price-create */
export interface ProfessionalConsultationHourPriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    hour_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Consultation Hour price.
 * POST /professional-consultation/hour-price-create  Body: { api_token, hour_id, type: "hour", price }
 */
export const saveProfessionalConsultationHourPrice = async (
  apiToken: string,
  hourId: number,
  price: number
): Promise<ProfessionalConsultationHourPriceResponse> => {
  const response = await apiClient.post<ProfessionalConsultationHourPriceResponse>(
    '/professional-consultation/hour-price-create',
    { api_token: apiToken, hour_id: hourId, type: 'hour', price }
  );
  return response.data;
};

/** Response for POST /professional-consultation/get-single/prices */
export interface ProfessionalConsultationSinglePricesResponse {
  status: boolean;
  message: string;
  data?: {
    professional?: { id: number; name: string };
    mode?: { id: number; people?: number | null; price?: string | number };
    place?: { id: number; place?: string; price?: string | number };
    total_price?: number;
  };
}

/**
 * Get professional Consultation single prices for selected mode and hour.
 * POST /professional-consultation/get-single/prices  Body: { api_token, mode_id, hour_id }
 */
export const getProfessionalConsultationSinglePrices = async (
  apiToken: string,
  modeId: number,
  hourId: number
): Promise<ProfessionalConsultationSinglePricesResponse> => {
  const response = await apiClient.post<ProfessionalConsultationSinglePricesResponse>(
    '/professional-consultation/get-single/prices',
    { api_token: apiToken, mode_id: modeId, hour_id: hourId }
  );
  return response.data;
};

/** Response for POST /professional-extinguisher/base-price-create */
export interface ProfessionalExtinguisherBasePriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/** Response for POST /professional-extinguisher/base-price-get */
export interface ProfessionalExtinguisherBasePriceGetResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    price: number | string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Get professional Extinguisher base price.
 * POST /professional-extinguisher/base-price-get  Body: { api_token }
 */
export const getProfessionalExtinguisherBasePrice = async (
  apiToken: string
): Promise<ProfessionalExtinguisherBasePriceGetResponse> => {
  const response = await apiClient.post<ProfessionalExtinguisherBasePriceGetResponse>(
    '/professional-extinguisher/base-price-get',
    { api_token: apiToken }
  );
  return response.data;
};

/**
 * Create/update professional Extinguisher base price.
 * POST /professional-extinguisher/base-price-create  Body: { api_token, price }
 */
export const saveProfessionalExtinguisherBasePrice = async (
  apiToken: string,
  price: number
): Promise<ProfessionalExtinguisherBasePriceResponse> => {
  const response = await apiClient.post<ProfessionalExtinguisherBasePriceResponse>(
    '/professional-extinguisher/base-price-create',
    { api_token: apiToken, price }
  );
  return response.data;
};

/** Response for POST /professional-marshal/base-price-create */
export interface ProfessionalMarshalBasePriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Marshal (Training) base price.
 * POST /professional-marshal/base-price-create  Body: { api_token, price }
 */
export const saveProfessionalMarshalBasePrice = async (
  apiToken: string,
  price: number
): Promise<ProfessionalMarshalBasePriceResponse> => {
  const response = await apiClient.post<ProfessionalMarshalBasePriceResponse>(
    '/professional-marshal/base-price-create',
    { api_token: apiToken, price }
  );
  return response.data;
};

/** Response for POST /professional-marshal/base-price-get */
export interface ProfessionalMarshalBasePriceGetResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    price: number | string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Get professional Marshal (Training) base price.
 * POST /professional-marshal/base-price-get  Body: { api_token }
 */
export const getProfessionalMarshalBasePrice = async (
  apiToken: string
): Promise<ProfessionalMarshalBasePriceGetResponse> => {
  const response = await apiClient.post<ProfessionalMarshalBasePriceGetResponse>(
    '/professional-marshal/base-price-get',
    { api_token: apiToken }
  );
  return response.data;
};

/** Response for POST /professional-marshal/people-price-create */
export interface ProfessionalMarshalPeoplePriceCreateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    people_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Marshal people price.
 * POST /professional-marshal/people-price-create  Body: { api_token, people_id, type: "people", price }
 */
export const saveProfessionalMarshalPeoplePrice = async (
  apiToken: string,
  people_id: number,
  price: number
): Promise<ProfessionalMarshalPeoplePriceCreateResponse> => {
  const response = await apiClient.post<ProfessionalMarshalPeoplePriceCreateResponse>(
    '/professional-marshal/people-price-create',
    { api_token: apiToken, people_id, type: 'people', price }
  );
  return response.data;
};

/** Response for POST /professional-marshal/place-price-create */
export interface ProfessionalMarshalPlacePriceCreateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    place_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Marshal place price.
 * POST /professional-marshal/place-price-create  Body: { api_token, place_id, type: "training_place", price }
 */
export const saveProfessionalMarshalPlacePrice = async (
  apiToken: string,
  place_id: number,
  price: number
): Promise<ProfessionalMarshalPlacePriceCreateResponse> => {
  const response = await apiClient.post<ProfessionalMarshalPlacePriceCreateResponse>(
    '/professional-marshal/place-price-create',
    { api_token: apiToken, place_id, type: 'training_place', price }
  );
  return response.data;
};

/** Response for POST /professional-marshal/training-on-price-create */
export interface ProfessionalMarshalTrainingOnPriceCreateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    training_on_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Marshal Training On price (building_type).
 * POST /professional-marshal/training-on-price-create  Body: { api_token, training_on_id, type: "building_type", price }
 */
export const saveProfessionalMarshalTrainingOnPrice = async (
  apiToken: string,
  training_on_id: number,
  price: number
): Promise<ProfessionalMarshalTrainingOnPriceCreateResponse> => {
  const response = await apiClient.post<ProfessionalMarshalTrainingOnPriceCreateResponse>(
    '/professional-marshal/training-on-price-create',
    { api_token: apiToken, training_on_id, type: 'building_type', price }
  );
  return response.data;
};

/** Response for POST /professional-marshal/experience-price-create */
export interface ProfessionalMarshalExperiencePriceCreateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    experience_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Marshal experience price.
 * POST /professional-marshal/experience-price-create  Body: { api_token, experience_id, type: "experience", price }
 */
export const saveProfessionalMarshalExperiencePrice = async (
  apiToken: string,
  experience_id: number,
  price: number
): Promise<ProfessionalMarshalExperiencePriceCreateResponse> => {
  const response = await apiClient.post<ProfessionalMarshalExperiencePriceCreateResponse>(
    '/professional-marshal/experience-price-create',
    { api_token: apiToken, experience_id, type: 'experience', price }
  );
  return response.data;
};

/** Request body for POST /professional-marshal/get-single/prices */
export interface GetProfessionalMarshalSinglePricesRequest {
  people_id: number;
  place_id: number;
  training_on_id: number;
  experience_id: number;
}

/** Response for POST /professional-marshal/get-single/prices */
export interface GetProfessionalMarshalSinglePricesResponse {
  status?: boolean;
  message?: string;
  data?: {
    professional?: { id: number; name: string };
    people?: { id: number; people?: string; price?: string };
    place?: { id: number; place?: string; price?: string };
    training_on?: { id: number; training_on?: string; price?: string };
    experience?: { id: number; experience?: string; price?: string };
    total_price?: string;
  };
}

/**
 * Get prices for selected Training (Marshal) options.
 * POST /professional-marshal/get-single/prices
 * Body: { api_token, people_id, place_id, training_on_id, experience_id }
 */
export const getProfessionalMarshalSinglePrices = async (
  apiToken: string,
  ids: GetProfessionalMarshalSinglePricesRequest
): Promise<GetProfessionalMarshalSinglePricesResponse> => {
  const response = await apiClient.post<GetProfessionalMarshalSinglePricesResponse>(
    '/professional-marshal/get-single/prices',
    { api_token: apiToken, ...ids }
  );
  return response.data;
};

/** Response for POST /professional-emergency-light/base-price-create */
export interface ProfessionalEmergencyLightBasePriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Emergency Light base price.
 * POST /professional-emergency-light/base-price-create  Body: { api_token, price }
 */
export const saveProfessionalEmergencyLightBasePrice = async (
  apiToken: string,
  price: number
): Promise<ProfessionalEmergencyLightBasePriceResponse> => {
  const response = await apiClient.post<ProfessionalEmergencyLightBasePriceResponse>(
    '/professional-emergency-light/base-price-create',
    { api_token: apiToken, price }
  );
  return response.data;
};

/** Response for POST /professional-emergency-light/base-price-get */
export interface ProfessionalEmergencyLightBasePriceGetResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    price: number | string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Get professional Emergency Light base price.
 * POST /professional-emergency-light/base-price-get  Body: { api_token }
 */
export const getProfessionalEmergencyLightBasePrice = async (
  apiToken: string
): Promise<ProfessionalEmergencyLightBasePriceGetResponse> => {
  const response = await apiClient.post<ProfessionalEmergencyLightBasePriceGetResponse>(
    '/professional-emergency-light/base-price-get',
    { api_token: apiToken }
  );
  return response.data;
};

/** Response for POST /professional-emergency-light/price-create */
export interface ProfessionalEmergencyLightPriceCreateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    light_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional emergency light price (e.g. Select Emergency light, floor, type, test).
 * POST /professional-emergency-light/price-create  Body: { api_token, light_id, type, price }
 * @param type One of: "light" | "floor" | "light_type" | "light_test"
 */
export const createProfessionalEmergencyLightPrice = async (
  apiToken: string,
  light_id: number,
  type: string,
  price: number
): Promise<ProfessionalEmergencyLightPriceCreateResponse> => {
  const response = await apiClient.post<ProfessionalEmergencyLightPriceCreateResponse>(
    '/professional-emergency-light/price-create',
    { api_token: apiToken, light_id, type, price }
  );
  return response.data;
};

/** Response for POST /professional-emergency-light/floor-price-create */
export interface ProfessionalEmergencyLightFloorPriceCreateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    floor_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional emergency light floor price.
 * POST /professional-emergency-light/floor-price-create  Body: { api_token, floor_id, type: "floor", price }
 */
export const saveProfessionalEmergencyLightFloorPrice = async (
  apiToken: string,
  floor_id: number,
  price: number
): Promise<ProfessionalEmergencyLightFloorPriceCreateResponse> => {
  const response = await apiClient.post<ProfessionalEmergencyLightFloorPriceCreateResponse>(
    '/professional-emergency-light/floor-price-create',
    { api_token: apiToken, floor_id, type: "floor", price }
  );
  return response.data;
};

/** Response for POST /professional-emergency-light-test/price-create */
export interface ProfessionalEmergencyLightTestPriceCreateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    light_test_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional emergency light test price.
 * POST /professional-emergency-light-test/price-create  Body: { api_token, light_test_id, type: "light_test", price }
 */
export const saveProfessionalEmergencyLightTestPrice = async (
  apiToken: string,
  light_test_id: number,
  price: number
): Promise<ProfessionalEmergencyLightTestPriceCreateResponse> => {
  const response = await apiClient.post<ProfessionalEmergencyLightTestPriceCreateResponse>(
    '/professional-emergency-light-test/price-create',
    { api_token: apiToken, light_test_id, type: "light_test", price }
  );
  return response.data;
};

/** Response for POST /professional-emergency-light-type/price-create */
export interface ProfessionalEmergencyLightTypePriceCreateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    light_type_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional emergency light type price.
 * POST /professional-emergency-light-type/price-create  Body: { api_token, light_type_id, type: "light_type", price }
 */
export const saveProfessionalEmergencyLightTypePrice = async (
  apiToken: string,
  light_type_id: number,
  price: number
): Promise<ProfessionalEmergencyLightTypePriceCreateResponse> => {
  const response = await apiClient.post<ProfessionalEmergencyLightTypePriceCreateResponse>(
    '/professional-emergency-light-type/price-create',
    { api_token: apiToken, light_type_id, type: "light_type", price }
  );
  return response.data;
};

/** Response for POST /professional-extinguisher-wise/price-create */
export interface ProfessionalExtinguisherWisePriceCreateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    extinguisher_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional extinguisher-wise price (e.g. Select Extinguisher, Floor, Type, Last Service).
 * POST /professional-extinguisher-wise/price-create  Body: { api_token, extinguisher_id, type, price }
 * @param type One of: "extinguisher" | "floor" | "metarials" | "last_service"
 */
export const createProfessionalExtinguisherWisePrice = async (
  apiToken: string,
  extinguisher_id: number,
  type: string,
  price: number
): Promise<ProfessionalExtinguisherWisePriceCreateResponse> => {
  const response = await apiClient.post<ProfessionalExtinguisherWisePriceCreateResponse>(
    '/professional-extinguisher-wise/price-create',
    { api_token: apiToken, extinguisher_id, type, price }
  );
  return response.data;
};

/** Response for POST /professional-extinguisher/floor-price-create */
export interface ProfessionalExtinguisherFloorPriceCreateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    floor_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional extinguisher floor price.
 * POST /professional-extinguisher/floor-price-create  Body: { api_token, floor_id, type: "floor", price }
 */
export const saveProfessionalExtinguisherFloorPrice = async (
  apiToken: string,
  floor_id: number,
  price: number
): Promise<ProfessionalExtinguisherFloorPriceCreateResponse> => {
  const response = await apiClient.post<ProfessionalExtinguisherFloorPriceCreateResponse>(
    '/professional-extinguisher/floor-price-create',
    { api_token: apiToken, floor_id, type: "floor", price }
  );
  return response.data;
};

/** Response for POST /professional-extinguisher/type-price-create */
export interface ProfessionalExtinguisherTypePriceCreateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    extinguisher_type_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional extinguisher type price (Select Extinguisher Type).
 * POST /professional-extinguisher/type-price-create  Body: { api_token, extinguisher_type_id, type: "extinguisher_type", price }
 */
export const saveProfessionalExtinguisherTypePrice = async (
  apiToken: string,
  extinguisher_type_id: number,
  price: number
): Promise<ProfessionalExtinguisherTypePriceCreateResponse> => {
  const response = await apiClient.post<ProfessionalExtinguisherTypePriceCreateResponse>(
    '/professional-extinguisher/type-price-create',
    { api_token: apiToken, extinguisher_type_id, type: "extinguisher_type", price }
  );
  return response.data;
};

/** Response for POST /professional-extinguisher/last-service-price-create */
export interface ProfessionalExtinguisherLastServicePriceCreateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    last_service_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional extinguisher last service price.
 * POST /professional-extinguisher/last-service-price-create  Body: { api_token, last_service_id, type: "last_service", price }
 */
export const saveProfessionalExtinguisherLastServicePrice = async (
  apiToken: string,
  last_service_id: number,
  price: number
): Promise<ProfessionalExtinguisherLastServicePriceCreateResponse> => {
  const response = await apiClient.post<ProfessionalExtinguisherLastServicePriceCreateResponse>(
    '/professional-extinguisher/last-service-price-create',
    { api_token: apiToken, last_service_id, type: "last_service", price }
  );
  return response.data;
};

/** Request body for POST /professional-fire-Extingusher/get-single/prices */
export interface GetProfessionalExtinguisherSinglePricesRequest {
  api_token: string;
  extinguisher_id: number;
  floor_id: number;
  last_service_id: number;
  extinguisher_type_id: number;
}

/** Response for POST /professional-fire-Extingusher/get-single/prices */
export interface GetProfessionalExtinguisherSinglePricesResponse {
  message?: string;
  status?: boolean;
  data?: {
    professional?: { id: number; name: string };
    extinguisher?: { id: number; smoke_detector?: string; price?: string };
    floor?: { id: number; floor?: string; price?: string };
    last_service?: { id: number; last_service?: string; price?: string };
    extinguisher_type?: { id: number; system_type?: string; price?: string };
    total_price?: number;
  };
}

/**
 * Get prices for selected Extinguisher options (single combo).
 * POST /professional-fire-Extingusher/get-single/prices
 * Body: { api_token, extinguisher_id, floor_id, last_service_id, extinguisher_type_id }
 */
export const getProfessionalExtinguisherSinglePrices = async (
  apiToken: string,
  ids: Omit<GetProfessionalExtinguisherSinglePricesRequest, 'api_token'>
): Promise<GetProfessionalExtinguisherSinglePricesResponse> => {
  const response = await apiClient.post<GetProfessionalExtinguisherSinglePricesResponse>(
    '/professional-fire-Extingusher/get-single/prices',
    { api_token: apiToken, ...ids }
  );
  return response.data;
};

/** Request body for POST /professional-fire-light-testing/get-single/prices */
export interface GetProfessionalEmergencyLightSinglePricesRequest {
  api_token: string;
  light_id: number;
  floor_id: number;
  light_test_id: number;
  light_type_id: number;
}

/** Response for POST /professional-fire-light-testing/get-single/prices */
export interface GetProfessionalEmergencyLightSinglePricesResponse {
  status?: boolean;
  message?: string;
  data?: {
    professional?: { id: number; name: string };
    light?: { id: number; lights?: string; price?: string };
    floor?: { id: number; floor?: string; price?: string };
    light_test?: { id: number; light_test?: string; price?: string };
    light_type?: { id: number; light_type?: string; price?: string };
  };
}

/**
 * Get prices for selected Emergency Light options (single combo).
 * POST /professional-fire-light-testing/get-single/prices
 * Body: { api_token, light_id, floor_id, light_test_id, light_type_id }
 */
export const getProfessionalEmergencyLightSinglePrices = async (
  apiToken: string,
  ids: Omit<GetProfessionalEmergencyLightSinglePricesRequest, 'api_token'>
): Promise<GetProfessionalEmergencyLightSinglePricesResponse> => {
  const response = await apiClient.post<GetProfessionalEmergencyLightSinglePricesResponse>(
    '/professional-fire-light-testing/get-single/prices',
    { api_token: apiToken, ...ids }
  );
  return response.data;
};

/** Response for POST /professional-fire-alarm-base-price */
export interface ProfessionalFireAlarmBasePriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Save professional Fire Alarm base price.
 * POST /professional-fire-alarm-base-price  Body: { api_token, price }  (price as number, e.g. 150.00)
 */
export const saveProfessionalFireAlarmBasePrice = async (
  apiToken: string,
  price: number
): Promise<ProfessionalFireAlarmBasePriceResponse> => {
  const response = await apiClient.post<ProfessionalFireAlarmBasePriceResponse>(
    '/professional-fire-alarm-base-price',
    { api_token: apiToken, price }
  );
  return response.data;
};

/** Response for POST /professional-fire-alarm/get-base-price (price in data is string e.g. "123.00") */
export interface GetProfessionalFireAlarmBasePriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    price: string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Get professional Fire Alarm base price for display.
 * POST /professional-fire-alarm/get-base-price  Body: { api_token }
 */
export const getProfessionalFireAlarmBasePrice = async (
  apiToken: string
): Promise<GetProfessionalFireAlarmBasePriceResponse> => {
  const response = await apiClient.post<GetProfessionalFireAlarmBasePriceResponse>(
    '/professional-fire-alarm/get-base-price',
    { api_token: apiToken }
  );
  return response.data;
};

/** Request body for POST /professional-fire-alarm/get-single/prices */
export interface GetProfessionalFireAlarmSinglePricesRequest {
  api_token: string;
  smoke_detectors_id: number;
  call_point_id: number;
  floor_id: number;
  panel_id: number;
  system_type_id: number;
  last_service_id: number;
}

/** Response for POST /professional-fire-alarm/get-single/prices */
export interface GetProfessionalFireAlarmSinglePricesResponse {
  status: boolean;
  message: string;
  data?: {
    professional?: { id: number; name: string };
    smoke_detector?: { id: number; smoke_detector?: string; price?: string };
    call_point?: { id: number; call_point?: string; price?: string };
    floor?: { id: number; floor?: string; price?: string };
    panel?: { id: number; panel?: string; price?: string };
    system_type?: { id: number; system_type?: string; price?: string };
    last_service?: { id: number; last_service?: string; price?: string };
  };
}

/**
 * Get prices for selected Fire Alarm options (single combo).
 * POST /professional-fire-alarm/get-single/prices
 * Body: { api_token, smoke_detectors_id, call_point_id, floor_id, panel_id, system_type_id, last_service_id }
 */
export const getProfessionalFireAlarmSinglePrices = async (
  apiToken: string,
  ids: Omit<GetProfessionalFireAlarmSinglePricesRequest, 'api_token'>
): Promise<GetProfessionalFireAlarmSinglePricesResponse> => {
  const response = await apiClient.post<GetProfessionalFireAlarmSinglePricesResponse>(
    '/professional-fire-alarm/get-single/prices',
    { api_token: apiToken, ...ids }
  );
  return response.data;
};

/** Response for POST /professional-fire-alarm/smoke-detectors/create-price */
export interface CreateProfessionalFireAlarmSmokeDetectorPriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    smoke_detectors_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Fire Alarm smoke/heat detector price.
 * POST /professional-fire-alarm/smoke-detectors/create-price
 * Body: { api_token, smoke_detectors_id, type: "ditectors", price }
 */
export const createProfessionalFireAlarmSmokeDetectorPrice = async (
  apiToken: string,
  smoke_detectors_id: number,
  price: number
): Promise<CreateProfessionalFireAlarmSmokeDetectorPriceResponse> => {
  const response = await apiClient.post<CreateProfessionalFireAlarmSmokeDetectorPriceResponse>(
    '/professional-fire-alarm/smoke-detectors/create-price',
    {
      api_token: apiToken,
      smoke_detectors_id,
      type: 'ditectors',
      price,
    }
  );
  return response.data;
};

/** Response for POST /professional-fire-alarm/call-points/create-price */
export interface CreateProfessionalFireAlarmCallPointPriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    call_point_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Fire Alarm manual call point price.
 * POST /professional-fire-alarm/call-points/create-price
 * Body: { api_token, call_point_id, type: "call_points", price }
 */
export const createProfessionalFireAlarmCallPointPrice = async (
  apiToken: string,
  call_point_id: number,
  price: number
): Promise<CreateProfessionalFireAlarmCallPointPriceResponse> => {
  const response = await apiClient.post<CreateProfessionalFireAlarmCallPointPriceResponse>(
    '/professional-fire-alarm/call-points/create-price',
    {
      api_token: apiToken,
      call_point_id,
      type: 'call_points',
      price,
    }
  );
  return response.data;
};

/** Response for POST /professional-fire-alarm/floor/create-price */
export interface CreateProfessionalFireAlarmFloorPriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    floor_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Fire Alarm floor price.
 * POST /professional-fire-alarm/floor/create-price
 * Body: { api_token, floor_id, type: "floors", price }
 */
export const createProfessionalFireAlarmFloorPrice = async (
  apiToken: string,
  floor_id: number,
  price: number
): Promise<CreateProfessionalFireAlarmFloorPriceResponse> => {
  const response = await apiClient.post<CreateProfessionalFireAlarmFloorPriceResponse>(
    '/professional-fire-alarm/floor/create-price',
    {
      api_token: apiToken,
      floor_id,
      type: 'floors',
      price,
    }
  );
  return response.data;
};

/** Response for POST /professional-fire-alarm/panel/create-price */
export interface CreateProfessionalFireAlarmPanelPriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    panel_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Fire Alarm panel price.
 * POST /professional-fire-alarm/panel/create-price
 * Body: { api_token, panel_id, type: "alarm_panels", price }
 */
export const createProfessionalFireAlarmPanelPrice = async (
  apiToken: string,
  panel_id: number,
  price: number
): Promise<CreateProfessionalFireAlarmPanelPriceResponse> => {
  const response = await apiClient.post<CreateProfessionalFireAlarmPanelPriceResponse>(
    '/professional-fire-alarm/panel/create-price',
    {
      api_token: apiToken,
      panel_id,
      type: 'alarm_panels',
      price,
    }
  );
  return response.data;
};

/** Response for POST /professional-fire-alarm/system-type/create-price */
export interface CreateProfessionalFireAlarmSystemTypePriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    system_type_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Fire Alarm system type price.
 * POST /professional-fire-alarm/system-type/create-price
 * Body: { api_token, system_type_id, type: "system_type", price }
 */
export const createProfessionalFireAlarmSystemTypePrice = async (
  apiToken: string,
  system_type_id: number,
  price: number
): Promise<CreateProfessionalFireAlarmSystemTypePriceResponse> => {
  const response = await apiClient.post<CreateProfessionalFireAlarmSystemTypePriceResponse>(
    '/professional-fire-alarm/system-type/create-price',
    {
      api_token: apiToken,
      system_type_id,
      type: 'system_type',
      price,
    }
  );
  return response.data;
};

/** Response for POST /professional-fire-alarm/last-service/create-price */
export interface CreateProfessionalFireAlarmLastServicePriceResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    professional_id: number;
    last_service_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Create/update professional Fire Alarm last service price.
 * POST /professional-fire-alarm/last-service/create-price
 * Body: { api_token, last_service_id, type: "last_service", price }
 */
export const createProfessionalFireAlarmLastServicePrice = async (
  apiToken: string,
  last_service_id: number,
  price: number
): Promise<CreateProfessionalFireAlarmLastServicePriceResponse> => {
  const response = await apiClient.post<CreateProfessionalFireAlarmLastServicePriceResponse>(
    '/professional-fire-alarm/last-service/create-price',
    {
      api_token: apiToken,
      last_service_id,
      type: 'last_service',
      price,
    }
  );
  return response.data;
};

/**
 * Fetch all services
 * @returns Promise with the API response
 */
export const fetchServices = async (): Promise<ServiceResponse[]> => {
  try {
    const response = await apiClient.get<ServicesApiResponse>('/services');
    console.log('Services API Response:', response.data);
    
    // Handle the response structure: { status: 'success', data: [...] }
    if (response.data.status === 'success' && response.data.data != null) {
      const raw = response.data.data;
      // Check if data is a direct array (current API structure)
      if (Array.isArray(raw)) {
        console.log('Services found (direct array):', raw.length);
        return raw;
      }
      // Check if data is a paginated object with nested data array
      if (typeof raw === 'object' && 'data' in raw && Array.isArray((raw as any).data)) {
        console.log('Services found (paginated):', (raw as any).data.length);
        return (raw as any).data;
      }
      // Single service object: normalize to array so all services are always shown
      if (typeof raw === 'object' && 'id' in raw && (raw as any).service_name != null) {
        console.log('Services found (single object, normalized to array):', 1);
        return [raw as ServiceResponse];
      }
    }
    
    // Fallback: return empty array if structure is unexpected
    console.warn('Unexpected services API response structure:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching services:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch services',
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
 * Fetch all property types
 * @returns Promise with the API response
 */
export const fetchPropertyTypes = async (): Promise<PropertyTypeResponse[]> => {
  try {
    const response = await apiClient.get<PropertyTypesApiResponse>('/all/property_types');
    console.log('Property Types API Response:', response.data);
    
    // Handle the response structure: { status: 'success', data: [...] }
    if (response.data.status === 'success' && response.data.data) {
      // Check if data is a direct array (current API structure)
      if (Array.isArray(response.data.data)) {
        console.log('Property types found (direct array):', response.data.data.length);
        return response.data.data; // Direct array
      }
      // Check if data is a paginated object with nested data array
      if (typeof response.data.data === 'object' && 'data' in response.data.data && Array.isArray((response.data.data as any).data)) {
        console.log('Property types found (paginated):', (response.data.data as any).data.length);
        return (response.data.data as any).data; // Nested paginated array
      }
    }
    
    // Fallback: return empty array if structure is unexpected
    console.warn('Unexpected property types API response structure:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching property types:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch property types',
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
 * Fetch floor pricing options
 * GET /floor-pricing
 * API returns id, floor (and optionally label, price); normalize so UI can display dynamically.
 */
export const fetchFloorPricing = async (): Promise<FloorPricingItem[]> => {
  try {
    const response = await apiClient.get<FloorPricingApiResponse>('/floor-pricing');
    if (response.data?.status && Array.isArray(response.data.data)) {
      const raw = response.data.data as Array<{ id?: number; floor?: string; label?: string; price?: string | null; [k: string]: unknown }>;
      return raw.map((item) => {
        const floor = (item.floor ?? '').replace(/\r\n/g, '').trim();
        const label = (item.label ?? item.floor ?? '').replace(/\r\n/g, '').trim() || floor;
        return {
          id: item.id,
          floor: floor || label,
          label: label || floor,
          price: item.price ?? null,
        } as FloorPricingItem;
      });
    }
    return [];
  } catch (error) {
    console.error('Error fetching floor pricing:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch floor pricing',
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
 * Fetch all approximate people options
 * @returns Promise with the API response
 */
export const fetchApproximatePeople = async (): Promise<ApproximatePeopleResponse[]> => {
  try {
    const response = await apiClient.get<ApproximatePeopleApiResponse>('/approximate-people');
    
    // Handle the response structure
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data; // Direct array, not paginated
    }
    
    // Fallback: return empty array if structure is unexpected
    return [];
  } catch (error) {
    console.error('Error fetching approximate people:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch approximate people',
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
 * Fetch FRA durations (urgency options)
 * GET /fra-durations
 * @returns Promise with duration options (id, duration)
 */
export const fetchFraDurations = async (): Promise<FraDurationItem[]> => {
  try {
    const response = await apiClient.get<FraDurationsApiResponse>('/fra-durations');
    if (response.data?.status === true && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching FRA durations:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to fetch FRA durations',
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

// TypeScript types for Selected Service Store request
export interface SelectedServiceStoreRequest {
  api_token?: string;
  service_id: number;
  property_type_id: number;
  approximate_people_id: number;
  /** Floor option ID from floor-pricing API (sent so backend receives ID, not label). */
  number_of_floors_id?: number;
  /** Floor value/label; when number_of_floors_id is set, send ID as string so backend can validate. */
  number_of_floors: string;
  /** FRA duration/urgency option id from GET /fra-durations (e.g. 1 = "7+ days"). */
  duration_id?: number;
  preferred_date: string;
  access_note: string;
  post_code: string;
  search_radius: string;
  /** Professional ID when user selects a professional (e.g. from Book Now). Optional on initial store. */
  professional_id?: number | null;
}

export interface UpdateSelectedServiceRequest {
  api_token?: string;
  id: number;
  professional_id: number;
}

export interface SelectedServiceStoreResponse {
  status: string;
  message: string;
  data?: any;
}

/**
 * Store selected service with all details
 * @param data - Selected service data
 * @returns Promise with the API response
 */
/**
 * Update selected service with professional_id (e.g. when user clicks Book Now)
 */
export const updateSelectedService = async (data: UpdateSelectedServiceRequest): Promise<SelectedServiceStoreResponse> => {
  try {
    const response = await apiClient.post<SelectedServiceStoreResponse>('/selected_services/update', data);
    return response.data;
  } catch (error) {
    console.error('Error updating selected service:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to update selected service',
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

export const storeSelectedService = async (data: SelectedServiceStoreRequest): Promise<SelectedServiceStoreResponse> => {
  try {
    const response = await apiClient.post<SelectedServiceStoreResponse>('/selected_services/store', data);
    return response.data;
  } catch (error) {
    console.error('Error storing selected service:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to store selected service',
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
 * Fire Alarm: create selected service when user clicks Book Now on Compare Professionals.
 * POST /fire-alarm/selected-service/create (or selected-servie/create per backend)
 * Body: api_token? (when logged in), professional_id, service_id, smoke_detector_id, call_point_id,
 *       floor_id, panel_id, system_type_id, last_service_id, access_note, post_code, search_radius.
 */
export interface FireAlarmSelectedServiceCreateRequest {
  api_token?: string;
  professional_id: number;
  service_id: number;
  smoke_detector_id: number;
  call_point_id: number;
  floor_id: number;
  panel_id: number;
  system_type_id: number;
  last_service_id: number;
  access_note: string;
  post_code: string;
  search_radius: string;
}

export interface FireAlarmSelectedServiceCreateResponse {
  status: string;
  message: string;
  data?: {
    session_id?: number;
    professional_id?: number;
    customer_id?: number | null;
    service_id?: number;
    [key: string]: unknown;
  };
}

export const createFireAlarmSelectedService = async (
  data: FireAlarmSelectedServiceCreateRequest
): Promise<FireAlarmSelectedServiceCreateResponse> => {
  try {
    const response = await apiClient.post<FireAlarmSelectedServiceCreateResponse>(
      '/fire-alarm/selected-servie/create',
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error creating fire alarm selected service:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create fire alarm selected service',
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
 * Fire Extinguisher Selected Service create (Book Now flow).
 * POST /fire-extingusher/selected-servie/create
 * Body: api_token?, professional_id, service_id, extinguisher_id, floor_id, type_id, last_service_id, access_note, post_code, search_radius, preffered_date
 */
export interface FireExtinguisherSelectedServiceCreateRequest {
  api_token?: string;
  professional_id: number;
  service_id: number;
  extinguisher_id: number;
  floor_id: number;
  type_id: number;
  last_service_id: number;
  access_note: string;
  post_code: string;
  search_radius: string;
  preffered_date: string;
}

export interface FireExtinguisherSelectedServiceCreateResponse {
  status: string;
  message: string;
  data?: {
    session_id?: number;
    professional_id?: number;
    customer_id?: number | null;
    service_id?: number;
    [key: string]: unknown;
  };
}

export const createFireExtinguisherSelectedService = async (
  data: FireExtinguisherSelectedServiceCreateRequest
): Promise<FireExtinguisherSelectedServiceCreateResponse> => {
  try {
    const response = await apiClient.post<FireExtinguisherSelectedServiceCreateResponse>(
      '/fire-extingusher/selected-servie/create',
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error creating fire extinguisher selected service:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create fire extinguisher selected service',
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
 * Emergency Light: create selected service when user clicks Book Now (service_id 39).
 * POST /fire-emergency-light/selected-servie/create
 * Body: api_token?, professional_id, service_id, light_id, floor_id, light_type_id, light_test_id, access_note, post_code, search_radius, preffered_date
 */
export interface EmergencyLightSelectedServiceCreateRequest {
  api_token?: string;
  professional_id: number;
  service_id: number;
  light_id: number;
  floor_id: number;
  light_type_id: number;
  light_test_id: number;
  access_note: string;
  post_code: string;
  search_radius: string;
  preffered_date: string;
}

export interface EmergencyLightSelectedServiceCreateResponse {
  status: string;
  message: string;
  data?: {
    session_id?: number;
    professional_id?: number;
    customer_id?: number | null;
    service_id?: number;
    [key: string]: unknown;
  };
}

export const createEmergencyLightSelectedService = async (
  data: EmergencyLightSelectedServiceCreateRequest
): Promise<EmergencyLightSelectedServiceCreateResponse> => {
  try {
    const body: Record<string, unknown> = {
      professional_id: Number(data.professional_id),
      service_id: Number(data.service_id),
      light_id: Number(data.light_id),
      floor_id: Number(data.floor_id),
      light_type_id: Number(data.light_type_id),
      light_test_id: Number(data.light_test_id),
      access_note: String(data.access_note ?? ''),
      post_code: String(data.post_code ?? ''),
      search_radius: String(data.search_radius ?? ''),
      preffered_date: String(data.preffered_date ?? ''),
    };
    if (data.api_token) body.api_token = data.api_token;
    const response = await apiClient.post<EmergencyLightSelectedServiceCreateResponse>(
      '/fire-emergency-light/selected-servie/create',
      body
    );
    return response.data;
  } catch (error) {
    console.error('Error creating emergency light selected service:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create emergency light selected service',
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
 * Fire Marshal (Warden Training): create selected service when user clicks Book Now (service_id 45).
 * POST /fire-marshal/selected-servie/create
 * Body: api_token?, professional_id, service_id, people_id, place_id, building_type_id, experience_id, access_note, post_code, search_radius, preffered_date
 */
export interface FireMarshalSelectedServiceCreateRequest {
  api_token?: string;
  professional_id: number;
  service_id: number;
  people_id: number;
  place_id: number;
  building_type_id: number;
  experience_id: number;
  access_note: string;
  post_code: string;
  search_radius: string;
  preffered_date: string;
}

export interface FireMarshalSelectedServiceCreateResponse {
  status: string;
  message: string;
  data?: {
    session_id?: number;
    professional_id?: number;
    service_id?: number;
    [key: string]: unknown;
  };
}

export const createFireMarshalSelectedService = async (
  data: FireMarshalSelectedServiceCreateRequest
): Promise<FireMarshalSelectedServiceCreateResponse> => {
  try {
    const body: Record<string, unknown> = {
      professional_id: Number(data.professional_id),
      service_id: Number(data.service_id),
      people_id: Number(data.people_id),
      place_id: Number(data.place_id),
      building_type_id: Number(data.building_type_id),
      experience_id: Number(data.experience_id),
      access_note: String(data.access_note ?? ''),
      post_code: String(data.post_code ?? ''),
      search_radius: String(data.search_radius ?? ''),
      preffered_date: String(data.preffered_date ?? ''),
    };
    if (data.api_token) body.api_token = data.api_token;
    const response = await apiClient.post<FireMarshalSelectedServiceCreateResponse>(
      '/fire-marshal/selected-servie/create',
      body
    );
    return response.data;
  } catch (error) {
    console.error('Error creating fire marshal selected service:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create fire marshal selected service',
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
 * Fire Safety Consultation: create selected service when user clicks Book Now (service_id 46).
 * POST /fire-consultation/selected-servie/create
 * Body: api_token?, professional_id, service_id, mode_id, hour_id, access_note, post_code, search_radius, preffered_date
 */
export interface FireConsultationSelectedServiceCreateRequest {
  api_token?: string;
  professional_id: number;
  service_id: number;
  mode_id: number;
  hour_id: number;
  access_note: string;
  post_code: string;
  search_radius: string;
  preffered_date: string;
}

export interface FireConsultationSelectedServiceCreateResponse {
  status: string;
  message: string;
  data?: {
    session_id?: number;
    professional_id?: number;
    service_id?: number;
    [key: string]: unknown;
  };
}

export const createFireConsultationSelectedService = async (
  data: FireConsultationSelectedServiceCreateRequest
): Promise<FireConsultationSelectedServiceCreateResponse> => {
  try {
    const body: Record<string, unknown> = {
      professional_id: Number(data.professional_id),
      service_id: Number(data.service_id),
      mode_id: Number(data.mode_id),
      hour_id: Number(data.hour_id),
      access_note: String(data.access_note ?? ''),
      post_code: String(data.post_code ?? ''),
      search_radius: String(data.search_radius ?? ''),
      preffered_date: String(data.preffered_date ?? ''),
    };
    if (data.api_token) body.api_token = data.api_token;
    const response = await apiClient.post<FireConsultationSelectedServiceCreateResponse>(
      '/fire-consultation/selected-servie/create',
      body
    );
    return response.data;
  } catch (error) {
    console.error('Error creating fire consultation selected service:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create fire consultation selected service',
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

// TypeScript types for Update Service request
export interface UpdateServiceRequest {
  api_token: string;
  id: number;
  service_name: string;
  type: string;
  status: string;
  price: string;
  description: string;
}

export interface UpdateServiceResponse {
  status?: string;
  success?: boolean;
  message?: string;
  error?: string;
  data?: ServiceResponse;
}

/**
 * Update a service
 * @param data - Service update data including api_token, id, service_name, type, status, price, and description
 * @returns Promise with the API response
 */
export const updateService = async (data: UpdateServiceRequest): Promise<UpdateServiceResponse> => {
  try {
    const response = await apiClient.post<UpdateServiceResponse>('/services/update', data);
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to update service',
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

// TypeScript types for Create Service request
export interface CreateServiceRequest {
  api_token: string;
  service_name: string;
  type: string;
  status: string;
  price: string;
  description: string;
}

export interface CreateServiceResponse {
  status?: string;
  success?: boolean;
  message?: string;
  error?: string;
  data?: ServiceResponse;
}

/**
 * Create a new service
 * @param data - Service creation data including api_token, service_name, type, status, price, and description
 * @returns Promise with the API response
 */
export const createService = async (data: CreateServiceRequest): Promise<CreateServiceResponse> => {
  try {
    const response = await apiClient.post<CreateServiceResponse>('/services/store', data);
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw {
          success: false,
          message: error.response.data?.message || 'Failed to create service',
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

// TypeScript types for Delete Service request
export interface DeleteServiceRequest {
  api_token: string;
  id: number;
}

export interface DeleteServiceResponse {
  status?: string;
  success?: boolean;
  message?: string;
  error?: string;
}

/**
 * Delete a service
 * @param data - Service deletion data including api_token and id
 * @returns Promise with the API response
 */
export const deleteService = async (data: DeleteServiceRequest): Promise<DeleteServiceResponse> => {
  try {
    console.log('Deleting service with data:', { id: data.id, hasToken: !!data.api_token });
    const response = await apiClient.post<DeleteServiceResponse>(
      '/services/delete',
      {
        api_token: data.api_token,
        id: data.id
      }
    );
    console.log('Delete service response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    if (axios.isAxiosError(error)) {
      // Check for response errors (including 403 Forbidden)
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        console.error('API Error Response:', {
          status,
          data: responseData,
          headers: error.response.headers
        });
        
        throw {
          success: false,
          message: responseData?.message || `Failed to delete service (Status: ${status})`,
          error: responseData?.error || error.message,
          status: status,
          statusCode: status, // Include both for compatibility
        };
      } else if (error.request) {
        // No response received - could be network issue, CORS, or server down
        console.error('No response from server. Request details:', error.request);
        throw {
          success: false,
          message: 'No response from server. Please check your connection.',
          error: 'Network error',
          status: null,
        };
      }
    }
    // Generic error handling
    throw {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
      status: null,
    };
  }
};

