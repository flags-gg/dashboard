import { redirect } from "next/navigation";
import { Metadata } from "next";
import StepTwo from "./";
import { currentUser } from "@clerk/nextjs/server";

export async function generateMetadata(): Promise<Metadata> {
  const user = await currentUser();
  if (!user) {
    redirect('/')
  }

  return {
    title: `Onboarding - Flags.gg`,
  }
}

export default async function Onboarding() {
  const user = await currentUser();
  if (!user) {
    redirect('/')
  }

  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <h1 className={"text-2xl font-semibold"}>Onboarding</h1>
      </header>
      <StepTwo />
    </div>
  )
}