import { notFound } from "next/navigation";
import { StaffPanel, type StaffTab } from "~/components/staff/panel";
export default async function StaffTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  if (!["stats", "companies", "users", "operations"].includes(tab)) notFound();
  return <StaffPanel key={tab} tab={tab as StaffTab} />;
}
