import { Button, Card, Stack, Typography } from "@mui/material"
import DashboardFileCard from "~/components/DashboardFileCard/DashboardFileCard"
import Link from "next/link"
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Document as AppDocument } from "~/types";

interface DashboardRecentFilesProps {
    files?: AppDocument[] | null;
    isError?: boolean | null;
    error?: string | null;
}

const DashboardRecentFiles = ({ files = [], isError = null, error = null }: DashboardRecentFilesProps) => {
    return (
        <Card sx={{ padding: 3 }}>
            <Stack gap={1}>
                <Typography variant="h4" color="neutral">Recent Files 📋</Typography>
                {isError && <Typography variant="body2" color="error" fontStyle={"italic"}>{error}</Typography>}
                {
                    (!files || !files.length) &&
                    <Stack gap={3}>
                        <Typography variant="body1">It seems like you haven't uploaded any files yet.</Typography>
                        <Link href="/upload"><Button variant="contained" color="primary" startIcon={<FileUploadOutlinedIcon />} size="small">Upload Document</Button></Link>
                    </Stack>
                }
            </Stack>

            {
                !isError &&
                (files && files.length > 0) &&
                <Stack mt={3} gap={2} sx={{ maxHeight: "576px", overflow: "auto" }}>
                    {
                        files.map((file, i) => (
                            <DashboardFileCard
                                key={i}
                                {...file}
                            />
                        ))
                    }
                </Stack>
            }
        </Card>
    )
}

export default DashboardRecentFiles