"use client"

import {Button} from "~/components/ui/button";
import {type Flag} from "~/lib/statemanager";
import {type Session} from "next-auth";
import {Pencil} from "lucide-react";
import {useState} from "react";
import {LoadingSpinner} from "~/components/ui/loader";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "~/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";

// TODO: edit flag
async function editFlagAction(session: Session, flag: Flag): Promise<null | Error> {
    console.log("edit", flag, session)

    return null
}

export function EditFlag({session, flag}: {session: Session, flag: Flag}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    const FormSchema = z.object({
        flagName: z.string().min(2, {message: "Flag Name requires a minimum of 2 characters"}),
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {flagName: flag.details.name},
    })

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        setLoading(true);
        flag.details.name = data.flagName

        try {
            editFlagAction(session, flag).then(() => {
                setLoading(false);
                router.refresh()
            }).catch((e) => {
                if (e instanceof Error) {
                    setError(e.message);
                    return
                }
                setError("Failed to edit flag");
                return
            })
        } catch (e) {
            console.error(e)
            setError("Failed to edit flag")
        } finally {
            setLoading(false);
        }

        form.reset()
        router.refresh()
    }

    if (loading) {
        return (
            <Button asChild size={'icon'} variant={"outline"} className={"bg-muted/10 border-0"} disabled={true}>
                <LoadingSpinner className={"h-5 w-5"} />
            </Button>
        )
    }

    if (error) {
        toast({
            title: "Failed to edit flag",
            description: "Failed to edit flag",
        })

        return (
            <Button disabled={true} asChild size={'icon'} variant={"outline"} className={"bg-muted/10 border-0 cursor-pointer"}>
                <Pencil className={"h-5 w-5"} />
            </Button>
        )
    }

    return (
      <Popover>
          <PopoverTrigger asChild>
              <Button asChild size={'icon'} variant={"outline"} className={"bg-muted/10 border-0 cursor-pointer"}>
                  <Pencil className={"h-5 w-5"} />
              </Button>
          </PopoverTrigger>
          <PopoverContent>
              <div className={"grid gap-4"}>
                  <div className={"space-y-2"}>
                      <h4 className={"font-medium leading-none"}>Flag Name</h4>
                      <p className={"text-sm text-muted-foreground"}>Set the flag name to something</p>
                  </div>
                  <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className={"grid gap-2"}>
                          <FormField control={form.control} name={"flagName"} render={({field}) => (
                            <FormItem className={"grid grid-cols-3 item-center gap-4"}>
                                <FormLabel className={"mt-4"}>Flag Name</FormLabel>
                                <FormControl>
                                    <Input placeholder={"Flag Name"} {...field} className={"col-span-2 h-8"} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                          )} />
                          <div className={"grid gap-2 mt-4"}>
                              <Button type={"submit"}>Save</Button>
                          </div>
                      </form>
                  </Form>
              </div>
          </PopoverContent>
      </Popover>
    )}