import { Card, Stack, Typography } from "@mui/material"
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

interface DocumentNameCardProps {
    name?: string;
    time?: string | number;
}

const DocumentNameCard = ({ name = "", time = "" }: DocumentNameCardProps) => {
    return (
        <Card sx={{ padding: 3, marginBottom: 3 }}>
            <Stack direction="row" gap={2} alignItems="center">
                <DescriptionOutlinedIcon sx={{ width: "2rem", height: "2rem" }} />
                <Stack>
                    <Typography variant="body1" color="neutral">{name}</Typography>
                    <Typography variant="body1" >Model response time: {time}s</Typography>
                </Stack>
            </Stack>
        </Card>
    )
}

export default DocumentNameCard