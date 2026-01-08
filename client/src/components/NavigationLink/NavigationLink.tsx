"use client"

import { Button, ButtonProps } from "@mui/material"
import Link from "next/link"
import { usePathname } from 'next/navigation'

interface NavigationLinkProps {
    to: string;
    label: string;
    props?: ButtonProps;
}

const NavigationLink = ({ to = "/", label = "", props = {} }: NavigationLinkProps) => {
    const location = usePathname()

    return (
        <Button
            component={Link}
            href={to}
            size="small"
            color="primary"
            variant={location === to ? "contained" : "text"}
            sx={{
                fontSize: { xs: '0.7rem', sm: '0.815rem' },
                padding: { xs: `0.35rem 0.5rem`, sm: `0.35rem 0.75rem` }
            }}
            {...props}
        >
            {label}
        </Button>
    )
}

export default NavigationLink