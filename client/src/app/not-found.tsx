import { Button, Stack, Typography } from "@mui/material"
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper"
import Link from "next/link"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Twemoji } from 'react-emoji-render';

const NotFound = () => {
    return (
        <SectionWrapper
            maxWidth="md"
            props={{
                sx: {
                    py: 8,
                    px: 4,
                    minHeight: "100vh",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center"
                },
                component: Stack
            }}
        >
            <Stack gap={2} alignItems="center">
                <Typography variant="h1">404</Typography>
                <Typography variant="h3">Page Not Found</Typography>
                <Typography variant="body1" maxWidth="600px">
                    <Twemoji text="The page you're looking for doesn't exist or has been moved. Let's get you back to safety! 🔒" />
                </Typography>
                <Link href="/">
                    <Button variant="contained" color="primary" startIcon={<HomeOutlinedIcon />} size="large">
                        Return to Home
                    </Button>
                </Link>
            </Stack>
        </SectionWrapper>
    )
}

export default NotFound