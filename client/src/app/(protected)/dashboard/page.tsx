import { Button, Grid, Stack, Typography } from "@mui/material"
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper"
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import DashboardStatCard from "~/components/DashboardStatCard/DashboardStatCard";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import DashboardRecentFiles from "~/components/DashboardRecentFiles/DashboardRecentFiles";
import Link from "next/link"
import { documentList, statsGet } from "~/infrastructure/external";
import { Twemoji } from 'react-emoji-render';

export const metadata = {
    title: "Dashboard | Fylex"
}

import { Document as AppDocument, Stats } from "~/types";

const Dashboard = async () => {
    let files: AppDocument[] | null = null
    let isFileError = false
    let fileError: string | null = null
    try {
        files = await documentList();
    } catch (error: any) {
        isFileError = true
        fileError = error?.message || "We couldn't fetch your documents. Please try again."
    }

    let stats: Stats | null = null
    let isStatError = false
    let statError: string | null = null
    try {
        stats = await statsGet();
    } catch (error: any) {
        isStatError = true
        statError = error?.message || "We couldn't fetch your statistics. Please try again."
    }



    return (
        <SectionWrapper props={{ sx: { paddingTop: 8, paddingBottom: 8, minHeight: "100vh" } }}>
            <Stack mb={4} direction={{ md: "row" }} alignItems={{ md: "center" }} justifyContent={"space-between"} gap={3}>
                <Stack gap={1}>
                    <Typography variant="h2"><Twemoji text="Dashboard 👋" /></Typography>
                    <Typography variant="body1">Monitor your document security and analysis history</Typography>
                    {isStatError && <Typography variant="body1" color="error" fontStyle={"italic"}>{statError || "We couldn't fetch your statistics. Please try again."}</Typography>}
                </Stack>

                <Link href="/upload"><Button variant="contained" color="primary" startIcon={<FileUploadOutlinedIcon />}>Upload Document</Button></Link>
            </Stack>

            <Grid mb={4} container spacing={{ xs: 1, md: 3 }}>
                <DashboardStatCard
                    title="Total Scans"
                    stat={stats?.totalSkans || "0"}
                    percentage={stats?.totalSkansPersentage || "0"}
                    Icon={DescriptionOutlinedIcon}
                />
                <DashboardStatCard
                    title="Threats Detected"
                    stat={stats?.threadsDetected || "0"}
                    percentage={stats?.threadsDetectedPersentage || "0"}
                    Icon={WarningAmberOutlinedIcon}
                />
                <DashboardStatCard
                    title="Clean Documents"
                    stat={stats?.cleanDocuments || "0"}
                    percentage={stats?.cleanDocumentsPersentage || "0"}
                    Icon={ShieldOutlinedIcon}
                />
                <DashboardStatCard
                    title="Avg Scan Time"
                    stat={`${Math.floor((stats?.avgScanTime || 0) * 100) / 100}s`}
                    percentage={stats?.avgScanTimePersentage || "0"}
                    Icon={AccessTimeOutlinedIcon}
                />
            </Grid>

            <DashboardRecentFiles files={files} isError={isFileError} error={fileError || "We couldn't fetch your documents. Please try again."} />
        </SectionWrapper>
    )
}

export default Dashboard