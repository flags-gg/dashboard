"use client"

import {Button} from "~/components/ui/button";
import {CardFooter} from "~/components/ui/card";
import {useFlags} from "@flags-gg/react-library";
import {type Session} from "next-auth";

// TODO: styling creator
export default function InfoBox({session, menuId}: {session: Session, menuId: string}) {
    const {is} = useFlags()
    console.log("menuId", menuId, session)

    return (
        <CardFooter className={"p-3 border-t-2 items-center justify-center"}>
            {is("menu style")?.enabled() && <Button>Styling</Button>}
        </CardFooter>
    )
}