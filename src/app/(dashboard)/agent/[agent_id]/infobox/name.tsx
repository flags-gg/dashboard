"use client"

import { useState } from "react";
import { agentAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import { useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CardTitle } from "~/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Pencil } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

async function updateAgentName(agent_id: string, name: string, enabled: boolean): Promise<null | Error> {
  try {
    const res = await fetch(`/api/agent/name`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        agentId: agent_id,
        enabled: enabled,
      }),
      cache: "no-store",
    })
    if (!res.ok) {
      return new Error("Failed to update agent name")
    }
    return null
  } catch (e) {
    if (e instanceof Error) {
      return Error(`Failed to update agent name: ${e.message}`)
    } else {
      console.error("updateAgentName", e)
    }
  }

  return new Error("Failed to update agent name")
}

export default function Name({agent_id, name}: {agent_id: string, name: string}) {
  const [agentName, setAgentName] = useState(name);
  const [agentInfo, setAgentInfo] = useAtom(agentAtom)
  const [openEdit, setOpenEdit] = useState(false);
  const {toast} = useToast()

  const FormSchema = z.object({
    name: z.string().min(2, {message: "Name is required to be at least 2 characters"}),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      name: agentInfo.name,
    },
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setOpenEdit(false)
    form.reset()
    try {
      updateAgentName(agent_id, data.name, agentInfo.enabled).then(() => {
        setAgentInfo({ ...agentInfo, name: data.name })
        setAgentName(data.name)
        toast({
          title: "Agent name updated",
          description: "Agent name updated successfully",
        })
      }).catch((e) => {
        if (e instanceof Error) {
          toast({
            title: "Error updating agent name",
            description: `There was an error updating the agent name: ${e.message}`,
          })
        }

        throw new Error("Failed to update agent name")
      })
    } catch (e) {
      console.error("Error updating agent name", e)

      toast({
        title: "Agent name error",
        description: "There was an unknown error updating the agent name",
      })
    }
  }

  return (
    <CardTitle className={"group flex items-center gap-2 text-lg"}>
      {agentName}
      <Popover open={openEdit} onOpenChange={setOpenEdit}>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className={"bg-muted/10 border-0"} size={"icon"}>
            <Pencil className={"h-5 w-5"} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"w-2/3 space-y-6"}>
              <FormField control={form.control} name={"name"} render={({field}) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input placeholder={"Agent Name"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type={"submit"}>Save</Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </CardTitle>
  )
}