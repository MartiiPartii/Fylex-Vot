import { z } from "zod";

// Auth Response Schema
export const AuthResponseSchema = z.object({
    token: z.string(),
    user: z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
    }),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
