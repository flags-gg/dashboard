"use client"

import { useEffect, useState } from "react";
import { agentAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CardTitle } from "~/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Pencil } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useAgent } from "~/hooks/use-agent";
import {toast} from "sonner";
import { Spinner } from "~/components/ui/spinner";

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

export default function Name({agent_id}: {agent_id: string}) {
  const [agentName, setAgentName] = useState("Agent Name");
  const [agentInfo, setAgentInfo] = useAtom(agentAtom)
  const [openEdit, setOpenEdit] = useState(false);

  const {data: agentData, isLoading} = useAgent(agent_id)
  useEffect(() => {
    if (agentData) {
      setAgentName(agentData.name)
      setAgentInfo(agentData)
    }
  }, [agentData])

  const FormSchema = z.object({
    name: z.string().min(2, {message: "Name is required to be at least 2 characters"}),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      name: agentName,
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
        toast("Agent name updated", {
          description: "Agent name updated successfully",
        })
      }).catch((e) => {
        if (e instanceof Error) {
          toast("Error updating agent name", {
            description: `There was an error updating the agent name: ${e.message}`,
          })
        }

        throw new Error("Failed to update agent name")
      })
    } catch (e) {
      console.error("Error updating agent name", e)

      toast("Error updating agent name", {
        description: "There was an unknown error updating the agent name",
      })
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <CardTitle className={"group flex items-center gap-2 text-lg"}>
      {agentName}
      <Popover open={openEdit} onOpenChange={setOpenEdit}>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className={"bg-muted/10 border-0"} size={"icon"}>
            <Pencil className={"size-5"} />
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