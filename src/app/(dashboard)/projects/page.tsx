import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "~/server/auth"
import List from "./list";
import InfoBox from "./infobox";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Flags.gg",
}

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <>
      <header className={"col-span-2"}>
        <h1 className={"text-2xl font-semibold"}>Projects</h1>
      </header>
      <List />
      <InfoBox />
    </>
  )
}
