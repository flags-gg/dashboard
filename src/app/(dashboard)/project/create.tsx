"use client"

import {Button} from "~/components/ui/button";
import {type Session} from "next-auth";
import {useMemo, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import {getCompanyLimits} from "~/app/api/company/limits/limits";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {type IProject} from "~/lib/statemanager";
import {toast} from "~/hooks/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";

async function createProject(session: Session, name: string): Promise<IProject | Error> {
  try {
    const res = await fetch(`/api/project/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        sessionToken: session.user.access_token,
        userId: session.user.id,
      }),
      cache: "no-store",
    })
    if (!res.ok) {
      return new Error("Failed to create project")
    }

    return await res.json() as IProject
  } catch (e) {
    if (e instanceof Error) {
      return Error(`Failed to create project: ${e.message}`)
    } else {
      console.error(e)
    }
  }

  return new Error("Failed to create project")
}

export default function CreateProject({ session }: { session: Session }) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectsLeft, setProjectsLeft] = useState(0);
  const [projectInfo, setProjectInfo] = useState<IProject | null>(null);

  const FormSchema = z.object({
    projectName: z.string().min(2, {message: "Project Name is required a minimum of 2 characters"}),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {projectName: ""},
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsOpen(false)

    try {
      createProject(session, data.projectName).then((project) => {
        if (project instanceof Error) {
          throw new Error("Failed to create project")
        }
        setProjectInfo(project)
      }).catch((e) => {
        throw new Error(`Failed to create project: ${e}`)
      })
    } catch (e) {
      console.error(e)
      toast({
        title: "Failed to create project",
        description: "Failed to create project",
      })
    }

    toast({
      title: "Project Created",
      description: "Project has been created",
    })
  }

  if (projectInfo) {
    try {
      window.location.href = `/project/${projectInfo?.project_id}`
    } catch (e) {
      console.error(e)
      toast({
        title: "Failed to redirect",
        description: "Failed to redirect",
      })
    }
  }

  useMemo(() => {
    try {
      getCompanyLimits(session).then((companyLimits) => {
        if (companyLimits instanceof Error) {
          throw new Error("Failed to fetch company limits")
        }

        const allowed = companyLimits.projects.allowed;
        const used = companyLimits.projects.used;
        const projectsLeft = allowed - used;
        setProjectsLeft(projectsLeft);
      }).catch((e) => {
        if (e instanceof Error) {
          throw new Error(`Failed to fetch company limits: ${e.message}`);
        } else {
          console.error("failed to fetch company limits, create project", e);
        }
      })
    } catch (e) {
      console.error(e)
      toast({
        title: "Failed to fetch company limits",
        description: "Failed to fetch company limits",
      })
      return <></>
    }
  }, [session])

  if (projectsLeft <= 0) {
    return <></>
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>If you have the projects left you can add one.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"w-2/3 space-y-6"}>
            <FormField control={form.control} name={"projectName"} render={({field}) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder={"Project Name"} {...field} />
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
