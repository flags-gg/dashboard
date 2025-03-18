import List from "./list";
import InfoBox from "./infobox";
import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Flags.gg - Projects",
}

export default async function ProjectsPage() {
  const user = await currentUser();
  if (!user) {
    return (
      <div className={"flex justify-center"}>
        <SignIn />
      </div>
    )
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
