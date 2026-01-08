/**
 * Auth Actions
 * 
 * Central export for all authentication-related server actions
 */

export { loginAction } from "~/actions/auth/login";
export { registerAction } from "~/actions/auth/register";
export { githubAuthAction, googleAuthAction } from "~/actions/auth/oauth";
export { logoutAction } from "~/actions/auth/logout";


