import {authOptions} from "~/server/auth";
import {getServerSession} from "next-auth/next";
import {redirect} from "next/navigation";
import Maker from "./maker";

export default async function SecretMenuPage({params}: {params: {menu_id: string}}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <>
      <header className="col-span-2">
        <h1 className="text-2xl font-semibold">Secret Menu Builder</h1>
      </header>
      <Maker session={session} menuId={""} />
    </>
  )
}
