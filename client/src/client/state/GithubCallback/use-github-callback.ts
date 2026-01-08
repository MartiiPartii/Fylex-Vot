"use client"

/**
 * GitHub Callback Hook
 * 
 * Manages GitHub OAuth callback processing state and logic.
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { githubAuthAction } from "~/actions/auth";

export function useGithubCallback() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleServerAction = async () => {
            if (!code) {
                setError("No authorization code provided.");
                return;
            }
            try {
                const response = await githubAuthAction(code);
                // Check if the response indicates an error
                if (response && !response.success && response.error) {
                    setError(response.error);
                }
            } catch (err: any) {
                if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
                setError("Something went wrong. Please try again.");
            }
        };

        handleServerAction();
    }, [code]);

    return {
        error
    };
}

