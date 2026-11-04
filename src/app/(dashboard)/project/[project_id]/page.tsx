import List from "./list";
import {redirect} from "next/navigation";
import InfoBox from "./infobox";
import { type Metadata } from "next";
import { getProject } from "~/app/api/project/project";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
import AgentActions from "./actions";
import { PageIntro } from "~/components/page-intro";
import { PageTabs } from "~/components/page-tabs";

export async function generateMetadata({params}: {params: Promise<{project_id: string}>}): Promise<Metadata> {
  const {project_id} = await params
  const projectInfo = await getProject(project_id)
  if (projectInfo instanceof Error) {
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
    <PageTabs tabs={[
      { value: "agents", label: "Agents", content: <>
        <PageIntro title="Agents" description="Agents are the apps that read flags; each has its own chain of environments." action={<AgentActions project_id={project_id} />} />
        <List project_id={project_id} />
      </> },
      { value: "settings", label: "Project settings", content: <div className="max-w-md"><InfoBox project_id={project_id} /></div> },
    ]} />
  );
}
