import { Button, Chip, Dialog, Stack, Typography } from "@mui/material"
import { getRiskColor } from "~/utils/riskColors"
import { DocumentAnalysis } from "~/types"
import { Twemoji } from 'react-emoji-render';

interface DocumentDialogProps {
    dialog?: boolean;
    setDialog?: (open: boolean) => void;
    issue?: NonNullable<DocumentAnalysis['issues']>[number] | null;
}

const DocumentDialog = ({ dialog = false, setDialog = () => { }, issue }: DocumentDialogProps) => {
    return (
        <Dialog
            open={dialog}
            onClose={() => setDialog(false)}
            slotProps={{
                paper: {
                    sx: { padding: 3 }
                }
            }}
        >
            <Typography variant="h3" mb={2}><Twemoji text={`🚨 ${issue?.type} detected`} /></Typography>
            <Stack direction="row" gap={1} mb={1} alignItems={"center"}>
                <Typography variant="body2">Severity:</Typography>
                <Chip color={getRiskColor(issue?.risk_level || "low")} label={issue?.risk_level} />
            </Stack>
            <Stack direction="row" gap={1} mb={2} alignItems={"center"}>
                <Typography variant="body2">Location:</Typography>
                <Typography variant="body2" color="neutral">Line {issue?.line}</Typography>
            </Stack>
            <Typography variant="body1" mb={3} color="neutral">{issue?.explanation}</Typography>

            <Button variant="contained" color="primary" size="small" onClick={() => setDialog(false)}>Close</Button>
        </Dialog>
    )
}

export default DocumentDialog