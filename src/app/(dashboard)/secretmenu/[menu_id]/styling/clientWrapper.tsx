"use client"

import React, { useState } from "react";
import Info from "./info";
import { type Session } from "next-auth";
import { StyleProvider } from "./context";
import PageContainer from "./pageContainer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStyles } from "~/hooks/use-styles";
import { useToast } from "~/hooks/use-toast";

type ClientWrapperProps = {
  session: Session;
  menuId: string;
};

function StyleWrapper({ session, menuId }: ClientWrapperProps) {
  const { data, isLoading, error } = useStyles(session, menuId);
  const { toast } = useToast();

  if (isLoading) {
    return <div className="col-span-2 gap-3">Loading...</div>;
  }

  if (error) {
    toast({
      title: "Error loading styles",
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
      <Info session={session} menuId={menuId} />
    </StyleProvider>
  );
}

export default function ClientWrapper({ session, menuId }: ClientWrapperProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <StyleWrapper session={session} menuId={menuId} />
    </QueryClientProvider>
  );
}