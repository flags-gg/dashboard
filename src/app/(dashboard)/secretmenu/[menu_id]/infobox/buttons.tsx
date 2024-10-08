"use client"

import {CardFooter} from "~/components/ui/card";
import { buttonVariants } from "~/components/ui/button";
import Link from "next/link";
import { useFlags } from "@flags-gg/react-library";

export default function InfoBox({menuId}: {menuId: string}) {
  const {is} = useFlags()

  return (
    <CardFooter className={"p-3 border-t-2 items-center justify-center"}>
      {is("menu style")?.enabled() && <Link className={buttonVariants({variant: "default"})} href={`/secretmenu/${menuId}/styling`}>Styling</Link>}
    </CardFooter>
  )
}