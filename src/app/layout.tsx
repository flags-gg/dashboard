import "~/styles/globals.css";
import "@uploadthing/react/styles.css"

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { type ReactNode } from "react";
import { Inter as FontSans } from "next/font/google"
import { cn } from "~/lib/utils"
import { getServerAuthSession } from "~/server/auth";
import HeaderBar from "~/app/components/HeaderBar";
import SideBar from "~/app/components/SideBar";
import {TooltipProvider} from "~/components/ui/tooltip";
import ClientProvider from "~/components/ClientProvider";
import {NextSSRPlugin} from "@uploadthing/react/next-ssr-plugin";
import {extractRouterConfig} from "uploadthing/server";
import {ourFileRouter} from "~/app/api/uploadthing/core";
import {Toaster} from "~/components/ui/toaster";
import { env } from "~/env";
import { SidebarProvider } from "~/components/ui/sidebar";
import CompanyDetector from "~/app/components/CompanyDetector";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Flags.gg",
  description: "Feature Flag Service",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await getServerAuthSession();
  const flagConfig = {
    projectId: env.NEXT_PUBLIC_FLAGS_PROJECT ?? "",
    agentId: env.NEXT_PUBLIC_FLAGS_AGENT ?? "",
    environmentId: env.NEXT_PUBLIC_FLAGS_ENVIRONMENT ?? "",
  }

  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ClientProvider flagConfig={flagConfig}>
            <TooltipProvider>
              {session ? (
                <div className="relative flex min-h-screen flex-col bg-muted/40">
                  <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
                  <SidebarProvider>
                    <SideBar />
                    <div className={"flex flex-col sm:py-4 size-full"}>
                      <CompanyDetector />
                      <HeaderBar />
                      <main className="flex-1 size-full p-4" suppressHydrationWarning={true}>
                        {children}
                      </main>
                      <Toaster />
                    </div>
                  </SidebarProvider>
                </div>
              ) : (
                children
              )}
            </TooltipProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
