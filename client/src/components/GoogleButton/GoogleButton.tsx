"use client"

import { Stack } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import Loader from "~/components/Loader/Loader";
import { useGoogleAuth } from "~/client/state/GoogleButton";

interface GoogleButtonProps {
    setError: (error: string | null) => void;
    text?: "signin_with" | "signup_with" | "continue_with" | "signin";
}

const GoogleButton = ({ setError, text = "signin_with" }: GoogleButtonProps) => {
    const { loading, handleGoogleLoginSuccess, handleGoogleLoginFailure } = useGoogleAuth(setError)



    return (
        <>
            {loading && <Loader />}
            <Stack alignItems="center">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginFailure}
                    size="large"
                    theme="filled_black"
                    logo_alignment="center"
                    shape="rectangular"
                    text={text}
                    width={"158px"}
                />
            </Stack>
        </>
    )
}

export default GoogleButton