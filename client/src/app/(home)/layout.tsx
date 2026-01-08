import React from "react";
import Header from "~/components/Header/Header";
import { isAuthenticated } from "~/utils/authentication";

export const dynamic = 'force-dynamic'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuth = await isAuthenticated()

  return (
    <>
      <Header isAuth={isAuth} />
      {children}
    </>
  )
}