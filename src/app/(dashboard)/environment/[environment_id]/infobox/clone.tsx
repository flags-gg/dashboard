"use client"

import { agentAtom, environmentAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";
import { useFlags } from "@flags-gg/react-library";
import { toast } from "sonner";

async function cloneEnvironmentAction(environment_id: string, agent_id: string, name: string): Promise<null | Error> {
  try {
    const res = await fetch(`/api/environment/clone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        environmentId: environment_id,
        agentId: agent_id,
        name: name,
      }),
      cache: "no-store",
    })
    if (!res.ok) {
      return new Error("Failed to clone environment")
    }

    return null
  } catch (e) {
    if (e instanceof Error) {
      return Error(`Failed to clone environment: ${e.message}`)
    } else {
      console.error("cloneEnvironment", e)
    }
  }

  return Error("Failed to clone environment")
}

export default function Clone({environment_id}: {environment_id: string}) {
  const [environmentInfo] = useAtom(environmentAtom)
  const [agentInfo] = useAtom(agentAtom)
  const [openClone, setOpenClone] = useState(false);
  const router = useRouter()
  const {is} = useFlags();

  const FormSchema = z.object({
    name: z.string().min(2, {message: "Name is required a minimum of 2 characters"}),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {name: `Clone of ${environmentInfo.name} - ${new Date(Date.now()).toISOString()}`},
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setOpenClone(false)
    cloneEnvironmentAction(environment_id, agentInfo.agent_id, data.name).then(() => {
      toast("Environment Cloned", {
        description: "The environment has been cloned",
      })
      router.push(`/agent/${agentInfo.agent_id}?ts=${Date.now()}`)
    }).catch((e) => {
      throw new Error(`Failed to clone environment: ${e}`)
    })
  }

  if (!is("clone env")?.enabled()) {
    return <></>
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <Dialog open={openClone} onOpenChange={setOpenClone}>
          <DialogTrigger asChild>
            <Copy className={"size-5 mt-1.5"} />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clone Environment {environmentInfo.name}</DialogTitle>
              <DialogDescription>What is the clone name?</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className={"w-2/3 space-y-6"}>
                <FormField control={form.control} name={"name"} render={({field}) => (
                  <FormItem>
                    <FormLabel>Environment Name</FormLabel>
                    <FormControl>
                      <Input placeholder={"Environment Name"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type={"submit"}>Clone</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </TooltipTrigger>
      <TooltipContent sideOffset={4}>Clone Environment</TooltipContent>
    </Tooltip>
  )
}