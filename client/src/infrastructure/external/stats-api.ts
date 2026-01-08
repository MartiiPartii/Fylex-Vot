"use server"

/**
 * Stats API Client Functions
 * 
 * Handles all statistics-related API calls.
 */

import { unstable_cache } from "next/cache";
import { httpRequest } from "~/infrastructure/http/fetch-client";
import { getToken } from "~/utils/authentication";
import { decodeTokenPayload } from "~/services/auth-service";
import { Stats } from "~/types";

export async function statsGet(): Promise<Stats> {
    const token = await getToken();
    const payload = token ? decodeTokenPayload(token) : null;
    const userId = payload?.id || 'anonymous';
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Stats API: Get Stats`);
    console.log(`   User ID: ${userId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return unstable_cache(
        async () => {
            return httpRequest<Stats>({
                url: "/document/an",
                method: "get",
                headers: {
                    'Content-Type': "application/json"
                },
                token // Pass token to avoid accessing cookies in cached function
            });
        },
        [`stats-${userId}`],
        {
            tags: [`stats-${userId}`],
            revalidate: 300 // 5 minutes
        }
    )();
}


