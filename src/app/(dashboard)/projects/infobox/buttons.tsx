"use client"

import { useFlags } from "@flags-gg/react-library";
import { CardFooter } from "~/components/ui/card";
import Link from "next/link";
import CreateProject from "~/app/(dashboard)/project/create";
import { buttonVariants } from "~/components/ui/button";
import { useCompanyLimits } from "~/hooks/use-company-limits";
import { NewLoader } from "~/components/ui/new-loader";
import { toast } from "sonner";

export default function InfoButtons() {
  const { is } = useFlags();
  const { data: companyLimits, isLoading, error } = useCompanyLimits();

  if (isLoading) {
    return (
      <CardFooter className="p-3 border-t-2 gap-2 items-center justify-center">
        <NewLoader />
      </CardFooter>
    )
  }

  if (error) {
    toast("Error loading company limits", {
      description: "Please try again later.",
    });
    return <CardFooter className="p-3 border-t-2 gap-2 items-center justify-center">Error loading limits</CardFooter>;
  }

  const projectsAllowed = companyLimits?.projects?.allowed ?? 0;
  const projectsUsed = companyLimits?.projects?.used ?? 0;

  if (projectsAllowed === 0 || projectsUsed >= projectsAllowed) {
    return (
      <CardFooter className="p-3 border-t-2 gap-2 items-center justify-center">
        <Link className={buttonVariants({variant: "default"})} href="/company/limits">Alter Limits</Link>
      </CardFooter>
    );
  }


  return (
    <CardFooter className="p-3 border-t-2 gap-2 items-center justify-center">
      {is("create project")?.enabled() && <CreateProject />}
      {is("alter limits")?.enabled() && <Link className={buttonVariants({variant: "default"})} href="/company/limits">Alter Limits</Link>}
    </CardFooter>
  );
}