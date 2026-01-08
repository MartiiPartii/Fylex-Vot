import { AppBar, Box, Button, Stack, Toolbar } from "@mui/material"
import Link from "next/link"
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import NavigationLink from "~/components/NavigationLink/NavigationLink";
import Image from "next/image"
import { memo } from "react"

interface HeaderProps {
    isAuth?: boolean;
}

const Header = memo(({ isAuth = false }: HeaderProps) => {
    return (
        <AppBar elevation={1} position="sticky">
            <Toolbar>
                <Link href="/">
                    <Box sx={{
                        width: { xs: `${8 * 8}px`, sm: `${42 * 8 / 4}px` },
                        aspectRatio: "14 / 5",
                        position: "relative"
                    }}>
                        <Image
                            src="/images/logo.webp"
                            alt="Fylex"
                            fill
                            sizes="(max-width: 600px) 64px, 84px"
                            priority
                        />
                    </Box>
                </Link>

                <Stack direction="row" justifyContent={"end"} flex={1} gap={{ xs: 0.5, sm: 2 }}>
                    {
                        isAuth ?
                            <>
                                <NavigationLink
                                    to="/dashboard"
                                    label="Dashboard"
                                />
                                <NavigationLink
                                    to="/upload"
                                    label="Analysis"
                                />
                                <NavigationLink
                                    to="/profile"
                                    label="Profile"
                                    props={{
                                        startIcon: <PersonOutlinedIcon sx={{ width: "1.2rem", height: "1.2rem" }} />
                                    }}
                                />
                            </>
                            :
                            <>
                                <Link href="/login"><Button variant="outlined" color="primary" size="small">Sign in</Button></Link>
                                <Link href="/register"><Button variant="contained" color="primary" size="small">Get started</Button></Link>
                            </>
                    }
                </Stack>
            </Toolbar>
        </AppBar>
    )
});

Header.displayName = 'Header';

export default Header