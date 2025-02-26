import { type Metadata } from "next";
import ClientWrapper from "./clientWrapper";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "SecretMenu Style Builder - Flags.gg",
}

export default async function Styling({params}: {params: Promise<{menu_id: string}>}) {
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
    <>
      <header className="col-span-2">
        <h1 className="text-2xl font-semibold">Secret Menu Updater</h1>
      </header>
      <ClientWrapper menuId={menu_id} />
    </>
  )
}
