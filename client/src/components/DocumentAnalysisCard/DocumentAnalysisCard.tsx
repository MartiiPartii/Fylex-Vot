import { Card, Typography, Grid, Stack } from "@mui/material"
import DocumentScoreCard from "~/components/DocumentScoreCard/DocumentScoreCard"
import IssueCard from "~/components/IssueCard/IssueCard"
import { getRiskColor } from "~/utils/riskColors"
import { DocumentAnalysis } from "~/types";
import { Twemoji } from 'react-emoji-render';

interface DocumentAnalysisCardProps {
    issues?: DocumentAnalysis['issues'];
    risk?: string;
    threats?: number | string;
    score?: number | string;
    docId?: string;
}

const DocumentAnalysisCard = ({ issues = [], risk = "Low", threats = 0, score = 0, docId = "---" }: DocumentAnalysisCardProps) => {
    return (
        <Card sx={{ padding: 3, marginBottom: 3 }}>
            <Typography mb={3} variant="h3" color="neutral"><Twemoji text="Analysis Results 📊" /></Typography>

            <Grid container spacing={2} mb={3} alignItems={"center"}>
                <DocumentScoreCard
                    score={risk}
                    label="Risk Level"
                    color={getRiskColor(risk)}
                />
                <DocumentScoreCard
                    score={threats}
                    label="Threats Found"
                    color="warning"
                />
                <DocumentScoreCard
                    score={`${score}%`}
                    label="Security Score"
                    color="secondary"
                />
            </Grid>

            {
                issues && issues.length > 0 &&
                <Stack gap={2}>
                    <Typography variant="h5">Detected Issues:</Typography>

                    <Stack
                        gap={2}
                        sx={{ maxHeight: "576px", overflowY: "auto", overflowX: "visible" }}
                        px={1.01}
                    >
                        {
                            issues.map((issue, i) => (
                                <IssueCard key={i} issue={issue} docId={docId} />
                            ))
                        }
                    </Stack>
                </Stack>
            }
        </Card>
    )
}

export default DocumentAnalysisCard