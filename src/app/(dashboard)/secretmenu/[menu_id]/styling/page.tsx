import {authOptions} from "~/server/auth";
import {getServerSession} from "next-auth/next";
import {redirect} from "next/navigation";
import { type Metadata } from "next";
import ClientWrapper from "./clientWrapper";

export const metadata: Metadata = {
  title: "SecretMenu Style Builder - Flags.gg",
}

export default async function Styling({params}: {params: {menu_id: string}}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <>
      <header className="col-span-2">
        <h1 className="text-2xl font-semibold">Secret Menu Updater</h1>
      </header>
      <ClientWrapper session={session} menuId={params.menu_id} />
    </>
  )
}
