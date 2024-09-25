import {authOptions} from "~/server/auth";
import {getServerSession} from "next-auth/next";
import {redirect} from "next/navigation";
import FlagsList from "./flags/list";
import InfoBox from "./infobox";


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
