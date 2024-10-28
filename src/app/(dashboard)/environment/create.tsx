"use client"

import {Button} from "~/components/ui/button";
import { useState } from "react";
import { useAtom } from "jotai";
import { agentAtom } from "~/lib/statemanager";
import { useToast } from "~/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAgent } from "~/hooks/use-agent";

async function createEnvironmentAction(agent_id: string, name: string): Promise<null | Error> {
  try {
    const res = await fetch(`/api/environment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentId: agent_id,
        name: name,
      }),
      cache: "no-store",
    })
    if (!res.ok) {
      return new Error("Failed to create environment")
    }

    return null
  } catch (e) {
    if (e instanceof Error) {
      return Error(`Failed to create environment: ${e.message}`)
    } else {
      console.error("createEnvironment", e)
    }
  }
  return Error("Failed to create environment")
}

export default function CreateEnvironment({agent_id}: {agent_id: string}) {
  const [isOpen, setIsOpen] = useState(false);
  const {toast} = useToast()
  const router = useRouter()
  const {data: agentInfo} = useAgent(agent_id)

  const FormSchema = z.object({
    environmentName: z.string().min(2, {message: "Environment Name is required a minimum of 2 characters"}),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {environmentName: ""},
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsOpen(false)

    try {
      createEnvironmentAction(agent_id, data.environmentName).then(() => {
        toast({
          title: "Environment Created",
          description: "The environment has been created",
        })
        router.refresh()
      }).catch((e) => {
        throw new Error(`Failed to create environment: ${e}`)
      })
    } catch (e) {
      console.error(e)
      toast({
        title: "Failed to create environment",
        description: "Failed to create environment",
      })
    }

    form.reset()
  }

  if (!agentInfo) {
    return null
  }

  if (!agentInfo?.environments || agentInfo?.environment_limit <= agentInfo?.environments.length) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Environment</Button>
      </DialogTrigger>
      <DialogContent className={"sm:max-w-[425px]"}>
        <DialogHeader>
          <DialogTitle>Create Environment</DialogTitle>
          <DialogDescription>Create a new environment for this agent.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"w-2/3 space-y-6"}>
            <FormField control={form.control} name={"environmentName"} render={({field}) => (
              <FormItem>
                <FormLabel>Environment Name</FormLabel>
                <FormControl>
                  <Input placeholder={"Environment Name"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type={"submit"}>Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
