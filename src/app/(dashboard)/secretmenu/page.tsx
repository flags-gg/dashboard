import { getServerAuthSession } from "~/server/auth";
import {redirect} from "next/navigation";
import Maker from "./maker";
import InfoBox from "./info"
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Secret Menu Builder - Flags.gg",
}

export default async function SecretMenuPage() {
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <h1 className="text-2xl font-semibold">Secret Menu Builder</h1>
      </header>
      <Maker menuId={""} />
      <InfoBox />
    </div>
  )
}
