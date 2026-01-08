"use client"

/**
 * Profile Picture Upload Hook
 * 
 * Manages profile picture upload state and file validation.
 */

import { useActionState, useEffect, useRef } from "react";
import { uploadPictureAction } from "~/actions/profile";

export function useProfilePic(setPfpError: (error: string | null) => void) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [state, action, isPending] = useActionState(
        uploadPictureAction,
        { success: false, error: "" } as { success: boolean; error?: string; data?: unknown }
    );

    const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maxFileSizeMB = process.env.NEXT_PUBLIC_MAX_FILE_SIZE ? Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) : 10;
        const maxSizeBytes = maxFileSizeMB * 1000000;
        if (e.target.files && e.target.files[0].size > maxSizeBytes) {
            setPfpError(`The file is too large. Max size is ${maxFileSizeMB}MB.`);
        } else if (buttonRef.current) {
            buttonRef.current.click();
            setPfpError(null);
        }
    };

    useEffect(() => {
        if (state?.error) {
            setPfpError(state.error);
        }
    }, [state, setPfpError]);

    return {
        buttonRef,
        action,
        isPending,
        handleUploadFile
    };
}

