"use server"

/**
 * Cookie Storage Service
 * 
 * Handles all cookie operations for authentication.
 * This is infrastructure code that interacts with Next.js cookies API.
 */

import { getCookieStore } from "~/utils/authentication";
import { calculateTokenExpiration, decodeTokenPayload } from "~/services/auth-service";

/**
 * Set authentication token in cookie
 */
export async function setAuthToken(token: string, rememberMe: boolean): Promise<void> {
    const cookies = await getCookieStore();
    const decoded = decodeTokenPayload(token);
    
    const expirationConfig = calculateTokenExpiration(rememberMe, decoded?.exp);
    
    cookies.set("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        ...expirationConfig
    });
}

/**
 * Remove authentication token from cookie
 */
export async function removeAuthToken(): Promise<void> {
    const cookies = await getCookieStore();
    cookies.delete("token");
}


