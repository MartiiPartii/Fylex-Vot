"use server"

/**
 * HTTP Fetch Client
 * 
 * Low-level HTTP client for making requests to the backend API.
 * Handles authentication, error handling, and request/response transformation.
 */

import { getToken } from "~/utils/authentication";
import { summarizeResponse, summarizeRequestBody } from "~/utils/request";

class FetchError extends Error {
    response: { data: any };
    constructor(message: string, data: any) {
        super(message);
        this.response = { data };
    }
}

interface HttpRequestConfig {
    url: string;
    method: string;
    body?: any;
    headers?: Record<string, string>;
    otherConfig?: RequestInit;
    token?: string | null; // Optional token to avoid accessing cookies in cached functions
}

/**
 * Makes an HTTP request to the backend server
 * Handles authentication, error handling, and request/response transformation
 */
export async function httpRequest<T>({
    url,
    method,
    body = null,
    headers = {},
    otherConfig = {},
    token: providedToken
}: HttpRequestConfig): Promise<T> {
    // Use provided token or fall back to getting from cookies
    const access = providedToken !== undefined ? providedToken : await getToken();

    const methodLower = method.toLowerCase();

    const headersConfig: Record<string, string> = access ? {
        'Authorization': `Bearer ${access}`,
        ...headers
    } : {
        ...headers
    };

    const config: RequestInit = {
        method: method.toUpperCase(),
        headers: headersConfig,
        ...otherConfig
    };

    if (!(methodLower === 'get' || methodLower === 'delete')) {
        if (headersConfig['Content-Type'] === 'application/json') {
            config.body = JSON.stringify(body);
        } else {
            config.body = body;
        }
    }

    const startTime = Date.now();
    const fullUrl = `${process.env.SERVER_BASE_URL ?? ''}${url}`;

    // Log request details
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📤 HTTP Request`);
    console.log(`   Path: ${url}`);
    console.log(`   Full URL: ${fullUrl}`);
    console.log(`   Method: ${method.toUpperCase()}`);
    console.log(`   Request Config:`, {
        method: config.method,
        headers: {
            ...headersConfig,
            Authorization: headersConfig.Authorization ? '[REDACTED]' : undefined
        },
        bodySummary: summarizeRequestBody(config.body),
        ...otherConfig
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let response: Response;
    try {
        response = await fetch(fullUrl, config);
    } catch (networkError) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Log network error details
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`❌ Network Error`);
        console.log(`   Path: ${url}`);
        console.log(`   Full URL: ${fullUrl}`);
        console.log(`   Method: ${method.toUpperCase()}`);
        console.log(`   Duration: ${duration}ms (failed)`);
        console.log(`   Error:`, networkError instanceof Error ? networkError.message : String(networkError));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Handle network errors (connection failures, timeouts, etc.)
        throw new FetchError("Network request failed. Please check your connection and try again.", { error: "Network request failed. Please check your connection and try again." });
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    const json = await response.json().catch(() => null);

    // Log response details (PII-safe)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📥 HTTP Response`);
    console.log(`   Path: ${url}`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Response Summary:`, summarizeResponse(json));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!response.ok) {
        // Extract user-friendly error message from response if available
        const errorMessage = json?.error || json?.message || "Request failed. Please try again.";
        const fetchError = new FetchError("Request failed.", { error: errorMessage });
        throw fetchError;
    }

    return json as T;
}

