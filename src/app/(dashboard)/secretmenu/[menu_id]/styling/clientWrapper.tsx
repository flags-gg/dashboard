"use client"

import React from 'react';
import Container from "./container";
import Info from "./info";
import { type Session } from "next-auth";
import { StyleProvider } from "./context";

type ClientWrapperProps = {
  session: Session;
  menuId: string;
};

export default function ClientWrapper({ session, menuId }: ClientWrapperProps) {
  return (
    <StyleProvider>
      <Container session={session} menuId={menuId} />
      <Info />
    </StyleProvider>
  );
}