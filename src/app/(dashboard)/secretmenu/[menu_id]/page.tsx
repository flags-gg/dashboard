import {authOptions} from "~/server/auth";
import {getServerSession} from "next-auth/next";
import {redirect} from "next/navigation";
import InfoBox from "./infoBox";
import Index from "../maker";

export default async function SecretMenuSpecificPage({params}: {params: {menu_id: string}}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <>
      <header className="col-span-2">
        <h1 className="text-2xl font-semibold">Secret Menu Updater</h1>
      </header>
      <Index session={session} />
      <InfoBox session={session} menu_id={params.menu_id} />
    </>
  )
}
