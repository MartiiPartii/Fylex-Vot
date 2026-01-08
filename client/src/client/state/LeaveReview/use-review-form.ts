"use client"

/**
 * Review Form Hook
 * 
 * Manages form state for review submission.
 */

import { useActionState, useEffect, useState } from "react";
import { submitReviewAction } from "~/actions/review";

export function useReviewForm() {
    const [open, setOpen] = useState(true);
    const [toast, setToast] = useState(false);
    const [stars, setStars] = useState(1);

    const [state, action, isPending] = useActionState(
        async (previousState: { success?: boolean; error?: string; data?: unknown }, formData: FormData) => submitReviewAction(previousState, formData, stars),
        { success: false, error: undefined, data: undefined } as { success: boolean; error?: string; data?: unknown }
    );

    useEffect(() => {
        if (state?.data) {
            setOpen(false);
            setToast(true);
        }
    }, [state]);

    return {
        open,
        setOpen,
        toast,
        setToast,
        stars,
        setStars,
        state,
        action,
        isPending
    };
}

