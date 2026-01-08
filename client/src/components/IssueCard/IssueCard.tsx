import { Stack, Typography, Box } from "@mui/material"
import ColorCard from "~/components/ColorCard/ColorCard"
import Link from "next/link"
import { CircleCheckBig, TriangleAlert, CircleX } from "lucide-react"
import { DocumentAnalysis } from "~/types"

type Issue = NonNullable<DocumentAnalysis['issues']>[number];

interface IssueCardProps {
    issue?: Issue;
    docId?: string;
}

const IssueCard = ({ issue, docId = "---" }: IssueCardProps) => {
    if (!issue) return null;

    const attributes: Record<string, { color: "secondary" | "warning" | "error", Icon: typeof CircleCheckBig }> = {
        "low": {
            color: "secondary",
            Icon: CircleCheckBig
        },
        "medium": {
            color: "warning",
            Icon: TriangleAlert
        },
        "high": {
            color: "error",
            Icon: CircleX
        }
    }
    const color = attributes[issue.risk_level]?.color || "secondary"
    const Icon = attributes[issue.risk_level]?.Icon || CircleCheckBig

    return (
        <Link href={`/document/${docId}/#line-${issue.line}`}>
            <ColorCard
                color={color}
                sx={{
                    p: 2,
                    transition: ".2s",
                    "&:hover": {
                        transform: "scale(1.01)"
                    }
                }}
            >
                <Stack direction={{ md: "row" }} gap={1.5}>
                    <Box sx={{
                        width: { xs: "1.6rem", md: "1rem" },
                        height: { xs: "1.6rem", md: "1rem" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: `${color}.main`
                    }}>
                        <Icon size={16} color="currentColor" />
                    </Box>

                    <Stack>
                        <Stack direction={{ sm: "row" }} alignItems={"start"} gap={1} mb={{ xs: 2, sm: 1 }}>
                            <Typography variant="body1" fontSize={"1.1rem"} color={`${color}.text`} fontWeight={500}>{issue.type}</Typography>

                            <Stack alignItems="center" justifyContent="center" sx={{
                                bgcolor: "neutral.chip",
                                py: 0,
                                px: 1,
                                borderRadius: "0.2rem"
                            }}>
                                <Typography variant="body2" fontSize="0.75rem" color="neutral.secondary">Line {issue.line}</Typography>
                            </Stack>
                        </Stack>
                        <Typography variant="body2" fontStyle={"italic"} fontSize={"0.7rem"} color={`${color}.text`}>"{issue.sentence}"</Typography>
                        <Typography variant="body2" mt={2} color={`${color}.text`}>{issue.explanation}</Typography>
                    </Stack>
                </Stack>
            </ColorCard>
        </Link>
    )
}

export default IssueCard