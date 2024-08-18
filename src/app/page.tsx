import {redirect} from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import Dashboard from "~/app/(dashboard)/page";

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect('/login')
  }

  return <Dashboard />
}
