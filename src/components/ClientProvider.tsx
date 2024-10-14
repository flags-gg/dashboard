"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {type ReactNode, useState} from 'react'
import {ThemeProvider} from "~/components/theme-provider";
import {FlagsProvider} from "@flags-gg/react-library";
import {env} from "~/env";

export default function ClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  console.info("flagsStuff", `project: ${env.NEXT_PUBLIC_FLAGS_PROJECT}`, `agent: ${env.NEXT_PUBLIC_FLAGS_AGENT}`, `env: ${env.NEXT_PUBLIC_FLAGS_ENVIRONMENT}`)

  return (
    <ThemeProvider attribute="class" defaultTheme={"dark"} enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <FlagsProvider options={{
          projectId: env.NEXT_PUBLIC_FLAGS_PROJECT,
          agentId: env.NEXT_PUBLIC_FLAGS_AGENT,
          environmentId: env.NEXT_PUBLIC_FLAGS_ENVIRONMENT,
        }}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </FlagsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
