"use server"

/**
 * Login Server Action
 * 
 * Orchestrates the login use case:
 * 1. Validates form data using auth service
 * 2. Calls API client to authenticate
 * 3. Sets authentication cookie
 * 4. Redirects to dashboard
 */

import { redirect } from "next/navigation";
import { validateLoginData } from "~/services/auth-service";
import { authLogin } from "~/infrastructure/external";
import { setAuthToken } from "~/infrastructure/storage/cookie-storage";
import { createErrorResponse, createSuccessResponse, isNextRedirect } from "~/services/error-service";
import { ServerActionResponse } from "~/types/app";

export async function loginAction(
    previousState: unknown,
    formData: FormData
): Promise<ServerActionResponse<never>> {
    // 1. Validate form data
    const validation = validateLoginData(formData);
    if (!validation.success) {
        return createErrorResponse(new Error(validation.error), validation.error);
    }

    const { email, password, rememberMe } = validation.data!;

    try {
        // 2. Call API to authenticate
        const response = await authLogin({ email, password });

        // 3. Set authentication cookie
        await setAuthToken(response.token, Boolean(rememberMe));

        // 4. Redirect to dashboard
        redirect("/dashboard");
    } catch (error) {
        if (isNextRedirect(error)) {
            throw error;
        }
        return createErrorResponse(error, "Login failed. Please check your credentials and try again.");
    }
}

