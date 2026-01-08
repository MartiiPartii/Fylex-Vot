"use client"

/**
 * Document Preview Hook
 * 
 * Manages document preview state (zoom, dialog, current issue).
 */

import { useState } from "react";
import { DocumentAnalysis } from "~/types";

export function useDocumentPreview(issues?: NonNullable<DocumentAnalysis['issues']>) {
    const [zoom, setZoom] = useState(100);
    const [dialog, setDialog] = useState(false);
    const [currentIssue, setCurrentIssue] = useState<NonNullable<DocumentAnalysis['issues']>[number] | null>(null);

    const handleZoomIn = () => {
        if (zoom < 200) setZoom(zoom + 10);
    };

    const handleZoomOut = () => {
        if (zoom > 50) setZoom(zoom - 10);
    };

    const handleOpenDialog = (line: number) => {
        const index = issues?.findIndex(issue => issue.line === line) ?? -1;
        if (index >= 0 && issues) {
            setCurrentIssue(issues[index]);
        }
        setDialog(true);
    };

    const handleCloseDialog = () => {
        setDialog(false);
    };

    return {
        zoom,
        dialog,
        currentIssue,
        handleZoomIn,
        handleZoomOut,
        handleOpenDialog,
        handleCloseDialog
    };
}

