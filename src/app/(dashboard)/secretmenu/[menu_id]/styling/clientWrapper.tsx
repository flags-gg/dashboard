"use client"

import React from 'react';
import Info from "./info";
import { type Session } from "next-auth";
import { StyleProvider } from "./context";
import PageContainer from "./pageContainer";

type ClientWrapperProps = {
  session: Session;
  menuId: string;
};

export default function ClientWrapper({ session, menuId }: ClientWrapperProps) {
  return (
    <StyleProvider>
      <PageContainer session={session} menuId={menuId} />
      <Info session={session} menuId={menuId} />
    </StyleProvider>
  );
}