"use server"

import {SearchBox} from "./search";
import {UserNav} from "./userNav";
import BreadCrumbs from "./breadcrumbs";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { env } from "~/env";
import { ThemeChooser } from "./themeChooser";

export default async function HeaderBar() {
  const commitHash = env.COMMIT_HASH ?? "developmentHash"

  return (
    <header className={"sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-4"}>
      <SidebarTrigger />
      <BreadCrumbs commitHash={commitHash} />
      <SearchBox />
      <ThemeChooser />
      <UserNav />
    </header>
  )
}
