"use client"

/**
 * Auth Form Hook
 * 
 * Manages form state for authentication forms (login/register).
 */

import { useActionState, useEffect, useState } from "react";
import { ServerActionResponse } from "~/types/app";

export function useAuthForm(
    handleSubmit: (previousState: unknown, formData: FormData) => Promise<ServerActionResponse<unknown>>
) {
    const [error, setError] = useState<string | null>(null);
    const [state, action, isPending] = useActionState(handleSubmit, { success: false, error: "" } as ServerActionResponse<unknown>);

    useEffect(() => {
        if (state?.error) {
            setError(state.error);
        }
    }, [state]);

    return {
        error,
        setError,
        state,
        action,
        isPending
    };
}

