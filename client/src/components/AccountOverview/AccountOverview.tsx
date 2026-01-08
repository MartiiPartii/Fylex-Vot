import { Grid, Stack, Typography } from "@mui/material"
import AccountOverviewItem from "~/components/AccountOverviewItem/AccountOverviewItem"
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { Crown } from "lucide-react";
import { Stats } from "~/types";
import { Twemoji } from 'react-emoji-render';

interface AccountOverviewProps {
    stats?: Stats;
    isError?: boolean;
    error?: string | null;
}

const AccountOverview = ({ stats, isError = false, error = null }: AccountOverviewProps) => {
    return (
        <Grid size="grow">
            <Stack mb={3} gap={1}>
                <Typography variant="h4"><Twemoji text="Account Overview 📊" /></Typography>
                {isError && <Typography variant="body2" color="error" fontStyle={"italic"}>{error}</Typography>}
            </Stack>

            <AccountOverviewItem
                Icon={DescriptionOutlinedIcon}
                name="Documents Scanned"
                stat={stats?.totalSkans || 0}
            />
            <AccountOverviewItem
                Icon={ShieldOutlinedIcon}
                name="Threats Detected"
                stat={stats?.threadsDetected || 0}
            />
            <AccountOverviewItem
                Icon={DescriptionOutlinedIcon}
                name="Clean Documents"
                stat={stats?.cleanDocuments || 0}
            />
            <AccountOverviewItem
                Icon={AccessTimeOutlinedIcon}
                name="Average Scan Time"
                stat={`${Math.floor((stats?.avgScanTime || 0) * 100) / 100}s`}
            />
            <AccountOverviewItem
                LucideIcon={Crown}
                name="Plan"
                stat="Beta"
            />
        </Grid>
    )
}

export default AccountOverview