import { Card, Chip, Stack, Typography } from "@mui/material"
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Link from "next/link";
import { encodeString } from "~/utils/base64";

interface DashboardFileCardProps {
    id?: string;
    name?: string;
    riskLevel?: string;
}

const DashboardFileCard = ({ id = "", name = "", riskLevel = "Low" }: DashboardFileCardProps) => {
    let encodedId
    try {
        encodedId = encodeString(JSON.stringify(id))
    } catch {
        encodedId = 0
    }


    const colorCodes: Record<string, "success" | "warning" | "error"> = {
        "low": "success",
        "medium": "warning",
        "high": "error"
    }

    const color = colorCodes[riskLevel?.toLowerCase() || "low"] || "success";


    return (
        <Link href={`/document/${encodedId}`}>
            <Card
                component={Stack}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                variant="outlined"
                sx={{
                    py: 3,
                    px: 2,
                    boxShadow: "none",
                    transition: ".2s",
                    "&:hover": {
                        border: "solid 1px black",
                        cursor: "pointer"
                    }
                }}
            >
                <Stack direction={"row"} alignItems="center" gap={2}>
                    <DescriptionOutlinedIcon sx={{ color: "neutral.light" }} />

                    <Stack>
                        <Typography variant="body1" color="neutral" fontWeight={500}>{name || "(untitled)"}</Typography>
                    </Stack>
                </Stack>

                <Chip size="small" sx={{ textTransform: "capitalize" }} label={`${riskLevel || "Unknown"} Risk`} color={color} />
            </Card>
        </Link>
    )
}

export default DashboardFileCard