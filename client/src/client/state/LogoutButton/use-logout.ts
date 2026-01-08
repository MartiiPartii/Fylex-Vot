"use client"

/**
 * Logout Hook
 * 
 * Manages logout action state.
 */

import { useActionState } from "react";
import { logoutAction } from "~/actions/auth";

export function useLogout() {
    const [state, action, isPending] = useActionState(
        async (previousState: unknown, formData: FormData) => logoutAction(),
        { success: false, error: "" }
    );

    return {
        state,
        action,
        isPending
    };
}

