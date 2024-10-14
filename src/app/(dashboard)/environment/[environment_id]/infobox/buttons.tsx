"use client"

import CreateFlag from "../flags/create";
import {buttonVariants} from "~/components/ui/button";
import Guide from './guide';
import {useFlags} from "@flags-gg/react-library";
import {CardFooter} from "~/components/ui/card";
import Link from "next/link";

export default function InfoButtons({environmentId, menuId}: {environmentId: string, menuId: string}) {
  const {is} = useFlags();

  return (
    <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center"}>
      {is("create flag")?.enabled() && <CreateFlag environment_id={environmentId} />}
      {is("view guide")?.enabled() && <Guide />}
      {is("secret menu")?.enabled() && (
        menuId ? (
          <Link className={buttonVariants({variant: "default"})} href={`/secretmenu/${menuId}`}>Secret Menu</Link>
        ) : (
          <Link className={buttonVariants({variant: "secondary"})} href={`/secretmenu/`}>Secret Menu</Link>
        )
      )}
    </CardFooter>
  );
}
