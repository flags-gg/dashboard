"use client"

import {type Session} from "next-auth";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";
import {Button} from "~/components/ui/button";
import {Pencil} from "lucide-react";
import {CardTitle} from "~/components/ui/card";
import {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";

const FormSchema = z.object({
  name: z.string().min(2, {message: "Name is required a minimum of 2 characters"}),
})

export default function Name({session, project_id, name}: {session: Session, project_id: string, name: string}) {
  const [projectName, setProjectName] = useState(name)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {name: projectName},
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setProjectName(data.name)
  }

  return (
    <CardTitle className={"group flex items-center gap-2 text-lg"}>
      {projectName}
      <Popover>
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
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder={"Project Name"} {...field} />
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
