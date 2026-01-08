import { SvgIconProps } from "@mui/material"
import React, { HTMLInputTypeAttribute } from "react"
import { ServerActionResponse } from "~/types/app"

export type FormInput = {
    label: string,
    placeholder: string,
    name: string,
    type: HTMLInputTypeAttribute,
    Icon?: React.ComponentType<SvgIconProps>,
    multiline?: boolean,
    rows?: number,
    required?: boolean
}

export type RedirectObject = {
    text: string,
    label: string,
    to: string
}

export type AuthFormProps = {
    title: string,
    description: string,
    inputs: FormInput[],
    buttonLabel: string,
    handleSubmit: (previousState: any, formData: FormData) => Promise<ServerActionResponse<unknown>>,
    link: RedirectObject
}