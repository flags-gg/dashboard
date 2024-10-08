"use client"

import { Button } from "~/components/ui/button";
import { type Session } from "next-auth";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type IProject } from "~/lib/statemanager";
import { toast } from "~/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useCompanyLimits } from '~/hooks/use-company-limits';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const createProject = async (session: Session, name: string): Promise<IProject> => {
  const res = await fetch(`/api/project/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return await res.json() as IProject;
};

const FormSchema = z.object({
  projectName: z.string().min(2, {message: "Project Name is required a minimum of 2 characters"}),
});

export default function CreateProject({ session }: { session: Session }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: companyLimits, isLoading, error } = useCompanyLimits(session);

  const createProjectMutation = useMutation({
    mutationFn: (name: string) => createProject(session, name),
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['companyLimits', session.user.id]}).catch(console.error);
      toast({
        title: "Project Created",
        description: "Project has been created",
      });
      window.location.href = `/project/${data.project_id}`;
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Failed to create project",
        description: "Failed to create project",
      });
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {projectName: ""},
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsOpen(false);
    createProjectMutation.mutate(data.projectName);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const projectsLeft = companyLimits?.projects?.allowed && companyLimits?.projects?.used ? companyLimits.projects.allowed - companyLimits.projects.used : 0;
  if (projectsLeft <= 0) {
    return null;
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
  );
}