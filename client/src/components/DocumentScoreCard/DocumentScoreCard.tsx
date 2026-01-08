import { Grid, Typography } from "@mui/material"
import ColorCard from "~/components/ColorCard/ColorCard"
import { RiskColor } from "~/types/risk";

interface DocumentScoreCardProps {
    score?: string | number;
    label?: string;
    color?: RiskColor | string;
}

const DocumentScoreCard = ({ score = "", label = "", color = "secondary" }: DocumentScoreCardProps) => {
    return (
        <Grid
            size={{ xs: 12, sm: 4 }}
            sx={{ height: "100%" }}
        >
            <ColorCard
                color={color as RiskColor}
                sx={{
                    py: 4,
                    px: 2,
                    textAlign: "center",
                    height: "100%"
                }}
            >
                <Typography variant="h3" textTransform={"capitalize"}>{score}</Typography>
                <Typography variant="body1" color="inherit">{label}</Typography>
            </ColorCard>
        </Grid>
    )
}

export default DocumentScoreCard