import Link from "next/link";
import Maker from "./maker";
import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
import { PageIntro } from "~/components/page-intro";

export const metadata: Metadata = {
  title: "Flags.gg - New Secret Menu",
}

export default async function SecretMenuPage({searchParams}: {searchParams: Promise<{environment?: string}>}) {
  const {environment} = await searchParams
  const user = await currentUser();
  if (!user) {
    return (
      <div className={"flex justify-center"}>
        <SignIn />
      </div>
    )
  }

  return (
    <section>
      <PageIntro title="New secret menu"
        description={<>Pick the key sequence testers type in your app to open a menu that overrides flags.
          {environment && <>{" "}<Link className="underline underline-offset-4 hover:text-foreground" href={`/environment/${environment}`}>Back to the environment</Link></>}</>} />
      <Maker menuId={""} environmentId={environment} />
    </section>
  )
}
