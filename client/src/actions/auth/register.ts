"use server"

/**
 * Register Server Action
 * 
 * Orchestrates the registration use case:
 * 1. Validates form data using auth service
 * 2. Calls API client to register user
 * 3. Sets authentication cookie
 * 4. Redirects to dashboard
 */

import { redirect } from "next/navigation";
import { validateRegisterData } from "~/services/auth-service";
import { authRegister } from "~/infrastructure/external";
import { setAuthToken } from "~/infrastructure/storage/cookie-storage";
import { createErrorResponse, isNextRedirect } from "~/services/error-service";
import { ServerActionResponse } from "~/types/app";

export async function registerAction(
    previousState: unknown,
    formData: FormData
): Promise<ServerActionResponse<never>> {
    // 1. Validate form data
    const validation = validateRegisterData(formData);
    if (!validation.success) {
        return createErrorResponse(new Error(validation.error), validation.error);
    }

    const { firstName, lastName, email, password, rememberMe } = validation.data!;

    try {
        // 2. Call API to register
        const response = await authRegister({
            firstName,
            lastName,
            email,
            password
        });

        // 3. Set authentication cookie
        await setAuthToken(response.token, Boolean(rememberMe));

        // 4. Redirect to dashboard
        redirect("/dashboard");
    } catch (error) {
        if (isNextRedirect(error)) {
            throw error;
        }
        return createErrorResponse(error, "Registration failed. Please try again.");
    }
}

