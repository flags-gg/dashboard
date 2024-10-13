import {redirect} from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env";

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect('/login')
  }

  console.info("env", env)

  return (
    <>Dashboard</>
  )
}
