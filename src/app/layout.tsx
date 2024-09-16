import "~/styles/globals.css";
import "@uploadthing/react/styles.css"

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { type ReactNode } from "react";
import { Inter as FontSans } from "next/font/google"
import { cn } from "~/lib/utils"
import { getServerAuthSession } from "~/server/auth";
import HeaderBar from "~/app/_components/HeaderBar";
import SideBar from "~/app/_components/SideBar";
import {TooltipProvider} from "~/components/ui/tooltip";
import QueryProvider from "~/components/QueryProvider";
import {NextSSRPlugin} from "@uploadthing/react/next-ssr-plugin";
import {extractRouterConfig} from "uploadthing/server";
import {ourFileRouter} from "~/app/api/uploadthing/core";
import {Toaster} from "~/components/ui/toaster";

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

  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <QueryProvider>
          <TooltipProvider>
            {session ? (
              <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
                <SideBar />
                <div className={"flex flex-col sm:gap-4 sm:py-4 sm:pl-14"}>
                  <HeaderBar />
                  <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3" suppressHydrationWarning={true}>
                    {children}
                  </main>
                  <Toaster />
                </div>
              </div>
            ) : (
              children
            )}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
