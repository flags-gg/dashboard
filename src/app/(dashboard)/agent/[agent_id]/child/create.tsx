"use client"

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { CornerDownRight, CornerRightDown } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";

export default function CreateChild() {
  const [openChild, setOpenChild] = useState(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setOpenChild(false)
    form.reset()
    // try {
    //   updateAgentName(agent_id, data.name, agentInfo.enabled).then(() => {
    //     setAgentInfo({ ...agentInfo, name: data.name })
    //     setAgentName(data.name)
    //     toast("Agent name updated", {
    //       description: "Agent name updated successfully",
    //     })
    //   }).catch((e) => {
    //     if (e instanceof Error) {
    //       toast("Error updating agent name", {
    //         description: `There was an error updating the agent name: ${e.message}`,
    //       })
    //     }
    //
    //     throw new Error("Failed to update agent name")
    //   })
    // } catch (e) {
    //   console.error("Error updating agent name", e)
    //
    //   toast("Error updating agent name", {
    //     description: "There was an unknown error updating the agent name",
    //   })
    // }
  }

  const FormSchema = z.object({
    name: z.string().min(2, {message: "Name is required to be at least 2 characters"}),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      name: "Production",
    },
    resolver: zodResolver(FormSchema),
  });

  return (
    <Popover open={openChild} onOpenChange={setOpenChild}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className={"bg-muted/10 border-0 cursor-pointer ml-2"} size={"icon"}>
          <CornerRightDown className={"size-5"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"w-full space-y-6"}>
            <FormField control={form.control} name={"name"} render={({field}) => (
              <FormItem>
                <FormLabel>Create Child Environment</FormLabel>
                <FormControl>
                  <Input placeholder={"Environment Name"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type={"submit"} className={"cursor-pointer"}>Create</Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}