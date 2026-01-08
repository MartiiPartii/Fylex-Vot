import { Button, Stack, Typography } from "@mui/material"
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper"
import DocumentNameCard from "~/components/DocumentNameCard/DocumentNameCard";
import DocumentAnalysisCard from "~/components/DocumentAnalysisCard/DocumentAnalysisCard";
import DocumentPreviewCard from "~/components/DocumentPreviewCard/DocumentPreviewCard";
import Link from "next/link";
import LeaveReview from "~/components/LeaveReview/LeaveReview";
import { documentGet } from "~/infrastructure/external";
import { processDocument } from "~/services/document-service";
import { decodeString } from "~/utils/base64";
import { DocumentAnalysis } from "~/types";
import { Twemoji } from 'react-emoji-render';

export const metadata = {
    title: "Document Analysis | Fylex"
}

interface DocumentProps {
    params: Promise<{ id: string }>;
}

const Document = async ({ params }: DocumentProps) => {
    const { id } = await params

    // Fetch Data
    let data: any = null
    let issues: DocumentAnalysis['issues'] = undefined
    let threats: number = 0
    let text: string[] | undefined = undefined
    let securityScore: number = 0
    let isError = false
    let error: string | null = null
    
    try {
        const rawId = decodeString(decodeURIComponent(id));
        const document = await documentGet(rawId);
        
        // Process document using service layer
        const processed = processDocument({
            textAnalysis: document.textAnalysis,
            documentText: document.documentText,
            securityPercentage: document.securityPercentage
        });
        
        data = document;
        issues = processed.issues;
        threats = processed.threats;
        text = processed.textLines;
        securityScore = processed.securityScore;
    } catch (err: any) {
        // Only catch non-redirect errors (like decodeString failures)
        if (err && typeof err === 'object' && 'digest' in err && typeof err.digest === 'string' && err.digest.startsWith('NEXT_REDIRECT')) {
            throw err;
        }
        isError = true
        error = err?.message || "We couldn't fetch your document information properly. Please try again."
    }



    return (
        <SectionWrapper
            maxWidth="lg"
            props={{
                sx: { py: 8, px: 4, minHeight: "100vh", justifyContent: "center" },
                component: Stack
            }}
        >
            <LeaveReview />

            <Typography variant="h2" mb={1}><Twemoji text="Document Analysis 🔍" /></Typography>
            <Typography variant="body1" mb={3}>This is what our AI model saw in your document.</Typography>

            {
                isError ?
                    <Stack gap={6}>
                        <Typography variant="body1" color="error" fontStyle={"italic"}>{error || "We couldn't fetch your document information properly. Please try again."}</Typography>
                        <Link href="/dashboard"><Button variant="contained" color="primary">Dashboard</Button></Link>
                    </Stack>
                    :
                    <>
                        <DocumentNameCard
                            name={data?.name || ""}
                            time={data?.responseTime || ""}
                        />

                        <DocumentAnalysisCard
                            issues={issues}
                            risk={data?.riskLevel || "Low"}
                            threats={threats}
                            score={securityScore}
                            docId={id}
                        />

                        <DocumentPreviewCard
                            issues={issues}
                            name={data?.name || ""}
                            text={text}
                        />
                    </>
            }
        </SectionWrapper>
    )
}

export default Document