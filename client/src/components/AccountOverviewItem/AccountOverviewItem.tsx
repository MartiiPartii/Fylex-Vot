import { Stack, SvgIconProps, Typography, Box } from "@mui/material"
import { ComponentType } from "react"
import { LucideIcon } from "lucide-react"

interface AccountOverviewItemProps {
    Icon?: ComponentType<SvgIconProps> | null;
    LucideIcon?: LucideIcon | null;
    name?: string;
    stat?: string | number;
}

const AccountOverviewItem = ({ Icon, LucideIcon: LucideIconComponent, name = "", stat = "" }: AccountOverviewItemProps) => {
    const iconStyles = {
        width: "36px",
        height: "36px",
        borderRadius: 1,
        p: 1,
        background: `linear-gradient(135deg, var(--mui-palette-neutral-main), var(--mui-palette-neutral-secondary))`
    }

    return (
        <Stack direction="row" mb={2} justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems={"center"}>
                {
                    Icon &&
                    <Icon sx={{ ...iconStyles, color: "primary.contrastText" }} />
                }
                {
                    LucideIconComponent &&
                    <Box
                        sx={{
                            ...iconStyles,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            color: "primary.contrastText"
                        }}
                    >
                        <LucideIconComponent size={20} color="currentColor" />
                    </Box>
                }
                <Typography variant="h4" fontWeight={400}>{name}</Typography>
            </Stack>
            <Typography variant="h4">{stat}</Typography>
        </Stack>
    )
}

export default AccountOverviewItem