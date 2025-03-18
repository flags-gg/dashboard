import { Metadata } from "next";
import StepOne from "./stepone";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Flags.gg - Onboarding`,
  }
}

export default async function Onboarding() {
  const user = await currentUser();
  if (!user) {
    return (
      <div className={"flex justify-center"}>
        <SignIn />
      </div>
    )
  }

  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <h1 className={"text-2xl font-semibold"}>Onboarding</h1>
      </header>
      <StepOne />
    </div>
  )
}