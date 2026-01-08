// Server Action Response Types
export type ServerActionResponse<T = unknown> =
    | { success: true; data: T; error?: never }
    | { success: false; data?: never; error: string };

