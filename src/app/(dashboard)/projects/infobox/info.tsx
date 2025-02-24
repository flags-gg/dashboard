"use client"

import { useCompanyLimits } from "~/hooks/use-company-limits";
import { useToast } from "~/hooks/use-toast";
import { Skeleton } from "~/components/ui/skeleton";
import { agentAtom, environmentAtom, projectAtom, secretMenuAtom } from "~/lib/statemanager";
import { useEffect } from "react";
import { useResetAtom } from "jotai/utils";

export default function ProjectsInfo() {
  const { data: companyLimits, isLoading, error } = useCompanyLimits();
  const { toast } = useToast();

  // reset selected state
  const resetProject = useResetAtom(projectAtom);
  const resetAgent = useResetAtom(agentAtom);
  const resetEnvironment = useResetAtom(environmentAtom);
  const resetSecretMenu = useResetAtom(secretMenuAtom);
  useEffect(() => {
    resetProject();
    resetAgent();
    resetEnvironment();
    resetSecretMenu();
  }, [resetProject, resetAgent, resetEnvironment, resetSecretMenu]);


  if (isLoading) {
    return <Skeleton className="min-h-[10rem] min-w-fit rounded-xl" />
  }

  if (error) {
    toast({
      title: "Error loading projects",
      description: "Please try again later.",
    });

    return (
      <div className="grid gap-3">
        <ul className="grid gap-3">
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Max Allowed Projects</span>
            <span>0</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Projects Used</span>
            <span>0</span>
          </li>
        </ul>
      </div>
    );
  }

  const projectsAllowed = companyLimits?.projects?.allowed ?? 0;
  const projectsUsed = companyLimits?.projects?.used ?? 0;

  return (
    <div className="grid gap-3">
      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Max Allowed Projects</span>
          <span>{projectsAllowed}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Projects Used</span>
          <span>{projectsUsed}</span>
        </li>
      </ul>
    </div>
  );
}