import List from "./list";
import {redirect} from "next/navigation";
import InfoBox from "./infobox";
import { type Metadata } from "next";
import { getProject } from "~/app/api/project/project";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export async function generateMetadata({params}: {params: Promise<{project_id: string}>}): Promise<Metadata> {
  const {project_id} = await params
  const projectInfo = await getProject(project_id)
  if (!projectInfo) {
    redirect('/projects')
  }

  return {
    title: `Flags.gg - ${projectInfo.name} Agents`,
  }
}

export default async function ProjectPage({params}: {params: Promise<{project_id: string}>}) {
  const {project_id} = await params
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
        <h1 className={"text-2xl font-semibold"}>Project Agents</h1>
      </header>
      <List project_id={project_id} />
      <InfoBox project_id={project_id} />
    </div>
  );
}
