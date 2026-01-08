import { Button, Stack, Typography, Box } from "@mui/material"
import HeroCheck from "~/components/HeroCheck/HeroCheck"
import Link from "next/link"
import { Shield } from "lucide-react"

const Hero = () => {
    return (
        <Stack gap={4} alignItems={"center"} pb={10} pt={15}>
            <Stack gap={1} direction={"row"} px={2} py={1} bgcolor={"primary.main"} borderRadius={"300px"} alignItems={"center"}>
                <Box
                    sx={{
                        color: "background.paper",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Shield size={16} color="currentColor" />
                </Box>

                <Typography variant="body2" color="primary.contrastText">Document Security Analysis</Typography>
            </Stack>

            <Typography variant="h1">Secure Your Documents with AI</Typography>
            <Typography variant="body1" mx={{ lg: 15 }} fontSize={"1.25rem"}>Advanced document scanning that detects malicious activity line by line. Keep your data safe with intelligent threat detection.</Typography>

            <Link href='/register'><Button variant="contained" color="primary">Start Analysis</Button></Link>

            <Stack direction={"row"} gap={4} justifyContent={"center"}>
                <HeroCheck label="Free to start" />
                <HeroCheck label="2-minute setup" />
            </Stack>
        </Stack>
    )
}

export default Hero