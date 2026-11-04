import List from "./list";
import ProjectActions from "./actions";
import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
import { PageIntro } from "~/components/page-intro";

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
    <section>
      <PageIntro title="Projects" description="A project groups the agents (your apps) that read flags." action={<ProjectActions />} />
      <List />
    </section>
  )
}
