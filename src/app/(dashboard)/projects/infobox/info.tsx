"use client"

import { type Session } from "next-auth";
import { useCompanyLimits } from "~/hooks/use-company-limits";
import { useToast } from "~/hooks/use-toast";
import { Skeleton } from "~/components/ui/skeleton";

export default function ProjectsInfo({ session }: { session: Session }) {
  const { data: companyLimits, isLoading, error } = useCompanyLimits(session);
  const { toast } = useToast();

  if (isLoading) {
    return <Skeleton className="h-[125px] w-[250px] rounded-xl" />
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