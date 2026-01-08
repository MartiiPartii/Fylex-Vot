import { Box, Stack, Typography } from "@mui/material"

const Loader = () => {
    return (
        <Stack position={"fixed"} top={0} left={0} zIndex={15} gap={3} justifyContent={"center"} alignItems={"center"} width={"100%"} height={"100vh"} bgcolor="background.default">
            <Typography variant="h4">Loading...</Typography>
            <Box className="loader"></Box>
        </Stack>
    )
}

export default Loader