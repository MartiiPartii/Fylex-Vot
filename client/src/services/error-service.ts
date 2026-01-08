/**
 * Error Service
 * 
 * Centralized error handling for server actions.
 * Provides consistent error response formatting.
 */

import { ServerActionResponse } from "~/types/app";

/**
 * Check if error is a Next.js redirect
 */
export function isNextRedirect(error: unknown): boolean {
    if (error && typeof error === 'object' && 'digest' in error) {
        const digest = (error as { digest?: string }).digest;
        return typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT');
    }
    return false;
}

/**
 * Check if an error message is a technical error that should be hidden from users
 */
function isTechnicalError(message: string): boolean {
    const technicalPatterns = [
        /^fetch failed/i,
        /^failed to fetch/i,
        /^network error/i,
        /^networkerror/i,
        /^typeerror/i,
        /^request failed/i,
        /^connection/i,
        /^econnrefused/i,
        /^enotfound/i,
        /^timeout/i,
    ];
    
    return technicalPatterns.some(pattern => pattern.test(message));
}

/**
 * Extract error message from various error types
 */
export function extractErrorMessage(error: unknown, defaultMessage: string = "Something went wrong."): string {
    if (error && typeof error === 'object') {
        // Check for FetchError format (from fetch-client.ts)
        if ('response' in error && error.response && typeof error.response === 'object') {
            const response = error.response as { data?: { error?: string } };
            if (response.data?.error) {
                const errorMsg = response.data.error;
                // Only return if it's not a technical error
                if (!isTechnicalError(errorMsg)) {
                    return errorMsg;
                }
            }
        }
        
        // Check for standard Error
        if ('message' in error && typeof error.message === 'string') {
            const errorMsg = error.message;
            // Only return if it's not a technical error
            if (!isTechnicalError(errorMsg)) {
                return errorMsg;
            }
        }
    }
    
    // Always return default message for technical errors or unknown errors
    return defaultMessage;
}

/**
 * Create a standardized error response for server actions
 */
export function createErrorResponse<T = unknown>(
    error: unknown,
    defaultMessage: string = "Something went wrong."
): ServerActionResponse<T> {
    // Re-throw Next.js redirects
    if (isNextRedirect(error)) {
        throw error;
    }
    
    return {
        success: false,
        error: extractErrorMessage(error, defaultMessage)
    };
}

/**
 * Create a standardized success response for server actions
 */
export function createSuccessResponse<T>(data: T): ServerActionResponse<T> {
    return { success: true, data };
}


