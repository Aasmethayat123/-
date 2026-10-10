/**
 * Admin Authentication and Role Verification Utility
 * Manages admin session state and gatekeeping for management and publishing tools.
 */

const ADMIN_SESSION_KEY = 'fakkerfeha_admin_session_auth';
// Primary secure admin access key for the platform
const VALID_PASSCODES = ['fakkerfeha2026', 'admin2026'];

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

export function verifyAndLoginAdmin(passcode: string): boolean {
  if (typeof window === 'undefined') return false;
  const trimmed = passcode.trim();
  if (VALID_PASSCODES.includes(trimmed)) {
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // ignore
  }
}
