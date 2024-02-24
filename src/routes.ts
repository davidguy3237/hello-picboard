/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = ["/", "/new-verification"];

/**
 * An array of routes that are accessible to authenticated users.
 * These routes must be checked to see if the user is authenticated.
 * @type {string[]}
 */
export const protectedRoutes = ["/settings", "/upload", "/admin", "/server"];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to /settings.
 * @type {string[]}
 */
export const authRoutes = [
  "/login",
  "/register",
  "/error",
  "/reset-password",
  "/new-password",
  "/new-verification",
];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/home";
