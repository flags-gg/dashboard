"use client"

import { useAtom } from "jotai";
import { environmentAtom } from "~/lib/statemanager";
import { type Session } from "next-auth";
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
import Clone from "./clone"

export default function Name({session, environment_id}: {session: Session, environment_id: string}) {
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
    setEnvironmentInfo({...environmentInfo, name: data.name})
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
      <Clone session={session} environment_id={environment_id} />
    </CardTitle>
  )
}