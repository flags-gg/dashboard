import {authOptions} from "~/server/auth";
import {getServerSession} from "next-auth/next";
import {redirect} from "next/navigation";
import Maker from "./maker";
import InfoBox from "./info"
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Secret Menu Builder - Flags.gg",
}

export default async function SecretMenuPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <>
      <header className="col-span-2">
        <h1 className="text-2xl font-semibold">Secret Menu Builder</h1>
      </header>
      <Maker menuId={""} />
      <InfoBox session={session} />
    </>
  )
}
