"use client"

import { IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { FormInput } from "~/types/form";
import { usePasswordVisibility } from "~/client/state/FormInputField";

const FormInputField = ({
    label,
    placeholder,
    name,
    type = "text",
    Icon,
    multiline = false,
    rows = 1,
    required = false
}: FormInput) => {
    const inputProps = {
        style: {
            fontSize: "0.875rem"
        }
    }

    const { showPassword, togglePasswordVisibility } = usePasswordVisibility()

    return (
        <Stack gap={1} textAlign={"start"}>
            {
                label &&
                <Typography variant="body2" color="neutral" fontWeight={500}>{label}</Typography>
            }

            <TextField
                placeholder={placeholder}
                size="small"
                name={name}
                inputProps={inputProps}
                type={type === "password" ? showPassword ? "text" : "password" : type}
                autoComplete={type === "password" ? "on" : "off"}
                multiline={multiline}
                rows={rows}
                required={required}
                slotProps={{
                    input: {
                        startAdornment: (
                            Icon ?
                                <InputAdornment
                                    position="start"
                                >
                                    <Icon sx={{ width: "1rem", height: "1rem" }} />
                                </InputAdornment>
                                :
                                null
                        ),
                        endAdornment: type === "password" ? (
                            <InputAdornment
                                position="end"
                            >
                                <IconButton
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <VisibilityOffOutlinedIcon sx={{ width: "1rem", height: "1rem" }} /> : <VisibilityOutlinedIcon sx={{ width: "1rem", height: "1rem" }} />}
                                </IconButton>
                            </InputAdornment>
                        ) : (<></>)
                    }
                }}
            />
        </Stack>
    )
}

export default FormInputField