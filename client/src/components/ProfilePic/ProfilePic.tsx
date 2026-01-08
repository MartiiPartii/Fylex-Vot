"use client"

import { Box, Stack } from "@mui/material"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Image from "next/image"
import Loader from "~/components/Loader/Loader";
import { useProfilePic } from "~/client/state/ProfilePic";
import { memo } from "react";

interface ProfilePicProps {
    pfp?: string | null;
    setPfpError: (error: string | null) => void;
}

const ProfilePic = memo(({ pfp, setPfpError }: ProfilePicProps) => {
    const { buttonRef, action, isPending, handleUploadFile } = useProfilePic(setPfpError)


    return (
        <>
            {isPending && <Loader />}
            <form action={action}>
                <Box
                    sx={{
                        width: "64px",
                        height: "64px",
                        display: "block",
                        aspectRatio: "1 / 1",
                        borderRadius: "200px",
                        position: "relative",
                        cursor: "pointer",
                    }}
                    component={"label"}
                    htmlFor="pfp-input"
                >
                    {
                        pfp ?
                            <Image
                                alt="Profile picture"
                                src={pfp}
                                fill
                                sizes="64px"
                                style={{
                                    borderRadius: "200px",
                                    objectFit: "cover"
                                }}
                            /> :
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "200px",
                                    bgcolor: "neutral.chip"
                                }}
                            />
                    }

                    <AddCircleIcon
                        sx={{
                            position: "absolute",
                            bottom: "-3px",
                            right: "-3px",
                            bgcolor: "background.paper",
                            borderRadius: "200px"
                        }}
                    />

                    <input onChange={(e) => handleUploadFile(e)} name="image" type="file" hidden id="pfp-input" accept="image/*" />
                </Box>
                <button hidden type="submit" ref={buttonRef}></button>
            </form>
        </>
    )
});

ProfilePic.displayName = 'ProfilePic';

export default ProfilePic