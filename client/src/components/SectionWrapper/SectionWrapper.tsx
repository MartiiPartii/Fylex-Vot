import { Box, Breakpoint, Container, ContainerProps } from "@mui/material"
import React from "react"

const SectionWrapper = ({ maxWidth = "lg", props = {}, children } : { maxWidth?: Breakpoint, props?: ContainerProps, children: React.ReactNode }) => {
    return (
        <Container component={Box} disableGutters maxWidth={maxWidth} {...props} px={{ xs: 2, sm: 4 }}>
            {children}
        </Container>
    )
}

export default SectionWrapper