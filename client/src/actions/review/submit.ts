"use server"

/**
 * Submit Review Server Action
 * 
 * Orchestrates review submission:
 * 1. Validates review data using schema
 * 2. Calls API to submit review
 * 3. Returns success response
 */

import { ReviewSchema } from "~/schemas/auth";
import { reviewSubmit } from "~/infrastructure/external";
import { createErrorResponse, createSuccessResponse } from "~/services/error-service";
import { ServerActionResponse } from "~/types/app";

export async function submitReviewAction(
    previousState: unknown,
    formData: FormData,
    stars: number
): Promise<ServerActionResponse<unknown>> {
    const comment = formData.get("comment");

    // 1. Validate review data
    const validated = ReviewSchema.safeParse({
        stars: Number(stars),
        comment
    });

    if (!validated.success) {
        return createErrorResponse(
            new Error(validated.error.issues[0].message),
            validated.error.issues[0].message
        );
    }

    try {
        // 2. Submit review via API
        const response = await reviewSubmit(validated.data);

        return createSuccessResponse(response);
    } catch (error) {
        return createErrorResponse(
            error,
            "Failed to submit review. Please try again."
        );
    }
}

