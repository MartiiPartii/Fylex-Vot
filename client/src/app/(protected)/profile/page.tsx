import { Divider, Grid, Typography } from "@mui/material"
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper"
import AccountOverview from "~/components/AccountOverview/AccountOverview";
import { authGetProfile, statsGet } from "~/infrastructure/external";
import ProfileHeading from "~/components/ProfileHeading/ProfileHeading";
import LogoutButton from "~/components/LogoutButton/LogoutButton";
import { Twemoji } from 'react-emoji-render';

export const metadata = {
    title: "Profile | Fylex"
}

// Mark route as dynamic since it uses cookies() for authentication
export const dynamic = 'force-dynamic';

import { User, Stats } from "~/types";

const Profile = async () => {
    // Fetching the data
    let data: User | null = null
    let pfp = "/images/blank-pfp.webp"
    try {
        data = await authGetProfile();
        pfp = data.profileUrls || pfp;
    } catch (error: any) {
        // Handle error if needed
        console.error("Failed to fetch profile:", error);
    }

    // Fetching the stats
    let stats: Stats | null = null
    let isStatError = false
    let statError: string | null = null
    try {
        stats = await statsGet();
    } catch (error: any) {
        isStatError = true
        statError = error?.message || "We couldn't fetch your statistics. Please try again."
    }


    return (
        <SectionWrapper props={{
            sx: { paddingTop: 8, paddingBottom: 8, minHeight: "100vh" }
        }}>
            <Typography variant="h2" mb={1}><Twemoji text="Profile Settings 👤" /></Typography>
            <Typography variant="body1" mb={6}>Manage your account settings and security preferences</Typography>

            <Grid container spacing={8} mb={3}>
                <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                    <Typography variant="h3" mb={0.5}>Personal Information</Typography>
                    <Typography variant="body2" mb={3}>Update your personal details and contact information</Typography>

                    <ProfileHeading pfp={pfp} firstName={data?.firstName} lastName={data?.lastName} />

                    <Divider />

                    <Grid mt={2} container spacing={{ xs: 1, sm: 0 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography mb={{ xs: 0, sm: 1 }} variant="body2">Full Name</Typography>
                            <Typography variant="body2" color="neutral">{data?.firstName} {data?.lastName}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography mb={{ xs: 0, sm: 1 }} variant="body2">Email Address</Typography>
                            <Typography variant="body2" color="neutral">{data?.email}</Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <AccountOverview stats={stats || undefined} isError={isStatError} error={statError || "We couldn't fetch your statistics. Please try again."} />
            </Grid>

            <LogoutButton />
        </SectionWrapper>
    )
}

export default Profile