"use client"

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { CornerRightDown } from "lucide-react";
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
import { toast } from "sonner";
import { useCreateEnvironment } from "~/hooks/use-create-environment";

export default function CreateChild({envId, agentId}: {envId: string, agentId: string}) {
  const [openChild, setOpenChild] = useState(false);
  const createEnv = useCreateEnvironment();

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    createEnv.mutate({
      agentId: agentId,
      parentId: envId,
      name: data.name,
    }, {
      onSuccess: () => {
        setOpenChild(false);
        form.reset();
        toast("Child Environment Created", {
          description: "Child environment created successfully",
        });
      },
      onError: (error) => {
        console.error("Child environment failed to create", error);
        toast("Child Environment Failed", {
          description: "Child environment failed to create",
        });
      },
    });
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
            <Button type={"submit"} className={"cursor-pointer"} disabled={createEnv.isPending}>Create</Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}