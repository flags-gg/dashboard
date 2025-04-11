"use client"

import React from "react";
import Info from "./info";
import { StyleProvider } from "./context";
import PageContainer from "./pageContainer";
import { useStyles } from "~/hooks/use-styles";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";

type ClientWrapperProps = {
  menuId: string;
};

function StyleWrapper({ menuId }: ClientWrapperProps) {
  const { data, isLoading, error } = useStyles(menuId);

  if (isLoading) {
    return <Skeleton className="h-[125px] w-[250px] rounded-xl" />;
  }

  if (error) {
    toast("Error loading styles", {
      description: "Please try again later.",
    });
    return <div className="col-span-2 gap-3">Error loading styles</div>;
  }

  if (!data) {
    throw new Error("No data returned");
  }

  return (
    <StyleProvider initialStyles={data.styles}>
      <PageContainer />
      <Info menuId={menuId} />
    </StyleProvider>
  );
}

export default function ClientWrapper({ menuId }: ClientWrapperProps) {
  return <StyleWrapper menuId={menuId} />
}