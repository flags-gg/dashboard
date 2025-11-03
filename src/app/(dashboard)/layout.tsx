import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getUserDetailsServer } from "~/server/get-user-details"; // should return { onboarded: boolean }
import {ReactNode} from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const details = await getUserDetailsServer();
  if (!details?.onboarded) redirect("/onboarding");

  return <>{children}</>;
}