"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { useFlags } from "@flags-gg/react-library";

import Plan from "./plan";
import DeleteCompany from "./delete"
import Details from "./details"

export default function Settings() {
  const {is} = useFlags();

  if (!is("company settings")?.enabled()) {
    return <></>
  }

  return (
    <Card>
      <CardHeader className={"pb-2"}>
        <CardTitle className={"text-lg font-medium"}>Settings</CardTitle>
        <CardDescription className={"text-sm text-gray-500"}>Manage your company settings</CardDescription>
      </CardHeader>
      <CardContent className={"min-h-[7.2rem]"}>
        <Details />
        <Plan />
      </CardContent>
      <CardFooter>
        <DeleteCompany />
      </CardFooter>
    </Card>
  )
}
