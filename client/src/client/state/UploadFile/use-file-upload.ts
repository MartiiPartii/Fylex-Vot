"use client"

/**
 * File Upload Hook
 * 
 * Manages file upload state and dropzone logic.
 */

import { useCallback, useState } from "react";
import { uploadDocumentAction } from "~/actions/document";
import { isNextRedirect } from "~/services/error-service";

export function useFileUpload() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendFile = async (file: File) => {
        setLoading(true);
        setError(null);
        
        try {
            const data = await uploadDocumentAction(file);
            if (data && !data.success && data.error) {
                setError(data.error);
            }
        } catch (err) {
            // Re-throw Next.js redirects
            if (isNextRedirect(err)) {
                throw err;
            }
            setError("Failed to upload file. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const onDropAccepted = useCallback((acceptedFiles: File[]) => {
        setError(null);
        acceptedFiles.forEach(file => {
            sendFile(file);
        });
    }, []);

    const onDropRejected = useCallback((fileRejections: any[]) => {
        if (fileRejections[0]?.errors[0]?.code === "file-too-large") {
            const maxFileSizeMB = process.env.NEXT_PUBLIC_MAX_FILE_SIZE ? Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) : 10;
            setError(`Your file exceeds the ${maxFileSizeMB} MB limit.`);
        } else {
            setError("Something went wrong. Please try again.");
        }
    }, []);

    return {
        loading,
        error,
        setError,
        onDropAccepted,
        onDropRejected
    };
}

