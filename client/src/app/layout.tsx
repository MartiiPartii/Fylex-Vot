import { Inter, Reddit_Mono } from "next/font/google"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from "@mui/material/styles";
import theme from "~/theme/theme";
import "~/app/global.css"
import { Box } from "@mui/material";
import Footer from "~/components/Footer/Footer";
import { Metadata } from "next";
import React from "react";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter"
})

const reddit = Reddit_Mono({
    subsets: ["latin"],
    variable: "--font-reddit-mono"
})

export const metadata: Metadata = {
    title: 'Fylex | AI-Powered Document Security & Fraud Detection',
    description: 'Fylex is an AI-powered document security platform that scans PDFs and documents to detect fraud, assess risk, and highlight suspicious content for safe, secure files.',

    icons: {
        icon: [
            {
                media: "(prefers-color-scheme: light)",
                url: "/meta/icon-light.png",
                href: "/meta/icon-light.png",
            },
            {
                media: "(prefers-color-scheme: dark)",
                url: "/meta/icon-dark.png",
                href: "/meta/icon-dark.png",
            }
        ]
    },

    twitter: {
        card: "summary_large_image",
        title: "Fylex | AI-Powered Document Security & Fraud Detection",
        description: "Fylex scans PDFs and documents with AI to detect fraud, assess risk, and highlight suspicious content for safe, secure files.",
        images: ['https://fylex-client-test.onrender.com/meta/social.png']
    },

    openGraph: {
        title: "Fylex | AI-Powered Document Security & Fraud Detection",
        description: "Fylex scans PDFs and documents with AI to detect fraud, assess risk, and highlight suspicious content for safe, secure files.",
        type: "website",
        url: "https://fylex-client-test.onrender.com/",
        images: [{
            url: 'https://fylex-client-test.onrender.com/meta/social.png',
            width: 1200,
            height: 630,
        }]
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true
        }
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${reddit.variable}`}>
            <body>
                <div id="root">
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
                                <Box sx={{ bgcolor: "background.default" }}>
                                    {children}
                                    <Footer />
                                </Box>
                            </GoogleOAuthProvider>
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </div>
            </body>
        </html>
    )
}