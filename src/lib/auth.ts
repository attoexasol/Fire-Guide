/**
 * Authentication Token Storage Utility
 * Handles secure storage and retrieval of authentication tokens
 */

const TOKEN_KEY = 'fireguide_auth_token';
const USER_EMAIL_KEY = 'fireguide_user_email';
const USER_NAME_KEY = 'fireguide_user_name';
const USER_ROLE_KEY = 'fireguide_user_role';

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
  } catch (error) {
    console.error('Failed to store user info:', error);
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
 * Remove authentication token
 */
export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
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
 * Check if user is authenticated
 * @returns true if token exists, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

