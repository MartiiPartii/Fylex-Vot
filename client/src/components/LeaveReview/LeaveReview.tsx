"use client"

import { Alert, Button, Card, IconButton, Rating, Snackbar, Stack, Typography } from "@mui/material"
import { MessageCircle } from "lucide-react"
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FormInputField from "~/components/FormInputField/FormInputField";
import Loader from "~/components/Loader/Loader";
import { useReviewForm } from "~/client/state/LeaveReview";

const LeaveReview = () => {
    const labels = ["Awful", "Not Great", "Okay", "Really Good", "Amazing"]
    const { open, setOpen, toast, setToast, stars, setStars, state, action, isPending } = useReviewForm()




    return (
        <>
            {isPending && <Loader />}

            <Snackbar
                open={toast}
                onClose={() => setToast(false)}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setToast(false)}
                    color="success"
                >
                    Review submitted successfully.
                </Alert>
            </Snackbar>

            <Card
                sx={{
                    textAlign: "start",
                    position: "fixed",
                    bottom: "1rem",
                    right: "1rem",
                    zIndex: 10,
                    display: open ? "block" : "none"
                }}
            >
                <Stack direction={"row"} gap={10} p={2} justifyContent={"space-between"} bgcolor="primary.main" color="primary.contrastText">
                    <Stack direction={"row"} alignItems={"center"} gap={1}>
                        <MessageCircle size={24} />
                        <Typography variant="body2" sx={{ color: "background.paper" }}>Give us some feedback</Typography>
                    </Stack>
                    <IconButton onClick={() => setOpen(false)} size="small" sx={{ width: "1.6rem", height: "1.6rem", color: "background.paper" }}><CloseOutlinedIcon sx={{ width: "100%" }} /></IconButton>
                </Stack>

                <form action={action}>
                    <Stack gap={3} px={2} py={3}>
                        <Stack alignItems={"center"} gap={0}>
                            <Rating
                                size="large"
                                value={stars}
                                onChange={(e, newValue) => setStars(newValue || 1)}
                            />
                            {stars && <Typography variant="body2">My experience was <Typography component="span" color="neutral" fontWeight={600}>{labels[stars - 1]}</Typography></Typography>}
                            {state?.error && <Typography variant="body2" fontStyle="italic" color="error">{state?.error || ""}</Typography>}
                        </Stack>

                        <FormInputField
                            label="Comment"
                            placeholder="Tell us more about your experience..."
                            multiline={true}
                            name="comment"
                            type="text"
                            rows={3}
                            required={false}
                        />

                        <Button size="small" type="submit" variant="contained" color="primary">Submit Review</Button>
                    </Stack>
                </form>
            </Card>
        </>
    )
}

export default LeaveReview