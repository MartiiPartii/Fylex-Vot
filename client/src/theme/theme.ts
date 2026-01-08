"use client"
import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
    interface Palette {
        neutral: Palette['primary'];
        border: Palette['primary'];
    }
    interface PaletteOptions {
        neutral?: PaletteOptions['primary'];
        border?: PaletteOptions['primary'];
    }

    interface PaletteColor {
        transparent?: string;
        border?: string;
        text?: string;
        chip?: string;
        secondary?: string;
    }

    interface SimplePaletteColorOptions {
        transparent?: string;
        border?: string;
        text?: string;
        chip?: string;
        secondary?: string;
    }
}

let theme = createTheme({
    cssVariables: true,
    shape: {
        borderRadius: "0.75rem"
    } as any, // Cast to any to avoid "Type 'string' is not assignable to type 'number'" for borderRadius if strict
    typography: {
        fontFamily: 'var(--font-inter)',
        h1: { fontWeight: 700, fontSize: "3rem" },
        h2: { fontWeight: 700, fontSize: "1.875rem" },
        h3: { fontWeight: 700, fontSize: "1.5rem" },
        h4: { fontWeight: 700, fontSize: "1.125rem" },
        h5: { fontWeight: 700, fontSize: "1rem" },
        body1: { fontSize: "1rem" },
        body2: { fontSize: "0.875rem" }
    },
    palette: {
        background: {
            default: "#f9fafb", // Use "default" instead of "main" for background
            paper: "#fff"       // Use "paper" instead of "secondary"
        },
        primary: {
            main: "#000",
            contrastText: "#fff",
            dark: "#000"
        },
        secondary: {
            main: "#2563eb",
            border: "#bfdbfe",
            text: "#2563eb",
            transparent: "#eff6ff"
        },
        neutral: {
            main: "#000",
            secondary: "#333333ff",
            light: "#737373" as string,
            chip: "#e5e7eb"
        },
        success: {
            main: "#16a249",
            transparent: "#f0fdf4"
        },
        warning: {
            main: "#e7b008",
            border: "#fef08a",
            text: "#ca8a04",
            transparent: "#fefce8"
        },
        error: {
            main: "#dc2626",
            border: "#fecaca",
            text: "#b91c1c",
            transparent: "#fef2f2"
        },
        border: {
            main: "#d1d5db",
            secondary: "#9ca3af"
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none"
                },
                sizeMedium: ({ theme }) => ({
                    padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
                    fontSize: "1rem"
                }),
                sizeSmall: ({ theme }) => ({
                    padding: `${theme.spacing(0.7)} ${theme.spacing(1.5)}`
                }),
                outlinedPrimary: ({ theme }) => ({
                    border: `solid 2px ${theme.palette.primary.main}`
                }),
                containedPrimary: ({ theme }) => ({
                    background: `linear-gradient(135deg, ${theme.palette.neutral.main}, ${theme.palette.neutral.secondary})`
                })
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    background: theme.palette.background.paper,
                    padding: `${theme.spacing(0)} ${theme.spacing(2)}`,
                    [theme.breakpoints.up('sm')]: {
                        padding: `${theme.spacing(0)} ${theme.spacing(6)}`
                    }
                })
            }
        },
        MuiPaper: {
            styleOverrides: {
                elevation1: {
                    boxShadow: "0 1px 2px 0 hsl(0 0% 0% / 0.05)"
                }
            }
        },
        MuiInput: {
            styleOverrides: {
                input: ({ theme }) => ({
                    "&::placeholder": {
                        color: "red"
                    }
                })
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1)"
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600
                },
                colorSuccess: ({ theme }) => ({
                    background: theme.palette.success.transparent,
                    color: theme.palette.success.main
                }),
                colorWarning: ({ theme }) => ({
                    background: theme.palette.warning.transparent,
                    color: theme.palette.warning.main
                }),
                colorError: ({ theme }) => ({
                    background: theme.palette.error.transparent,
                    color: theme.palette.error.main
                }),
                colorSecondary: ({ theme }) => ({
                    background: theme.palette.secondary.transparent,
                    color: theme.palette.secondary.main
                }),
                sizeSmall: ({ theme }) => ({
                    padding: `${theme.spacing(1)} ${theme.spacing(1)}`,
                    fontSize: "0.75rem"
                })
            }
        }
    }
})



theme = createTheme(theme, {
    typography: {
        body1: { color: theme.palette.neutral.light },
        body2: { color: theme.palette.neutral.light }
    }
})



export default theme