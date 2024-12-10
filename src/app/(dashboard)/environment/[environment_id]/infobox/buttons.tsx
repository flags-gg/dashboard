"use client"

import CreateFlag from "../flags/create";
import Guide from './guide';
import {useFlags} from "@flags-gg/react-library";
import {CardFooter} from "~/components/ui/card";

export default function InfoButtons({environmentId}: {environmentId: string}) {
  const {is} = useFlags();

  return (
    <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center "}>
      <CreateFlag environment_id={environmentId} />
      {is("view guide")?.enabled() && <Guide />}
    </CardFooter>
  );
}
