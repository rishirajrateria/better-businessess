/**
 * Default admin sign-in for /admin.
 *
 * These defaults let the admin work on a fresh deploy with no environment
 * variables configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in your hosting
 * provider to override them, and change the password from Admin -> Account
 * after your first sign-in.
 */
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "connect@betterbusinesses.ca").toLowerCase().trim();
/** Earlier default admin logins; on deploy/first sign-in they are moved to ADMIN_EMAIL so they stop working. */
export const LEGACY_ADMIN_EMAILS = ["info@betterbusinessess.com"];

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Website@123";
