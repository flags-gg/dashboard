"use client"

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
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
import { useCloneEnvironment } from "~/hooks/use-clone-environment";
import { useRouter } from "next/navigation";
import { logError } from "~/lib/logger";

export default function CreateChild({envId, agentId}: {envId: string, agentId: string}) {
  const [openChild, setOpenChild] = useState(false);
  const createEnv = useCloneEnvironment();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsCreating(true);
    createEnv.mutate({
      agentId: agentId,
      environmentId: envId,
      name: data.name,
    }, {
      onSuccess: () => {
        setOpenChild(false);
        form.reset();
        toast("Child Environment Created", {
          description: "Child environment created successfully",
        });
        // Refresh the current route so the server component list re-fetches
        router.refresh();
        setIsCreating(false)
      },
      onError: (error) => {
        logError("Child environment failed to create", error);
        toast("Child Environment Failed", {
          description: error.message || "Child environment failed to create",
        });
        setIsCreating(false)
      },
    });
  }

  const FormSchema = z.object({
    name: z.string().trim().min(2, {message: "Name is required to be at least 2 characters"}).max(255),
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
        <Button variant={"outline"} className={"bg-muted/10 border-0 cursor-pointer ml-2"} size={"sm"}>
          <Plus className={"size-4"} aria-hidden="true" />
          Create child
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        {isCreating ? (
          <Button variant={"outline"} className={"bg-muted/10 border-0 ml-2"} disabled={true} size={"icon"}>
            <Loader2 />
          </Button>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"w-full space-y-6"}>
              <FormField control={form.control} name={"name"} render={({field}) => (
                <FormItem>
                  <FormLabel>Create Child Environment</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Copies all parent flags and their current enabled states. Future changes are promoted separately.
                  </p>
                  <FormControl>
                    <Input placeholder={"Environment Name"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type={"submit"} className={"cursor-pointer"} disabled={createEnv.isPending}>Create</Button>
            </form>
          </Form>
        )}
      </PopoverContent>
    </Popover>
  )
}
