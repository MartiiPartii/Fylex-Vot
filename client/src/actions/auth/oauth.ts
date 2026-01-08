"use server"

/**
 * OAuth Server Actions
 * 
 * Orchestrates OAuth authentication flows:
 * 1. Calls API client with OAuth credentials
 * 2. Sets authentication cookie
 * 3. Redirects to dashboard
 */

import { redirect } from "next/navigation";
import { authGithubLogin, authGoogleLogin } from "~/infrastructure/external";
import { setAuthToken } from "~/infrastructure/storage/cookie-storage";
import { createErrorResponse, isNextRedirect } from "~/services/error-service";
import { ServerActionResponse } from "~/types/app";

/**
 * GitHub OAuth callback handler
 */
export async function githubAuthAction(code: string): Promise<ServerActionResponse<never>> {
    try {
        // 1. Call API with GitHub code
        const response = await authGithubLogin(code);

        // 2. Set authentication cookie (no rememberMe for OAuth)
        await setAuthToken(response.token, false);

        // 3. Redirect to dashboard
        redirect("/dashboard");
    } catch (error) {
        if (isNextRedirect(error)) {
            throw error;
        }
        return createErrorResponse(error, "GitHub authentication failed. Please try again.");
    }
}

/**
 * Google OAuth callback handler
 */
export async function googleAuthAction(credentialResponse: { credential: string }): Promise<ServerActionResponse<never>> {
    try {
        const token = credentialResponse.credential;

        // 1. Call API with Google token
        const response = await authGoogleLogin(token);

        // 2. Set authentication cookie (no rememberMe for OAuth)
        await setAuthToken(response.token, false);

        // 3. Redirect to dashboard
        redirect("/dashboard");
    } catch (error) {
        if (isNextRedirect(error)) {
            throw error;
        }
        return createErrorResponse(error, "Google authentication failed. Please try again.");
    }
}

