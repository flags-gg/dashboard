import Link from "next/link";
import Maker from "../maker";
import MenuActions from "./actions";
import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
import { getSecretMenu } from "~/app/api/secretmenu/data";
import { PageIntro } from "~/components/page-intro";
import { InfoBoxError } from "~/components/InfoBoxError";
import { logError } from "~/lib/logger";
import type { SecretMenu } from "~/lib/interfaces";

export const metadata: Metadata = {
  title: "Flags.gg - Secret Menu",
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

  let menu: SecretMenu
  try {
    menu = await getSecretMenu(menu_id)
  } catch (e) {
    logError(e)
    return <InfoBoxError name={"secret menu"} blurb={"Failed to load the secret menu"} />
  }

  const env = menu.environment_details
  return (
    <section>
      <PageIntro title={`${env.name} secret menu`}
        description={<>Testers type this sequence in your app to open a menu that overrides flags in{" "}
          <Link className="underline underline-offset-4 hover:text-foreground" href={`/environment/${env.environment_id}`}>{env.name}</Link>.</>}
        action={<MenuActions menu={menu} />} />
      <Maker menuId={menu_id} />
    </section>
  )
}
