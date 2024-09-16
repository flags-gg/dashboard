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
import {IProject, projectAtom} from "~/lib/statemanager";
import {useAtom} from "jotai";
import {useToast} from "~/hooks/use-toast";

const FormSchema = z.object({
  name: z.string().min(2, {message: "Name is required a minimum of 2 characters"}),
})

async function updateProjectName(session: Session, project_id: string, name: string): Promise<IProject | Error> {
  try {
    const res = await fetch(`/api/project//name`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        sessionToken: session.user.access_token,
        userId: session.user.id,
        projectId: project_id,
      }),
      cache: "no-store",
    })
    if (!res.ok) {
      return new Error("Failed to update project name")
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await res.json()
  } catch (e) {
    return Error("Failed to update project name")
  }
}

export default function Name({session, project_id, name}: {session: Session, project_id: string, name: string}) {
  const [projectName, setProjectName] = useState(name)
  const [projectInfo, setProjectInfo] = useAtom(projectAtom)
  const [openEdit, setOpenEdit] = useState(false)
  const {toast} = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {name: projectName},
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setOpenEdit(false)

    try {
      updateProjectName(session, project_id, data.name).then(() => {
        setProjectName(data.name)
        setProjectInfo({...projectInfo, name: data.name})
        toast({
          title: "Project Name Updated",
          description: "The project name has been updated",
        })
      }).catch((e) => {
        console.info("try - Error updating project name", e)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
        throw new Error(e.message)
      })
    } catch (e) {
      console.info("Error updating project name", e)

      toast({
        title: "Project Name Error",
        description: "There was an error updating the project name",
      })
    }
  }

  return (
    <CardTitle className={"group flex items-center gap-2 text-lg"}>
      {projectName}
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
