import FlagsList from "./flags/list";
import InfoBox from "./infobox";
import { type Metadata } from "next";
import { getEnvironment } from "~/app/api/environment/environment";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export async function generateMetadata({params}: {params: Promise<{environment_id: string}>}): Promise<Metadata> {
  const {environment_id} = await params
  const { data: environmentInfo, error } = await getEnvironment(environment_id)

  if (error ?? !environmentInfo) {
    console.error('Failed to fetch environment:', error)
  }

  return {
    title: `Flags.gg - ${environmentInfo?.project_name}: ${environmentInfo?.agent_name} - ${environmentInfo?.name} Flags`,
  }
}

export default async function EnvironmentPage({params}: {params: Promise<{environment_id: string}>}) {
  const {environment_id} = await params
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
        <h1 className={"text-2xl font-semibold"}>Flags</h1>
      </header>
      <FlagsList environment_id={environment_id} />
      <InfoBox environment_id={environment_id} />
    </div>
  )
}