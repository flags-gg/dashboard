"use client"

import {Button} from "~/components/ui/button";
import { agentAtom, environmentAtom, projectAtom } from "~/lib/statemanager";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger
} from "~/components/ui/alert-dialog";
import { useAtom } from "jotai";
import { useToast } from "~/hooks/use-toast";

export default function Guide() {
  const {toast} = useToast();

  const [selectedProject] = useAtom(projectAtom)
  const [selectedAgent] = useAtom(agentAtom)
  const [selectedEnvironment] = useAtom(environmentAtom)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className={"w-full"}>
          Client Settings
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
  )
}
