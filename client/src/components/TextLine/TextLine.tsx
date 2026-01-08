import { Box, Grid, Stack, Typography, useTheme, Theme } from "@mui/material"
import { RiskColor } from "~/types/risk";

interface TextLineProps {
    line?: string;
    number?: number;
    color?: RiskColor | null;
    handleOpenDialog?: (line: number) => void;
    zoom?: number;
}

const TextLine = ({ line = "", number = 1, color = null, handleOpenDialog = () => { }, zoom = 1 }: TextLineProps) => {
    const theme = useTheme()

    const getColor = (token: "border" | "main") => {
        if (!color) return ""
        return (theme.palette[color] as any)[token]
    }

    return (
        <Grid
            container
            spacing={3}
            sx={{
                fontFamily: "var(--font-reddit-mono)",
                fontSize: `${zoom / 100}rem`,
                transition: ".2s",
                padding: `${theme.spacing(0.2)} 0`,
                background: color ? getColor("border") : theme.palette.background.paper,
                borderLeft: color ? `solid 4px ${getColor("main")}` : "none",
                "&:hover": {
                    background: theme.palette.background.default,
                    cursor: color ? "pointer" : ""
                }
            }}
            onClick={() => color ? handleOpenDialog(number) : null}
            id={`line-${number}`}
        >
            <Grid size={1}>
                <Typography variant="body1" fontSize="inherit" textAlign={"right"} sx={{ fontFamily: "inherit" }}>{number}</Typography>
            </Grid>
            <Grid size="grow">
                <Typography variant="body1" fontSize="inherit" color="neutral" sx={{ fontFamily: "inherit", overflowWrap: "break-word" }}>{line}</Typography>
            </Grid>
        </Grid>
    )
}

export default TextLine