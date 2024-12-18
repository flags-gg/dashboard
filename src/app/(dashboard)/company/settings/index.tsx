"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useFlags } from "@flags-gg/react-library";

import Plan from "./plan";

import Details from "./details"

export default function Settings() {
  const {is} = useFlags();

  if (!is("company settings")?.enabled()) {
    return <></>
  }

  return (
    <Card>
      <CardHeader className={"pb-2"}>
        <CardTitle>Settings</CardTitle>
        <CardDescription>&nbsp;</CardDescription>
      </CardHeader>
      <CardContent className={"min-h-[7.2rem]"}>
        <Details />
        <Plan />
      </CardContent>
    </Card>
  )
}
