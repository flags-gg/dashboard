import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { staffAccess } from "~/server/staff";

export default async function StaffLayout({ children }: { children: ReactNode }) {
  const access = await staffAccess();
  if (access === "denied") notFound();
  if (access === "unavailable") return <p role="alert" className="p-6 text-sm text-destructive">Unable to verify staff access. Please try again shortly.</p>;
  return children;
}
