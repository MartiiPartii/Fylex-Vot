"use server"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { cookies } from "next/headers"

export const getCookieStore = async (): Promise<ReadonlyRequestCookies> => {
    const cookieStore = await cookies()
    return cookieStore
}

export const getToken = async (): Promise<string | null> => {
    const cookieStore = await getCookieStore()
    const token = await cookieStore.get("token")
    return token?.value || null
}

export const isAuthenticated = async (): Promise<boolean> => {
    const token = await getToken()
    return token ? true : false
}