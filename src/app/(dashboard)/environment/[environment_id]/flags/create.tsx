"use client"

import {Button} from "~/components/ui/button";
import {type Session} from "next-auth";
import { useState } from "react";
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
import { agentAtom, type Flag } from "~/lib/statemanager";
import { toast } from "~/hooks/use-toast";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

async function createFlagAction(session: Session, environment_id: string, agent_id: string, name: string): Promise<Flag | Error> {
  try {
    const res = await fetch(`/api/flag/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        environment_id: environment_id,
        agent_id: agent_id,
        name: name,
        sessionToken: session.user.access_token,
        userId: session.user.id,
      }),
      cache: "no-store",
    })
    if (!res.ok) {
      return new Error("Failed to create flag")
    }

    return await res.json() as Flag
  } catch (e) {
    if (e instanceof Error) {
      return Error(`Failed to create flag: ${e.message}`)
    }
    console.error("createFlag", e)
  }

  return Error("Failed to create flag")
}

export default function CreateFlag({ session, environment_id }: { session: Session, environment_id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [agentInfo] = useAtom(agentAtom)
  const router = useRouter()

  const FormSchema = z.object({
    flagName: z.string().min(2, {message: "Name is required a minimum of 2 characters"}),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {flagName: ""},
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsOpen(false)

    try {
      createFlagAction(session, environment_id, agentInfo.agent_id, data.flagName).then((flag) => {
        if (flag instanceof Error) {
          throw new Error("Failed to create flag")
        }

        router.refresh()
      }).catch((e) => {
        throw new Error(`Failed to create flag: ${e}`)
      })
    } catch (e) {
      console.error(e)
      toast({
        title: "Failed to create flag",
        description: "Failed to create flag",
      })
    }

    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Flag</Button>
      </DialogTrigger>
      <DialogContent className={"sm:max-w-[425px]"}>
        <DialogHeader>
          <DialogTitle>Create Flag</DialogTitle>
          <DialogDescription>Create a new flag for this environment.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"w-2/3 space-y-6"}>
            <FormField control={form.control} name={"flagName"} render={({field}) => (
              <FormItem>
                <FormLabel>Flag Name</FormLabel>
                <FormControl>
                  <Input placeholder={"Flag Name"} {...field} />
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
