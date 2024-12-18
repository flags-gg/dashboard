"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { useFlags } from "@flags-gg/react-library";
import { useCompanyDetails } from "~/hooks/use-company-details";
import { useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { Skeleton } from "~/components/ui/skeleton";

import Plan from "./plan";
import DeleteCompany from "./delete"
import Details from "./details"

interface IError {
  message: string
  title: string
}

export default function Settings() {
  const {is} = useFlags();
  const {data: companyInfo, isLoading} = useCompanyDetails();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const {toast} = useToast();
  const [errorInfo, setErrorInfo] = useState({} as IError);
  const [showError, setShowError] = useState(false);


  if (!is("company settings")?.enabled()) {
    return <></>
  }

  if (isLoading) {
    return <Skeleton className="min-h-[10rem] min-w-fit rounded-xl" />
  }

  if (showError) {
    toast({
      title: errorInfo.title,
      description: errorInfo.message,
      duration: 5000,
    })
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
