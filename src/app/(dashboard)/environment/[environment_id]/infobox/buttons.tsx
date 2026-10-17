"use client"

import CreateFlag from "../flags/create";
import {CardFooter} from "~/components/ui/card";
import { useFlags } from "@flags-gg/react-library";
import { useAtom } from "jotai";
import { environmentAtom, projectAtom } from "~/lib/statemanager";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Code } from "lucide-react";
import { toast } from "sonner";

const copyAgentCode = (code: string) => {
  navigator.clipboard.writeText(code ?? "").then(() => {
    toast("Flags.gg Agent Code Copied", {
      description: "The Flags.gg agent code have been copied to your clipboard",
    })
  })
}

export default function InfoButtons({environmentId, agentId}: {environmentId: string; agentId: string}) {
  const {is} = useFlags();
  const [environmentInfo] = useAtom(environmentAtom)
  const [projectInfo] = useAtom(projectAtom)

  const code = `{
    environmentId: "${environmentInfo?.environment_id}",
    projectId: "${projectInfo?.project_id}",
    agentId: "${agentId}",
  }`

  return (
    <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center "}>
      <CreateFlag environment_id={environmentId} agent_id={agentId} />
      {is("view guide")?.enabled() && <Dialog>
        <DialogTrigger asChild>
          <Button variant={"secondary"}>
            <Code className={"size-6"} />
            <span className={"ml-2"}>View Configuration</span>
          </Button>
        </DialogTrigger>
        <DialogContent className={"w-full"}>
          <DialogHeader>
            <DialogTitle>Configuration</DialogTitle>
            <DialogDescription>
              <p className="mb-4">
                Use the following configuration to set up your Flags.gg
                provider:
              </p>
              <pre className={"bg-secondary rounded p-1"}>
                <code>
                  {`<FlagsProvider options={{\n`}
                  {`  projectId: "${projectInfo?.project_id}",\n`}
                  {`  agentId: "${agentId}",\n`}
                  {`  environmentId: "${environmentInfo?.environment_id}",\n`}
                  {`}}>\n`}
                  {`  {children}\n`}
                  {`</FlagsProvider>`}
                </code>
              </pre>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"ghost"} onClick={() => copyAgentCode(code)} className={"cursor-pointer"}>Copy Agent Code</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>}
    </CardFooter>
  );
}
