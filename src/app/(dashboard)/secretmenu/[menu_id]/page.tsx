import InfoBox from "./infobox";
import Maker from "../maker";
import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Flags.gg - SecretMenu Builder",
}

export default async function SecretMenuSpecificPage({params}: {params: Promise<{menu_id: string}>}) {
  const {menu_id} = await params
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
        <h1 className={"text-2xl font-semibold"}>Secret Menu Updater</h1>
      </header>
      <Maker menuId={menu_id} />
      <InfoBox menu_id={menu_id} />
    </div>
  )
}
