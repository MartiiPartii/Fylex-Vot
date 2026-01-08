"use server"

/**
 * Document API Client Functions
 * 
 * Handles all document-related API calls.
 */

import { unstable_cache } from "next/cache";
import { httpRequest } from "~/infrastructure/http/fetch-client";
import { getToken } from "~/utils/authentication";
import { decodeTokenPayload } from "~/services/auth-service";
import { Document } from "~/types";

export async function documentList(): Promise<Document[]> {
    const token = await getToken();
    const payload = token ? decodeTokenPayload(token) : null;
    const userId = payload?.id || 'anonymous';
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📄 Document API: List Documents`);
    console.log(`   User ID: ${userId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return unstable_cache(
        async () => {
            return httpRequest<Document[]>({
                url: "/document",
                method: "get",
                headers: {
                    'Content-Type': "application/json"
                },
                token // Pass token to avoid accessing cookies in cached function
            });
        },
        [`documents-list-${userId}`],
        {
            tags: [`documents-${userId}`],
            revalidate: 300 // 5 minutes
        }
    )();
}

export async function documentGet(id: string): Promise<Document> {
    const token = await getToken();
    const payload = token ? decodeTokenPayload(token) : null;
    const userId = payload?.id || 'anonymous';
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📄 Document API: Get Document`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Document ID: ${id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return unstable_cache(
        async () => {
            return httpRequest<Document>({
                url: `/document/${id}`,
                method: "get",
                headers: {
                    'Content-Type': "application/json"
                },
                token // Pass token to avoid accessing cookies in cached function
            });
        },
        [`document-${userId}-${id}`],
        {
            tags: [`documents-${userId}`, `document-${userId}-${id}`],
            revalidate: 900 // 15 minutes
        }
    )();
}

export async function documentUpload(file: File): Promise<Document> {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📄 Document API: Upload Document`);
    console.log(`   File Name: ${file.name}`);
    console.log(`   File Size: ${file.size} bytes`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const formData = new FormData();
    formData.append("file", file);
    
    return httpRequest<Document>({
        url: "/document",
        method: "post",
        body: formData
    });
}


