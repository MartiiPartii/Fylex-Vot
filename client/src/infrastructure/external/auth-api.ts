"use server"

/**
 * Auth API Client Functions
 * 
 * Handles all authentication-related API calls.
 */

import { unstable_cache } from "next/cache";
import { httpRequest } from "~/infrastructure/http/fetch-client";
import { getToken } from "~/utils/authentication";
import { decodeTokenPayload } from "~/services/auth-service";
import { AuthResponse } from "~/schemas/api";
import { User } from "~/types";

export async function authLogin(credentials: { email: string; password: string }): Promise<AuthResponse> {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔐 Auth API: Login`);
    console.log(`   Email: ${credentials.email}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return httpRequest<AuthResponse>({
        url: "/auth/login",
        method: "post",
        body: credentials,
        headers: {
            'Content-Type': "application/json"
        }
    });
}

export async function authRegister(data: { firstName: string; lastName: string; email: string; password: string }): Promise<AuthResponse> {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔐 Auth API: Register`);
    console.log(`   Email: ${data.email}`);
    console.log(`   Name: ${data.firstName} ${data.lastName}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return httpRequest<AuthResponse>({
        url: "/auth/register",
        method: "post",
        body: data,
        headers: {
            'Content-Type': "application/json"
        }
    });
}

export async function authGoogleLogin(token: string): Promise<AuthResponse> {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔐 Auth API: Google Login`);
    console.log(`   Provider: Google`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return httpRequest<AuthResponse>({
        url: "/auth/google-login",
        method: "post",
        body: { token },
        headers: {
            'Content-Type': "application/json"
        }
    });
}

export async function authGithubLogin(code: string): Promise<AuthResponse> {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔐 Auth API: GitHub Login`);
    console.log(`   Provider: GitHub`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return httpRequest<AuthResponse>({
        url: "/auth/github-login",
        method: "post",
        body: { code },
        headers: {
            'Content-Type': "application/json"
        }
    });
}

export async function authGetProfile(): Promise<User> {
    const token = await getToken();
    const payload = token ? decodeTokenPayload(token) : null;
    const userId = payload?.id || 'anonymous';
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔐 Auth API: Get Profile`);
    console.log(`   User ID: ${userId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return unstable_cache(
        async () => {
            return httpRequest<User>({
                url: "/auth/me",
                method: "get",
                headers: {
                    'Content-Type': "application/json"
                },
                token // Pass token to avoid accessing cookies in cached function
            });
        },
        [`profile-${userId}`],
        {
            tags: [`user-profile-${userId}`],
            revalidate: 600 // 10 minutes
        }
    )();
}

export async function authUploadPicture(formData: FormData): Promise<void> {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔐 Auth API: Upload Picture`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return httpRequest<void>({
        url: "/auth/me",
        method: "post",
        body: formData
    });
}


