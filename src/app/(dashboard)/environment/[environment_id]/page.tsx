import {authOptions} from "~/server/auth";
import {getServerSession} from "next-auth/next";
import {redirect} from "next/navigation";
import FlagsList from "./flags/list";
import InfoBox from "./infobox";
import { Metadata } from "next";
import { getEnvironment } from "~/app/api/environment/environment";

export async function generateMetadata({params}: {params: {environment_id: string}}): Promise<Metadata> {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }
  const environmentInfo = await getEnvironment(session, params.environment_id)
  if (!environmentInfo) {
    redirect('/projects')
  }

  return {
    title: `${environmentInfo.project_name}: ${environmentInfo.agent_name} - ${environmentInfo.name} Flags - Flags.gg`,
  }
}
export default async function EnvironmentPage({params}: {params: {environment_id: string}}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <>
      <header className={"col-span-2"}>
        <h1 className={"text-2xl font-semibold"}>Flags</h1>
      </header>
      <FlagsList session={session} environment_id={params.environment_id} />
      <InfoBox session={session} environment_id={params.environment_id} />
    </>
  )
}
