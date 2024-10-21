import {authOptions} from "~/server/auth";
import {getServerSession} from "next-auth/next";
import {redirect} from "next/navigation";
import InfoBox from "./infobox";
import Maker from "../maker";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "SecretMenu Builder - Flags.gg",
}

export default async function SecretMenuSpecificPage({params}: {params: {menu_id: string}}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <h1 className={"text-2xl font-semibold"}>Secret Menu Updater</h1>
      </header>
      <Maker menuId={params.menu_id} />
      <InfoBox menu_id={params.menu_id} />
    </div>
  )
}
