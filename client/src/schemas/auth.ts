import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
    rememberMe: z.string().optional(),
});

export const RegisterSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string(),
    rememberMe: z.string().optional(),
});

export const ReviewSchema = z.object({
    stars: z.number().min(1).max(5),
    comment: z.string().optional(),
});

