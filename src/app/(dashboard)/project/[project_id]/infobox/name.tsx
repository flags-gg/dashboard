"use client"

import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";
import {Button} from "~/components/ui/button";
import {Pencil} from "lucide-react";
import {CardTitle} from "~/components/ui/card";
import { useEffect, useState } from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {projectAtom} from "~/lib/statemanager";
import {useAtom} from "jotai";
import { useProject } from "~/hooks/use-project";
import { IProject } from "~/lib/interfaces";
import { toast } from "sonner";

async function updateProjectName(project_id: string, name: string, enabled: boolean): Promise<IProject | Error> {
  try {
    const res = await fetch(`/api/project/name`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        projectId: project_id,
        enabled: enabled,
      }),
      cache: "no-store",
    })
    if (!res.ok) {
      return new Error("Failed to update project name")
    }

    return await res.json() as IProject
  } catch (e) {
    if (e instanceof Error) {
      return Error(`Failed to update project name: ${e.message}`)
    } else {
      console.error("updateProjectName", e)
    }
  }

  return new Error("Failed to update project name")
}

export default function Name({project_id}: {project_id: string}) {
  const [projectInfo, setProjectInfo] = useAtom(projectAtom)
  const [projectName, setProjectName] = useState(projectInfo?.name ?? "Project Name")
  const [openEdit, setOpenEdit] = useState(false)
  const {data: projectData} = useProject(project_id)

  useEffect(() => {
    if (projectData) {
      setProjectName(projectData.name)
      setProjectInfo(projectData)
    }
  }, [projectData])

  const FormSchema = z.object({
    name: z.string().min(2, {message: "Name is required a minimum of 2 characters"}),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {name: projectName},
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setOpenEdit(false)
    form.reset()

    try {
      updateProjectName(project_id, data.name, projectInfo.enabled).then(() => {
        setProjectName(data.name)
        setProjectInfo({...projectInfo, name: data.name})
        toast("Project Name Updated", {
          description: "The project name has been updated",
        })
      }).catch((e) => {
        console.error("try - Error updating project name", e)
        throw new Error(e.message)
      })
    } catch (e) {
      console.error("Error updating project name", e)

      toast("Project Name Error", {
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
            <Pencil className={"size-5"} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"w-2/3 space-y-6"}>
              <FormField control={form.control} name={"name"} render={({field}) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder={projectName} {...field} />
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
