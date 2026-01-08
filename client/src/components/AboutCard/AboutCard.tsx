import { Card, Stack, Typography, Box } from "@mui/material"
import { LucideIcon, CircleCheckBig } from "lucide-react"

interface AboutCardProps {
    title: string;
    content: string;
    icon: LucideIcon;
    color: string;
}

const AboutCard = ({ title, content, icon: Icon, color }: AboutCardProps) => {
    // Determine icon color and background based on icon type
    // CircleCheckBig should have success color (no background)
    // Shield, FileCheck should have error color with background.paper
    const isCircleCheckBig = Icon === CircleCheckBig;
    
    return (
        <Card variant="outlined" sx={{ padding: 3, flex: 1 }}>
            <Stack sx={{
                p: 1.5,
                mb: 2,
                mx: "auto",
                borderRadius: 1,
                bgcolor: `${color}.main`,
                color: "background.paper",
                width: "3rem",
                height: "3rem"
            }} justifyContent={"center"} alignItems="center">
                <Icon size={24} color="currentColor" />
            </Stack>

            <Typography variant="body1" color="neutral" fontWeight={600} mb={1}>{title}</Typography>
            <Typography variant="body2">{content}</Typography>
        </Card>
    )
}

export default AboutCard