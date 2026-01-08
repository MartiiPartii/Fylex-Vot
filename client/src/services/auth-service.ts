/**
 * Authentication Service
 * 
 * Pure business logic for authentication operations extracted from existing code.
 * No HTTP requests, no side effects, no framework dependencies.
 */

import { LoginSchema, RegisterSchema } from "~/schemas/auth";
import { z } from "zod";
import { removeAuthToken } from "~/infrastructure/storage/cookie-storage";
import { getToken } from "~/utils/authentication";
import { revalidateTag } from "next/cache";

export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface TokenPayload {
    exp?: number;
    iat?: number;
    id?: string;
    email?: string;
}

/**
 * Validate login form data
 * Extracted from: utils/actions/authenticate.ts (handleLogin)
 * @param formData - FormData from login form
 * @returns Validation result with parsed data
 */
export function validateLoginData(formData: FormData): ValidationResult<z.infer<typeof LoginSchema>> {
    try {
        const data = Object.fromEntries(formData);
        const validated = LoginSchema.safeParse(data);

        if (!validated.success) {
            return {
                success: false,
                error: validated.error.issues[0].message
            };
        }

        return {
            success: true,
            data: validated.data
        };
    } catch (error) {
        return {
            success: false,
            error: "Invalid form data"
        };
    }
}

/**
 * Validate registration form data
 * Extracted from: utils/actions/authenticate.ts (handleRegister)
 * @param formData - FormData from registration form
 * @returns Validation result with parsed data
 */
export function validateRegisterData(formData: FormData): ValidationResult<z.infer<typeof RegisterSchema>> {
    try {
        const data = Object.fromEntries(formData);
        const validated = RegisterSchema.safeParse(data);

        if (!validated.success) {
            return {
                success: false,
                error: validated.error.issues[0].message
            };
        }

        return {
            success: true,
            data: validated.data
        };
    } catch (error) {
        return {
            success: false,
            error: "Invalid form data"
        };
    }
}

/**
 * Calculate token expiration time
 * Extracted from: utils/actions/authenticate.ts (setTokenCookie helper)
 * @param rememberMe - Whether user wants to be remembered
 * @param tokenExp - Token expiration timestamp (optional)
 * @returns Expiration config for cookie
 */
export function calculateTokenExpiration(
    rememberMe: boolean,
    tokenExp?: number
): { maxAge?: number; expires?: Date } {
    if (rememberMe && tokenExp) {
        return {
            expires: new Date(tokenExp * 1000)
        };
    }

    if (rememberMe) {
        return {
            maxAge: 30 * 24 * 60 * 60 // 30 days in seconds
        };
    }

    // Default session: 1 hour
    return {
        maxAge: 60 * 60 // 1 hour in seconds
    };
}

/**
 * Decode JWT token payload (without verification)
 * Extracted from: utils/actions/authenticate.ts (setTokenCookie helper)
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeTokenPayload(token: string): TokenPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch (error) {
        return null;
    }
}


export async function logoutService() {
    const token = await getToken()
    const payload = token ? decodeTokenPayload(token) : null
    const userId = payload?.id || 'anonymous'

    await removeAuthToken()

    revalidateTag(`user-profile-${userId}`);
    revalidateTag(`documents-${userId}`);
    revalidateTag(`stats-${userId}`);
}