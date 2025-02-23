import AccountForm from "./accountForm";
import { redirect } from "next/navigation";
import InfoBox from "./infobox";
import { currentUser } from "@clerk/nextjs/server";

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/')
  }

  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <h1 className={"text-2xl font-semibold"}>User Account</h1>
      </header>
      <AccountForm />
      <InfoBox />
    </div>
  )
}
