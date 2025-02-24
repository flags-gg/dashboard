"use client"

import { SignIn, useUser } from "@clerk/nextjs";

export default function Home() {
  const {user} = useUser();

  console.info("userId", user)

  if (!user) {
    return (
      <div className={"flex justify-center"}>
        <SignIn />
      </div>
    )
  }

  return (
    <div className={"flex-col "}>
      <header className={"col-span-2"}>
        <h1 className={"text-2xl font-semibold"}>Dashboard</h1>
      </header>
      <div>Tester</div>
    </div>
  )
}
