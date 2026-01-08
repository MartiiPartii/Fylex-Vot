"use client"

import { Button, Stack } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import { redirectToGitHubAuth } from "~/client/services/navigation";

const GithubButton = () => {
    const loginWithGitHub = () => {
        redirectToGitHubAuth();
    }


    return (
        <Stack justifyContent="center" alignItems="center">
            <Stack
                component={Button}
                direction="row"
                justifyContent="start"
                gap={2}
                onClick={loginWithGitHub}
                sx={{
                    borderRadius: "4px",
                    width: "158px",
                    height: "36px",
                    textAlign: "start",
                    padding: "2px",
                    paddingRight: "12px",
                    backgroundColor: "#202124",
                    color: "white",
                    transition: ".2s",
                    "&:hover": {
                        backgroundColor: "#555658"
                    }
                }}
                flex={1}
            >
                <Stack 
                    sx={{
                        background: "white",
                        borderTopLeftRadius: "4px",
                        borderBottomLeftRadius: "4px",
                        height: "100%"
                    }}
                    alignItems="center"
                    justifyContent="center"
                    px="7px"
                    py="6px"
                >
                    <GitHubIcon sx={{ color: "black" }} />
                </Stack>
                Github
            </Stack>
        </Stack>
    )
}

export default GithubButton