import AccountForm from "./accountForm";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import InfoBox from "./infobox";

export default async function AccountPage() {
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <h1 className={"text-2xl font-semibold"}>User Account</h1>
      </header>
      <AccountForm session={session} />
      <InfoBox />
    </div>
  )
}
