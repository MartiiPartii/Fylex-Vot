"use client"

import { Stack, Typography } from "@mui/material"
import ProfilePic from "~/components/ProfilePic/ProfilePic"
import { useProfileHeading } from "~/client/state/ProfileHeading"

interface ProfileHeadingProps {
    pfp?: string | null;
    firstName?: string;
    lastName?: string;
}

const ProfileHeading = ({ pfp = null, firstName = "", lastName = "" }: ProfileHeadingProps) => {
    const { pfpError, setPfpError } = useProfileHeading()

    return (
        <Stack mb={2} gap={1}>
            <Stack direction="row" gap={3} alignItems="center">
                <ProfilePic pfp={pfp} setPfpError={setPfpError} />

                <Stack>
                    <Typography mb={3} variant="h4">{firstName} {lastName}</Typography>
                </Stack>
            </Stack>

            {pfpError && <Typography variant="body2" color="error" fontStyle={"italic"}>{pfpError}</Typography>}
        </Stack>
    )
}

export default ProfileHeading