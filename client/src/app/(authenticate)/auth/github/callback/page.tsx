"use client"

import SectionWrapper from "~/components/SectionWrapper/SectionWrapper"
import GitHubIcon from '@mui/icons-material/GitHub';
import { Stack, Typography } from "@mui/material";
import { useGithubCallback } from "~/client/state/GithubCallback";

const GithubCallback = () => {
    const { error } = useGithubCallback();

    return (
        <SectionWrapper
            props={{
                sx: {
                    px: 3,
                    py: 8,
                    minHeight: "100vh",
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center"
                },
                component: Stack
            }}
        >
            <GitHubIcon sx={{ width: "160px", height: "160px" }} />
            {
                error ?
                    <>
                        <Typography mt={2} variant="h3">We couldn't log you in.</Typography>
                        <Typography variant="body1">{error}</Typography>
                    </>
                    :
                    <Typography mt={2} variant="h3">Processing GitHub login...</Typography>
            }
        </SectionWrapper>
    )
}

export default GithubCallback