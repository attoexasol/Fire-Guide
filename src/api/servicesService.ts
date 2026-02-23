/// <reference types="vite/client" />
import axios from 'axios';

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

/**
 * Fire Alarm: fetch options for dropdowns (detectors, call_points, floors, alarm_panels, system_type, last_service).
 * POST /fire-alarm/get-alarm  Body: { api_token, type }
 * Response: { status: true, message: string, data: [{ id, type, value, ... }] } — "value" is shown in dropdowns.
 */
export const fetchFireAlarmOptions = async (
  apiToken: string,
  type: string
): Promise<FireAlarmOptionItem[]> => {
  try {
    const response = await apiClient.post<FireAlarmGetAlarmResponse>('/fire-alarm/get-alarm', {
      api_token: apiToken,
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

