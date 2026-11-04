"use client"

import Link from "next/link";
import { useFlags } from "@flags-gg/react-library";
import CreateAgent from "~/app/(dashboard)/agent/create";
import { buttonVariants } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { useCompanyLimits } from "~/hooks/use-company-limits";
import { useProject } from "~/hooks/use-project";

export default function AgentActions({ project_id }: { project_id: string }) {
  const { is } = useFlags();
  const { data: limits, isLoading } = useCompanyLimits();
  const { data: project, isLoading: projectLoading } = useProject(project_id);
  if (isLoading || projectLoading) return <Spinner />;

  const allowed = limits?.agents?.allowed ?? 0;
  const used = project?.agents_used ?? 0;
  const full = allowed === 0 || used >= allowed;
  return (
    <>
      <span className="text-sm tabular-nums text-muted-foreground">{used} of {allowed} agents</span>
      {full || !is("create agent")?.enabled()
        ? is("update limits")?.enabled() && <Link className={buttonVariants({ variant: full ? "default" : "outline" })} href="/company/limits">Update limits</Link>
        : <CreateAgent project_id={project_id} />}
    </>
  );
}
