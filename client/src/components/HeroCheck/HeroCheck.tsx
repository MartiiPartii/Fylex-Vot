import { Stack, Typography, Box } from "@mui/material"
import { CircleCheckBig } from "lucide-react"

interface HeroCheckProps {
    label: string;
}

const HeroCheck = ({ label }: HeroCheckProps) => {
    return (
        <Stack direction={"row"} gap={1} alignItems={"center"}>
            <Box sx={{ color: "success.main", display: "flex", alignItems: "center" }}>
                <CircleCheckBig size={16} color="currentColor" />
            </Box>

            <Typography variant="body2">{label}</Typography>
        </Stack>
    )
}

export default HeroCheck