"use server"

/**
 * Upload Picture Server Action
 * 
 * Orchestrates profile picture upload:
 * 1. Calls API to upload picture
 * 2. Revalidates profile page cache
 */

import { revalidatePath, revalidateTag } from "next/cache";
import { authUploadPicture } from "~/infrastructure/external";
import { getToken } from "~/utils/authentication";
import { decodeTokenPayload } from "~/services/auth-service";
import { createErrorResponse, createSuccessResponse } from "~/services/error-service";
import { ServerActionResponse } from "~/types/app";

export async function uploadPictureAction(
    previousState: unknown,
    formData: FormData
): Promise<ServerActionResponse<void>> {
    try {
        // 1. Upload picture via API
        await authUploadPicture(formData);

        // 2. Invalidate cache (user-specific)
        const token = await getToken();
        const payload = token ? decodeTokenPayload(token) : null;
        const userId = payload?.id || 'anonymous';
        revalidateTag(`user-profile-${userId}`);
        revalidatePath("/profile");

        return createSuccessResponse(undefined);
    } catch (error) {
        return createErrorResponse(error, "Failed to upload picture. Please try again.");
    }
}

