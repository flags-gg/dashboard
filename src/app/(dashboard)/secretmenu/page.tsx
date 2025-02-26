import Maker from "./maker";
import InfoBox from "./info"
import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Secret Menu Builder - Flags.gg",
}

export default async function SecretMenuPage() {
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
        <h1 className="text-2xl font-semibold">Secret Menu Builder</h1>
      </header>
      <Maker menuId={""} />
      <InfoBox />
    </div>
  )
}
