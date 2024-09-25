"use client"

import {Button} from "~/components/ui/button";
import {CardFooter} from "~/components/ui/card";
import {useFlags} from "@flags-gg/react-library";
import {Session} from "next-auth";

export default function InfoBox({session, menuId}: {session: Session, menuId: string}) {
    const {is} = useFlags()

    return (
        <CardFooter className={"p-3 border-t-2 items-center justify-center"}>
            {is("menu style")?.enabled() && <Button>Styling</Button>}
        </CardFooter>
    )
}