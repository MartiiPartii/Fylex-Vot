"use server"

/**
 * Logout Server Action
 * 
 * Orchestrates the logout use case:
 * 1. Removes authentication cookie
 * 2. Redirects to login page
 */

import { redirect } from "next/navigation";
import { logoutService } from "~/services/auth-service";
import { createErrorResponse, isNextRedirect } from "~/services/error-service";
import { ServerActionResponse } from "~/types/app";

export async function logoutAction(): Promise<ServerActionResponse<never>> {
    try {
        // 1. Remove authentication cookie
        await logoutService();

        // 2. Redirect to login
        redirect("/login");
    } catch (error) {
        if (isNextRedirect(error)) {
            throw error;
        }
        return createErrorResponse(error, "Logout failed. Please try again.");
    }
}


