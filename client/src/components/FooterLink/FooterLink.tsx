import { Typography } from "@mui/material"
import Link from "next/link"

interface FooterLinkProps {
    to: string;
    label: string;
}

const FooterLink = ({ to = "", label = "" }: FooterLinkProps) => {
    return (
        <Link href={to}>
            <Typography
                variant="body1"
                sx={{
                    transition: ".2s",
                    "&:hover": {
                        color: "primary.contrastText"
                    }
                }}
            >
                {label}
            </Typography>
        </Link>
    )
}

export default FooterLink