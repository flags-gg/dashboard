"use client"

import { type Session } from "next-auth";
import { useFlags } from "@flags-gg/react-library";
import { CardFooter } from "~/components/ui/card";
import Link from "next/link";
import CreateProject from "~/app/(dashboard)/project/create";
import { buttonVariants } from "~/components/ui/button";
import { useCompanyLimits } from "~/hooks/use-company-limits";
import { useToast } from "~/hooks/use-toast";
import { NewLoader } from "~/components/ui/new-loader";

export default function InfoButtons({ session }: { session: Session }) {
  const { is } = useFlags();
  const { toast } = useToast();
  const { data: companyLimits, isLoading, error } = useCompanyLimits(session);

  if (!session) {
    throw new Error('No session found');
  }

  if (isLoading) {
    return (
      <CardFooter className="p-3 border-t-2 gap-2 items-center justify-center">
        <NewLoader />
      </CardFooter>
    )
  }

  if (error) {
    toast({
      title: "Error loading company limits",
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
      {is("create project")?.enabled() && <CreateProject session={session} />}
      {is("alter limits")?.enabled() && <Link className={buttonVariants({variant: "default"})} href="/company/limits">Alter Limits</Link>}
    </CardFooter>
  );
}