import { redirect } from 'next/navigation'
import List from "./list";
import InfoBox from "./infobox";
import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Projects - Flags.gg",
}

export default async function ProjectsPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/')
  }

  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <h1 className={"text-2xl font-semibold"}>Projects</h1>
      </header>
      <List />
      <InfoBox />
    </div>
  )
}
