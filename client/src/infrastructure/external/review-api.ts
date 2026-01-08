"use server"

/**
 * Review API Client Functions
 * 
 * Handles all review-related API calls.
 */

import { httpRequest } from "~/infrastructure/http/fetch-client";

export async function reviewSubmit(data: { stars: number; comment?: string }): Promise<unknown> {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`⭐ Review API: Submit Review`);
    console.log(`   Stars: ${data.stars}`);
    console.log(`   Has Comment: ${data.comment ? data.comment : 'No'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return httpRequest<unknown>({
        url: "/review",
        method: "post",
        body: data,
        headers: {
            'Content-Type': "application/json"
        }
    });
}


