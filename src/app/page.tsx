import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const {userId} = await auth();
  if (!userId) {
    return <div>Not Signed in</div>
  }

  return (
    <div className={"flex-col "}>
      <header className={"col-span-2"}>
        <h1 className={"text-2xl font-semibold"}>Dashboard</h1>
      </header>
      <div>Tester</div>
    </div>
  )
}
