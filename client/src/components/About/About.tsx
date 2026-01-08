import { Stack, Typography } from "@mui/material"
import AboutCard from "~/components/AboutCard/AboutCard"
import { Shield, CircleCheckBig, FileCheck } from "lucide-react"

const About = () => {
    return (
        <Stack gap={6} py={10}>
            <Stack gap={2}>
                <Typography variant="h2">Why Choose Fylex</Typography>
                <Typography variant="body1">Simple, powerful document security for everyone</Typography>
            </Stack>

            <Stack direction={{ sm: "row" }} gap={{ xs: 2, sm: 4 }} justifyContent={"center"}>
                <AboutCard
                    title="Advanced Detection"
                    content="Line-by-line analysis identifies hidden threats"
                    color="primary"
                    icon={Shield}
                />
                <AboutCard
                    title="Fast Results"
                    content="Get security reports in seconds, not hours"
                    color="success"
                    icon={CircleCheckBig}
                />
                <AboutCard
                    title="Easy to Use"
                    content="Simple upload and instant analysis"
                    color="warning"
                    icon={FileCheck}
                />
            </Stack>
        </Stack>
    )
}

export default About