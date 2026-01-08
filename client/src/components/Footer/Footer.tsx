import SectionWrapper from "~/components/SectionWrapper/SectionWrapper"
import { Box, Stack, Typography } from "@mui/material"
import FooterLink from "~/components/FooterLink/FooterLink"
import Image from "next/image"
import { memo } from "react"

const Footer = memo(() => {

    return (
        <Box sx={{
            background: `linear-gradient(135deg, var(--mui-palette-primary-main), var(--mui-palette-neutral-secondary))`
        }}>
            <SectionWrapper
                props={{
                    sx: {
                        textAlign: { sm: "center" },
                        px: 2,
                        py: 8
                    }
                }}
            >
                <Box
                    sx={{
                        width: "256px",
                        aspectRatio: "14 / 5",
                        mb: 2,
                        mx: { sm: "auto" },
                        position: "relative"
                    }}
                >
                    <Image
                        src="/images/logo-footer.webp"
                        alt="Logo"
                        fill
                        sizes="256px"
                    />
                </Box>
                <Typography variant="body1" color="primary.contrastText">Advanced document scanning that detects malicious activity line by line.</Typography>
                <Typography variant="body1" mb={4} color="primary.contrastText">Keep your data safe with intelligent threat detection.</Typography>

                <Stack direction={{ sm: "row" }} mb={4} alignItems={{ sm: "center" }} justifyContent={"center"} gap={{ xs: 1, sm: 5 }}>
                    <FooterLink to="/dashboard" label="Dashboard" />
                    <FooterLink to="/upload" label="Document Analysis" />
                    <FooterLink to="/register" label="Get Started" />
                </Stack>

                <Typography variant="body1">&copy; {new Date().getFullYear()} Fylex. All rights reserved.</Typography>
            </SectionWrapper>
        </Box>
    )
});

Footer.displayName = 'Footer';

export default Footer