"use client"

import Link from "next/link";
import { useFlags } from "@flags-gg/react-library";
import CreateProject from "~/app/(dashboard)/project/create";
import { buttonVariants } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { useCompanyLimits } from "~/hooks/use-company-limits";

// Usage against the plan, then create (or raise limits once they are reached).
export default function ProjectActions() {
  const { is } = useFlags();
  const { data, isLoading, error } = useCompanyLimits();
  if (isLoading) return <Spinner />;
  if (error) return <span className="text-sm text-destructive">Couldn&apos;t load limits</span>;

  const allowed = data?.projects?.allowed ?? 0;
  const used = data?.projects?.used ?? 0;
  const full = allowed === 0 || used >= allowed;
  return (
    <>
      <span className="text-sm tabular-nums text-muted-foreground">{used} of {allowed} projects</span>
      {full || !is("create project")?.enabled()
        ? is("alter limits")?.enabled() && <Link className={buttonVariants({ variant: full ? "default" : "outline" })} href="/company/limits">Alter limits</Link>
        : <CreateProject />}
    </>
  );
}
