"use client"

import { Card, Stack, Typography, IconButton } from "@mui/material"
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { getLineColor } from "~/utils/riskColors";
import TextLine from "~/components/TextLine/TextLine";
import DocumentDialog from "~/components/DocumentDialog/DocumentDialog";
import { DocumentAnalysis } from "~/types";
import { useDocumentPreview } from "~/client/state/DocumentPreviewCard";

interface DocumentPreviewCardProps {
    issues?: NonNullable<DocumentAnalysis['issues']>;
    name?: string;
    text?: string[];
}

const DocumentPreviewCard = ({ issues = [], name = "", text = [] }: DocumentPreviewCardProps) => {
    const {
        zoom,
        dialog,
        currentIssue,
        handleZoomIn,
        handleZoomOut,
        handleOpenDialog,
        handleCloseDialog
    } = useDocumentPreview(issues)


    return (
        <Card>
            {
                <DocumentDialog
                    dialog={dialog}
                    setDialog={handleCloseDialog}
                    issue={currentIssue}
                />
            }

            <Stack
                direction={{ sm: "row" }}
                alignItems={{ sm: "center" }}
                sx={{
                    bgcolor: "background.main",
                    py: 2,
                    px: {
                        xs: 2,
                        sm: 6
                    },
                    borderColor: "neutral.chip"
                }}
                justifyContent="space-between"
                borderBottom='solid 1px'
            >
                <Stack direction="row" gap={1}>
                    <VisibilityOutlinedIcon />
                    <Typography variant="body1" fontWeight={500} color="neutral">{name}</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" gap={1}>
                    <IconButton sx={{ color: "neutral.main" }} onClick={handleZoomOut}><ZoomOutIcon /></IconButton>
                    <Typography variant="body1">{zoom}%</Typography>
                    <IconButton sx={{ color: "neutral.main" }} onClick={handleZoomIn}><ZoomInIcon /></IconButton>
                </Stack>
            </Stack>

            <Stack
                sx={{
                    py: 2,
                    px: {
                        xs: 2,
                        sm: 6
                    },
                    maxHeight: "576px",
                    overflow: "auto"
                }}
            >
                {
                    text.map((line, i) => (
                        <TextLine
                            line={line}
                            number={i + 1}
                            color={getLineColor(issues, i) || undefined}
                            handleOpenDialog={handleOpenDialog}
                            key={i}
                            zoom={zoom}
                        />
                    ))
                }
            </Stack>
        </Card>
    )
}

export default DocumentPreviewCard