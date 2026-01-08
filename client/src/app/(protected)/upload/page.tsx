import { Stack, Typography } from "@mui/material"
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper"
import UploadFile from "~/components/UploadFile/UploadFile";
import { Twemoji } from 'react-emoji-render';

export const metadata = {
    title: "Upload A Document | Fylex"
}

const Upload = () => {
    return (
        <SectionWrapper props={{ sx: { paddingTop: 8, paddingBottom: 8, minHeight: "100vh" } }}>
            <Stack gap={1}>
                <Typography variant="h2"><Twemoji text="Document Analysis 🔍" /></Typography>
                <Typography variant="body1">Upload and analyze documents for security threats line by line</Typography>
            </Stack>

            <UploadFile />
        </SectionWrapper>
    )
}

export default Upload