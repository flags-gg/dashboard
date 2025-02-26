"use client"

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type ReactNode, useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import {FlagsProvider} from "@flags-gg/react-library";
import { env } from "~/env";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ClientProvider({ children}: { children: ReactNode}) {
  const {theme} = useTheme()
  const [queryClient] = useState(() => new QueryClient())

  const flagConfig = {
    projectId: env.NEXT_PUBLIC_FLAGS_PROJECT ?? "",
    agentId: env.NEXT_PUBLIC_FLAGS_AGENT ?? "",
    environmentId: env.NEXT_PUBLIC_FLAGS_ENVIRONMENT ?? "",
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme={theme} enableSystem disableTransitionOnChange>
        <FlagsProvider options={flagConfig ?? flagConfig}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </FlagsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
