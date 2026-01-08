import { Grid, Card, Typography, Chip, Stack, Box, SvgIconProps } from "@mui/material"
import { ComponentType, memo } from "react";

interface DashboardStatCardProps {
    title?: string;
    stat?: string | number;
    Icon?: ComponentType<SvgIconProps>;
    percentage?: number | string;
}

const DashboardStatCard = memo(({ title = "", stat = "", Icon, percentage = 0 }: DashboardStatCardProps) => {
    return (
        <Grid
            size={{ xs: 12, sm: 3 }}
            component={Card}
            p={{ xs: 3, sm: 3, md: 3 }}
            position="relative"
        >
            <Stack mb={2} direction="row" justifyContent="space-between">
                {Icon && <Icon sx={{ width: "2rem", height: "2rem" }} />}
                <Chip color="success" size="small" label={`${percentage}%`} />
            </Stack>
            <Typography variant="h5" mb={0.5} color="neutral">{stat}</Typography>
            <Typography variant="body2">{title}</Typography>

        </Grid>
    )
});

DashboardStatCard.displayName = 'DashboardStatCard';

export default DashboardStatCard