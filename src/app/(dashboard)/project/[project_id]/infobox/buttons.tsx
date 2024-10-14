"use client"

import { CardFooter } from "~/components/ui/card";
import CreateAgent from "~/app/(dashboard)/agent/create";
import { useAtom } from "jotai";
import { type Session } from "next-auth";
import { projectAtom } from "~/lib/statemanager";
import { useToast } from "~/hooks/use-toast";
import { useFlags } from "@flags-gg/react-library";
import { useCompanyLimits } from "~/hooks/use-company-limits";
import { buttonVariants } from "~/components/ui/button";
import Link from "next/link";

export default function InfoButtons({ session }: { session: Session }) {
  const [projectInfo] = useAtom(projectAtom);
  const { is } = useFlags();
  const { toast } = useToast();
  const { data: companyLimits, isLoading, error } = useCompanyLimits(session);

  if (!session) {
    throw new Error('No session found');
  }

  if (isLoading) {
    return <CardFooter className="p-3 border-t-2 gap-2 items-center justify-center">Loading...</CardFooter>;
  }

  if (error) {
    toast({
      title: "Error loading company limits",
      description: "Please try again later.",
    });
    return <CardFooter className="p-3 border-t-2 gap-2 items-center justify-center">Error loading limits</CardFooter>;
  }

  const maxAgents = companyLimits?.agents?.allowed ?? 0;
  const usedAgents = companyLimits?.agents?.used?.find(project => project.project_id === projectInfo.project_id)?.used ?? 0;

  if (maxAgents === 0 || usedAgents >= maxAgents) {
    return (
      <CardFooter className="p-3 border-t-2 gap-2 items-center justify-center">
        {is("update limits")?.enabled() && <Link className={buttonVariants({variant: "default"})} href="/company/limits">Update Limits</Link>}
      </CardFooter>
    );
  }

  return (
    <CardFooter className="p-3 border-t-2 gap-2 items-center justify-center">
      {is("create agent")?.enabled() && <CreateAgent project_id={projectInfo.project_id} />}
      {is("update limits")?.enabled() && <Link className={buttonVariants({variant: "default"})} href="/company/limits">Update Limits</Link>}
    </CardFooter>
  );
}