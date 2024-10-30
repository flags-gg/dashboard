"use client"

import { useAtom } from "jotai";
import { environmentAtom, type IEnvironment } from "~/lib/statemanager";
import { useState } from "react";
import { CardTitle } from "~/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Pencil } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "~/hooks/use-toast";

async function updateEnvironmentName(environment_id: string, name: string, enabled: boolean): Promise<IEnvironment | Error> {
  try {
    const res = await fetch(`/api/environment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        environmentId: environment_id,
        enabled: enabled,
      }),
      cache: "no-store",
    })
    if (!res.ok) {
      return new Error("Failed to update environment name")
    }

    return await res.json() as IEnvironment
  } catch (e) {
    if (e instanceof Error) {
      return Error(`Failed to update environment name: ${e.message}`)
    } else {
      console.error("updateEnvironmentName", e)
    }
  }

  return new Error("Failed to update environment name")
}

export default function Name({environment_id}: {environment_id: string}) {
  const [environmentInfo, setEnvironmentInfo] = useAtom(environmentAtom)
  const [openEdit, setOpenEdit] = useState(false)

  const {toast} = useToast();

  const FormSchema = z.object({
    name: z.string().min(2, {message: "Name is required a minimum of 2 characters"}),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {name: environmentInfo.name},
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setOpenEdit(false)
    try {
      updateEnvironmentName(environment_id, data.name, environmentInfo.enabled).then(() => {
        setEnvironmentInfo({...environmentInfo, name: data.name})
        toast({
          title: "Environment Name Updated",
          description: "The environment name has been updated",
        })
      }).catch((e) => {
        console.error("try - Error updating environment name", e)
        throw new Error(e.message)
      })
    } catch (e) {
      console.error("Error updating environment name", e)

      toast({
        title: "Environment Name Error",
        description: "There was an error updating the environment name",
      })
    }
  }

  return (
    <CardTitle className={"group flex items-center gap-2 text-lg"}>
      {environmentInfo.name}
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
                  <FormLabel>Environment Name</FormLabel>
                  <FormControl>
                    <Input placeholder={"Environment Name"} {...field} />
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