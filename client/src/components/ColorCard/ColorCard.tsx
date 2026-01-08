import { Card, CardProps } from "@mui/material"
import { ReactNode } from "react";
import { RiskColor } from "~/types/risk";

interface ColorCardProps {
    color?: RiskColor | string;
    children?: ReactNode;
    sx?: CardProps['sx'];
}

const ColorCard = ({ color = "secondary", children, sx = {} }: ColorCardProps) => {
    return (
        <Card
            sx={{
                border: `solid 1px`,
                borderColor: `${color}.border`,
                bgcolor: `${color}.transparent`,
                borderRadius: 1,
                color: `${color}.text`,
                boxShadow: "none",
                ...sx
            }}
        >
            {children}
        </Card>
    )
}

export default ColorCard