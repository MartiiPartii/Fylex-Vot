"use client"
import { Button, Stack, Typography } from "@mui/material"
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useActionState } from "react";
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper";
import { logoutAction } from "~/actions/auth";
import Loader from "~/components/Loader/Loader";

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
    const [state, action, isPending] = useActionState(
        async (previousState: unknown, formData: FormData) => logoutAction(),
        { success: false, error: "" }
    )

    return (
        <>
            {isPending && <Loader />}

            <SectionWrapper props={{
                sx: { paddingTop: 8, paddingBottom: 8 }
            }}>
                <Stack textAlign={"center"} alignItems={"center"}>
                    <CancelOutlinedIcon sx={{ width: "6.4rem", height: "6.4rem" }} />
                    <Typography variant="h1" mb={1}>Something went wrong.</Typography>
                    <Typography variant="body1" mb={2}>{error?.message || "We couldn't fetch your information properly. Please try again."}</Typography>

                    <form action={action}>
                        <Button type="submit" variant="contained" color="primary" endIcon={<LogoutOutlinedIcon />}>Log out</Button>
                    </form>
                </Stack>
            </SectionWrapper>
        </>
    )
}

export default ErrorPage