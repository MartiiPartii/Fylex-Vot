"use client"

import { Box, Button, Card, Checkbox, Divider, FormControlLabel, Stack, Typography, useTheme } from "@mui/material"
import FormInputField from "~/components/FormInputField/FormInputField"
import Link from "next/link"
import GoogleButton from "~/components/GoogleButton/GoogleButton"
import GithubButton from "~/components/GithubButton/GithubButton"
import Image from "next/image"
import Loader from "~/components/Loader/Loader"
import { AuthFormProps } from "~/types/form"
import { useAuthForm } from "~/client/state/AuthForm"
import { Twemoji } from 'react-emoji-render';

const AuthForm = ({
    title,
    description,
    inputs,
    buttonLabel,
    handleSubmit,
    link
}: AuthFormProps) => {
    const theme = useTheme()
    const { error, setError, action, isPending } = useAuthForm(handleSubmit)

    return (
        <>
            {isPending && <Loader />}
            <Stack maxWidth={"30rem"} textAlign={"center"} alignItems="center" mx="auto" >
                <Box sx={{
                    width: "128px",
                    aspectRatio: "14 / 5",
                    position: "relative",
                    mb: 3
                }}>
                    <Image
                        src="/images/logo.webp"
                        alt="Logo"
                        fill
                        sizes="128px"
                    />
                </Box>

                <Card sx={{ padding: 4, width: "100%" }}>
                    <Stack mb={3}>
                        <Typography variant="h3" color="neutral" mb={0.5}><Twemoji text={title} /></Typography>
                        <Typography variant="body2">{description}</Typography>
                        {error && <Typography variant="body2" color="error">{error || ""}</Typography>}
                    </Stack>

                    <Box mb={2}>
                        {
                            inputs && inputs.length > 0 &&
                            <form action={action}>
                                <Stack gap={2}>
                                    {
                                        inputs.map((input, i) => (
                                            <FormInputField
                                                {...input}
                                                required={true}
                                                key={i}
                                            />
                                        ))
                                    }
                                </Stack>

                                <Stack mt={1.5} mb={1.5} direction="row" alignItems="center" justifyContent="space-between">
                                    <FormControlLabel
                                        name="rememberMe"
                                        control={
                                            <Checkbox size="small" value={true} color="primary" />
                                        }
                                        label="Remember me"
                                        slotProps={{
                                            typography: {
                                                fontSize: "0.875rem",
                                                color: theme.palette.neutral.main
                                            }
                                        }}
                                    />
                                </Stack>

                                <Button variant="contained" color="primary" fullWidth size="large" type="submit"><Twemoji text={buttonLabel} /></Button>
                            </form>

                        }
                    </Box>

                    <Divider>
                        <Typography variant="body1">Or continue with</Typography>
                    </Divider>

                    <Stack mt={2} mb={2} gap={1} justifyContent="center" direction={{ sm: "row" }}>
                        <GoogleButton
                            setError={setError}
                        />

                        <GithubButton />
                    </Stack>

                    <Typography variant="body2">{link.text} <Link href={link.to}><Typography component="span" sx={{ color: "neutral.main", fontWeight: 500 }}>{link.label}</Typography></Link></Typography>
                </Card>
            </Stack>
        </>
    )
}

export default AuthForm