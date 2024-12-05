"use client"

import { Session } from "next-auth";
import { useUserDetails } from "~/hooks/use-user-details";
export default function User({session}: {session: Session}) {
  const {data: userData} = useUserDetails(session?.user?.id ?? "")

  console.info("userData-user", userData)

  return null
}