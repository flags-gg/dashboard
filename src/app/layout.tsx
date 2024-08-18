import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { type ReactNode } from "react";
import { Inter as FontSans } from "next/font/google"
import { cn } from "~/lib/utils"
import { ThemeProvider } from "~/components/theme-provider";
import { getServerAuthSession } from "~/server/auth";
import HeaderBar from "~/app/_components/HeaderBar";
import SideBar from "~/app/_components/SideBar";
import {TooltipProvider} from "~/components/ui/tooltip";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import QueryProvider from "./QueryProvider";

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
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme={"dark"} enableSystem disableTransitionOnChange>
          <QueryProvider>
            <TooltipProvider>
              {session ? (
                <div className="flex flex-col min-h-screen w-full">
                  <SideBar />
                  <div className={"flex flex-col sm:gap-4 sm:py-4 sm:pl-14"}>
                    <HeaderBar />
                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                      {children}
                    </main>
                  </div>
                </div>
              ) : (
                children
              )}
            </TooltipProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
