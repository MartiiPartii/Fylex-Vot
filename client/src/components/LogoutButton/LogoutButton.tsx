"use client"

import { Button } from "@mui/material"
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Loader from "~/components/Loader/Loader";
import { useLogout } from "~/client/state/LogoutButton";

const LogoutButton = () => {
    const { action, isPending } = useLogout();

    return (
        <>
            {isPending && <Loader />}
            <form action={action}>
                <Button type="submit" variant="contained" color="primary" endIcon={<LogoutOutlinedIcon />}>Log out</Button>
            </form>
        </>
    )
}

export default LogoutButton