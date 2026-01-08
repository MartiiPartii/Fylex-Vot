"use client"

/**
 * Google Auth Hook
 * 
 * Manages Google OAuth authentication state.
 */

import { useState } from "react";
import { CredentialResponse } from "@react-oauth/google";
import { googleAuthAction } from "~/actions/auth";

export function useGoogleAuth(setError: (error: string | null) => void) {
    const [loading, setLoading] = useState(false);

    const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            setError('Google authentication failed: No credential received.');
            return;
        }
        
        setLoading(true);
        try {
            const response = await googleAuthAction({ credential: credentialResponse.credential });
            // Check if the response indicates an error
            if (response && !response.success && response.error) {
                setError(response.error);
            }
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'digest' in err && typeof err.digest === 'string' && err.digest.startsWith('NEXT_REDIRECT')) throw err;
            setError('Google authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLoginFailure = () => {
        setError('Google authentication failed.');
    };

    return {
        loading,
        handleGoogleLoginSuccess,
        handleGoogleLoginFailure
    };
}

