import {authOptions} from "~/server/auth";
import {getServerSession} from "next-auth/next";
import {redirect} from "next/navigation";
import FlagsList from "./flags/list";
import InfoBox from "./infobox";
import { type Metadata } from "next";
import { getEnvironment } from "~/app/api/environment/environment";

export async function generateMetadata({params}: {params: {environment_id: string}}): Promise<Metadata> {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  const { data: environmentInfo, error } = await getEnvironment(params.environment_id)

  if (error ?? !environmentInfo) {
    console.error('Failed to fetch environment:', error)
  }

  return {
    title: `${environmentInfo?.project_name}: ${environmentInfo?.agent_name} - ${environmentInfo?.name} Flags - Flags.gg`,
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
      <FlagsList environment_id={params.environment_id} />
      <InfoBox environment_id={params.environment_id} />
    </>
  )
}