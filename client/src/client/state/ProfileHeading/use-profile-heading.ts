"use client"

/**
 * Profile Heading Hook
 * 
 * Manages profile heading state (profile picture error).
 */

import { useState } from "react";

export function useProfileHeading() {
    const [pfpError, setPfpError] = useState<string | null>(null);

    return {
        pfpError,
        setPfpError
    };
}

