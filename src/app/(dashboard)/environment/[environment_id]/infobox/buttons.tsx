"use client"

import CreateFlag from "../flags/create";
import {CardFooter} from "~/components/ui/card";

export default function InfoButtons({environmentId}: {environmentId: string}) {
  return (
    <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center "}>
      <CreateFlag environment_id={environmentId} />
    </CardFooter>
  );
}
