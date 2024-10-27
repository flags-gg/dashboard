import List from "./list";
import { getServerAuthSession } from "~/server/auth";
import {redirect} from "next/navigation";
import InfoBox from "./infobox";
import { type Metadata } from "next";
import { getProject } from "~/app/api/project/project";

export async function generateMetadata({params}: {params: Promise<{project_id: string}>}): Promise<Metadata> {
  const {project_id} = await params
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/api/auth/signin')
  }
  const projectInfo = await getProject(project_id)
  if (!projectInfo) {
    redirect('/projects')
  }

  return {
    title: `${projectInfo.name} Agents - Flags.gg`,
  }
}

export default async function ProjectPage({params}: {params: Promise<{project_id: string}>}) {
  const {project_id} = await params
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/api/auth/signin')
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
