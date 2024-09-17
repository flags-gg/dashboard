"use client"

import {type Session} from "next-auth";
import CreateFlag from "./flags/create";
import {buttonVariants} from "~/components/ui/button";
import Guide from './guide';
// @ts-expect-error types missing
import {useFlags} from "@flags-gg/react-library";
import {CardFooter} from "~/components/ui/card";
import Link from "next/link";

export default function InfoButtons({session, environmentId, menuId}: {session: Session, environmentId: string, menuId: string}) {
  const {is} = useFlags();

  return (
    <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center"}>
      {is("createFlag").enabled() && <CreateFlag session={session} environment_id={environmentId} />}
      {is("viewGuide").enabled() && <Guide session={session} />}
      {is("secret menu").enabled() && (
        menuId ? (
          <Link className={buttonVariants({variant: "default"})} href={`/secretmenu/${menuId}`}>Secret Menu</Link>
        ) : (
          <Link className={buttonVariants({variant: "secondary"})} href={`/secretmenu/`}>Secret Menu</Link>
        )
      )}
    </CardFooter>
  );
}
