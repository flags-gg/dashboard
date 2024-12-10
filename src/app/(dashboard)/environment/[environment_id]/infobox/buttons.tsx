"use client"

import CreateFlag from "../flags/create";
import {buttonVariants, Button} from "~/components/ui/button";
import Guide from './guide';
import {useFlags} from "@flags-gg/react-library";
import {CardFooter} from "~/components/ui/card";
import Link from "next/link";
import { useAtom } from "jotai";
import { agentAtom, environmentAtom, projectAtom } from "~/lib/statemanager";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger
} from "~/components/ui/alert-dialog";
export default function InfoButtons({environmentId, menuId}: {environmentId: string, menuId: string}) {
  const {is} = useFlags();
  const {toast} = useToast();

  const [selectedProject] = useAtom(projectAtom)
  const [selectedAgent] = useAtom(agentAtom)
  const [selectedEnvironment] = useAtom(environmentAtom)

  return (
    <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center "}>
      <CreateFlag environment_id={environmentId} />
      {is("view guide")?.enabled() && <Guide />}
      {menuId ? (
        <Link className={buttonVariants({variant: "default"})} href={`/secretmenu/${menuId}`}>Secret Menu</Link>
      ) : (
        <Link className={buttonVariants({variant: "secondary"})} href={`/secretmenu/`}>Secret Menu</Link>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className={"w-full"}>
            Flags.gg Settings
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Flags.gg Settings</AlertDialogTitle>
            <AlertDialogDescription className={"text-sm bg-amber-50 text-black p-2 rounded-md"}>
              <code>
                <span>{`const flagConfig = {`}</span><br />
                <span>&nbsp;&nbsp;{`projectId: "${selectedProject?.project_id ?? "undefined"}",`}</span><br />
                <span>&nbsp;&nbsp;{`agentId: "${selectedAgent?.agent_id ?? "undefined"}",`}</span><br />
                <span>&nbsp;&nbsp;{`environmentId: "${selectedEnvironment?.environment_id ?? "undefined"}",`}</span><br />
                <span>{`}`}</span>
              </code>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
           <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              navigator.clipboard.writeText(`const flagConfig = {\n\tprojectId: "${selectedProject?.project_id ?? "undefined"}",\n\tagentId: "${selectedAgent?.agent_id ?? "undefined"}",\n\tenvironmentId: "${selectedEnvironment?.environment_id ?? "undefined"},\n}"`)
              toast({
                title: "Flags.gg Settings Copied",
                description: "The Flags.gg settings have been copied to your clipboard",
              })
            }}>Copy</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardFooter>
  );
}

import { Separator } from "~/components/ui/separator";
import { useToast } from "~/hooks/use-toast";
