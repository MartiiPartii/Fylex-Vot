"use server"

/**
 * Upload Document Server Action
 * 
 * Orchestrates document upload use case:
 * 1. Validates file (if needed)
 * 2. Calls API to upload document
 * 3. Redirects to document view page
 */

import { redirect } from "next/navigation";
import { revalidateTag, revalidatePath } from "next/cache";
import { encodeString } from "~/utils/base64";
import { documentUpload } from "~/infrastructure/external";
import { getToken } from "~/utils/authentication";
import { decodeTokenPayload } from "~/services/auth-service";
import { createErrorResponse, createSuccessResponse, isNextRedirect } from "~/services/error-service";
import { ServerActionResponse } from "~/types/app";
import { Document } from "~/types";

export async function uploadDocumentAction(
    file: File | null
): Promise<ServerActionResponse<Document>> {
    if (!file) {
        return createErrorResponse(
            new Error("No file provided"),
            "Please select a file to upload."
        );
    }

    try {
        // 1. Upload document via API
        const document = await documentUpload(file);

        // 2. Invalidate cache (user-specific)
        const token = await getToken();
        const payload = token ? decodeTokenPayload(token) : null;
        const userId = payload?.id || 'anonymous';
        revalidateTag(`documents-${userId}`);
        revalidatePath("/dashboard");

        // 3. Redirect to document view
        try {
            const encodedId = encodeString(JSON.stringify(document));
            redirect(`/document/${encodedId}`);
        } catch (redirectError) {
            // Re-throw Next.js redirects
            if (isNextRedirect(redirectError)) {
                throw redirectError;
            }
            // If encoding fails, redirect to dashboard
            redirect("/dashboard");
        }
    } catch (error) {
        if (isNextRedirect(error)) {
            throw error;
        }
        return createErrorResponse(
            error,
            "Failed to upload document. Please try again."
        );
    }
}

