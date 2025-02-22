import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { type ReactNode } from "react";
import { Inter as FontSans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs";

import { cn } from "~/lib/utils"
import HeaderBar from "~/components/HeaderBar";
import SideBar from "~/components/SideBar";
import {TooltipProvider} from "~/components/ui/tooltip";
import ClientProvider from "~/components/ClientProvider";
import {NextSSRPlugin} from "@uploadthing/react/next-ssr-plugin";
import {extractRouterConfig} from "uploadthing/server";
import {ourFileRouter} from "~/app/api/uploadthing/core";
import {Toaster} from "~/components/ui/toaster";
import { env } from "~/env";
import { SidebarProvider } from "~/components/ui/sidebar";
import OnboardCheck from "~/components/OnboardCheck";

import "~/styles/globals.css";
import "@uploadthing/react/styles.css"

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
  const flagConfig = {
    projectId: env.NEXT_PUBLIC_FLAGS_PROJECT ?? "",
    agentId: env.NEXT_PUBLIC_FLAGS_AGENT ?? "",
    environmentId: env.NEXT_PUBLIC_FLAGS_ENVIRONMENT ?? "",
  }

  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ClerkProvider>
          <ClientProvider flagConfig={flagConfig}>
            <TooltipProvider>
              <div className="relative flex min-h-screen flex-col bg-muted/40">
                <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
                <OnboardCheck />
                <SidebarProvider>
                  <SideBar />
                  <div className={"flex flex-col sm:py-4 size-full"}>
                    <HeaderBar />
                    <main className="flex-1 size-full p-4" suppressHydrationWarning={true}>
                      {children}
                    </main>
                    <Toaster />
                  </div>
                </SidebarProvider>
              </div>
            </TooltipProvider>
          </ClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
