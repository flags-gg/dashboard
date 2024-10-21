import {redirect} from "next/navigation";

import { getServerAuthSession } from "~/server/auth"

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect('/login')
  }

  return (
    <div className={"flex-col "}>
      <header className={"col-span-2"}>
        <h1 className={"text-2xl font-semibold"}>Dashboard</h1>
      </header>
      <div>Tester</div>
    </div>
  )
}
