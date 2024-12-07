import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Metadata } from "next";
import StepOne from "./stepOne";

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/api/auth/signin')
  }

  return {
    title: `Onboarding - Flags.gg`,
  }
}

export default async function Onboarding() {
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <h1 className={"text-2xl font-semibold"}>Onboarding</h1>
      </header>
      <StepOne session={session} />
    </div>
  )
}