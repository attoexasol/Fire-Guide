/**
 * Authentication Token Storage Utility
 * Handles secure storage and retrieval of authentication tokens
 */

const TOKEN_KEY = 'fireguide_auth_token';
const USER_EMAIL_KEY = 'fireguide_user_email';
const USER_NAME_KEY = 'fireguide_user_name';
const USER_ROLE_KEY = 'fireguide_user_role';
const USER_FULL_NAME_KEY = 'fireguide_user_full_name';
const USER_PHONE_KEY = 'fireguide_user_phone';
const USER_PROFILE_IMAGE_KEY = 'fireguide_user_profile_image';
const PROFESSIONAL_ID_KEY = 'fireguide_professional_id';

/**
 * Store authentication token securely
 * @param token - The authentication token to store
 */
export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
};

/**
 * Get stored authentication token
 * @returns The authentication token or null if not found
 */
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve auth token:', error);
    return null;
  }
};

/**
 * Extract first name from full name
 * @param fullName - Full name string
 * @returns First name
 */
export const getFirstName = (fullName: string): string => {
  if (!fullName || !fullName.trim()) {
    return "User";
  }
  return fullName.trim().split(' ')[0];
};

/**
 * Store user information
 * @param name - User's name (full name or first name)
 * @param role - User's role (customer, professional, admin)
 */
export const setUserInfo = (name: string, role: "customer" | "professional" | "admin"): void => {
  try {
    // Store only the first name for display
    const firstName = getFirstName(name);
    localStorage.setItem(USER_NAME_KEY, firstName);
    localStorage.setItem(USER_ROLE_KEY, role);
    // Also store full name
    localStorage.setItem(USER_FULL_NAME_KEY, name);
  } catch (error) {
    console.error('Failed to store user info:', error);
  }
};

/**
 * Store user full name
 * @param fullName - User's full name
 */
export const setUserFullName = (fullName: string): void => {
  try {
    localStorage.setItem(USER_FULL_NAME_KEY, fullName);
  } catch (error) {
    console.error('Failed to store user full name:', error);
  }
};

/**
 * Get stored user full name
 * @returns The user's full name or null if not found
 */
export const getUserFullName = (): string | null => {
  try {
    return localStorage.getItem(USER_FULL_NAME_KEY);
  } catch (error) {
    console.error('Failed to retrieve user full name:', error);
    return null;
  }
};

/**
 * Store user phone number
 * @param phone - User's phone number
 */
export const setUserPhone = (phone: string): void => {
  try {
    localStorage.setItem(USER_PHONE_KEY, phone);
  } catch (error) {
    console.error('Failed to store user phone:', error);
  }
};

/**
 * Get stored user phone number
 * @returns The user's phone number or null if not found
 */
export const getUserPhone = (): string | null => {
  try {
    return localStorage.getItem(USER_PHONE_KEY);
  } catch (error) {
    console.error('Failed to retrieve user phone:', error);
    return null;
  }
};

/**
 * Store user profile image URL
 * @param imageUrl - User's profile image URL
 */
export const setUserProfileImage = (imageUrl: string): void => {
  try {
    localStorage.setItem(USER_PROFILE_IMAGE_KEY, imageUrl);
  } catch (error) {
    console.error('Failed to store user profile image:', error);
  }
};

/**
 * Get stored user profile image URL
 * @returns The user's profile image URL or null if not found
 */
export const getUserProfileImage = (): string | null => {
  try {
    return localStorage.getItem(USER_PROFILE_IMAGE_KEY);
  } catch (error) {
    console.error('Failed to retrieve user profile image:', error);
    return null;
  }
};

/**
 * Get stored user information
 * @returns Object with name and role, or null if not found
 */
export const getUserInfo = (): { name: string; role: "customer" | "professional" | "admin" } | null => {
  try {
    const name = localStorage.getItem(USER_NAME_KEY);
    const role = localStorage.getItem(USER_ROLE_KEY) as "customer" | "professional" | "admin" | null;
    if (name && role && (role === "customer" || role === "professional" || role === "admin")) {
      return { name, role };
    }
    return null;
  } catch (error) {
    console.error('Failed to retrieve user info:', error);
    return null;
  }
};

/**
 * Store professional ID
 * @param professionalId - The professional ID to store
 */
export const setProfessionalId = (professionalId: number): void => {
  try {
    localStorage.setItem(PROFESSIONAL_ID_KEY, professionalId.toString());
  } catch (error) {
    console.error('Failed to store professional ID:', error);
  }
};

/**
 * Get stored professional ID
 * @returns The professional ID or null if not found
 */
export const getProfessionalId = (): number | null => {
  try {
    const professionalId = localStorage.getItem(PROFESSIONAL_ID_KEY);
    return professionalId ? parseInt(professionalId, 10) : null;
  } catch (error) {
    console.error('Failed to retrieve professional ID:', error);
    return null;
  }
};

/**
 * Remove authentication token
 */
export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(USER_FULL_NAME_KEY);
    localStorage.removeItem(USER_PHONE_KEY);
    localStorage.removeItem(USER_PROFILE_IMAGE_KEY);
    localStorage.removeItem(PROFESSIONAL_ID_KEY);
    localStorage.removeItem("user_role"); // Primary role key
    localStorage.removeItem("fireguide_user_role"); // Legacy role key
  } catch (error) {
    console.error('Failed to remove auth token:', error);
  }
};

/**
 * Store user email for login validation
 * @param email - The user's email address
 */
export const setUserEmail = (email: string): void => {
  try {
    localStorage.setItem(USER_EMAIL_KEY, email);
  } catch (error) {
    console.error('Failed to store user email:', error);
  }
};

/**
 * Get stored user email
 * @returns The user's email or null if not found
 */
export const getUserEmail = (): string | null => {
  try {
    return localStorage.getItem(USER_EMAIL_KEY);
  } catch (error) {
    console.error('Failed to retrieve user email:', error);
    return null;
  }
};

/**
 * Get API token - returns stored token
 * @returns The API token to use for requests, or null if not available
 */
export const getApiToken = (): string | null => {
  return getAuthToken();
};


/**
 * Store backend user role in localStorage
 * Overwrites existing role and removes legacy key
 * @param role - The user's role from backend (PROFESSIONAL, CUSTOMER, etc.)
 */
export const setUserRole = (role: string): void => {
  try {
    // Store role in the primary key
    localStorage.setItem("user_role", role);
    // Remove legacy key to prevent conflicts
    localStorage.removeItem("fireguide_user_role");
  } catch (error) {
    console.error('Failed to store user role:', error);
  }
};

/**
 * Get backend user role from localStorage
 * Uses only "user_role" as single source of truth
 * @returns The user's role in uppercase (PROFESSIONAL, CUSTOMER) or null if not found
 */
export const getUserRole = (): string | null => {
  try {
    const role = localStorage.getItem("user_role");
    return role ? role.toUpperCase() : null;
  } catch (error) {
    console.error('Failed to retrieve user role:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns true if token exists, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

