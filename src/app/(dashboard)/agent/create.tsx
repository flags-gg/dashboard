"use client"

import {Button} from "~/components/ui/button";
import { useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

async function createAgentAction(project_id: string, name: string): Promise<null | Error> {
  try {
    const res = await fetch(`/api/agent/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: project_id,
        name: name,
      }),
      cache: "no-store",
    })
    if (!res.ok) {
      return new Error("Failed to create agent")
    }

    return null
  } catch (e) {
    if (e instanceof Error) {
      return Error(`Failed to create agent: ${e.message}`)
    } else {
      console.error("createAgent", e)
    }
  }

  return Error("Failed to create agent")
}

export default function CreateAgent({ project_id }: { project_id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const {toast} = useToast()
  const router = useRouter()

  const formSchema = z.object({
    agentName: z.string().min(2, {message: "Agent Name is required a minimum of 2 characters"}),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {agentName: ""},
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsOpen(false)
    form.reset()

    createAgentAction(project_id, data.agentName).then(() => {
      toast({
        title: "Agent Created",
        description: "The agent has been created",
      })
      router.refresh()
    }).catch((e) => {
      if (e instanceof Error) {
        toast({
          title: "Failed to create agent",
          description: `Failed to create agent for reason: ${e.message}`,
        })
      }
      console.error("createAgent", e)
      toast({
        title: "Failed to create agent",
        description: "Failed to create agent for unknown reason",
      })
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Agent</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Agent</DialogTitle>
          <DialogDescription>Create a new agent for this project.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"w-2/3 space-y-6"}>
            <FormField control={form.control} name={"agentName"} render={({field}) => (
              <FormItem>
                <FormLabel>Agent Name</FormLabel>
                <FormControl>
                  <Input placeholder={"Agent Name"} {...field} />
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
