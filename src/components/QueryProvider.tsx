'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {type ReactNode, useState} from 'react'
import {ThemeProvider} from "~/components/theme-provider";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {FlagsProvider} from "@flags-gg/react-library";
import {env} from "~/env";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ThemeProvider attribute="class" defaultTheme={"dark"} enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <FlagsProvider options={{
          projectId: env.NEXT_PUBLIC_FLAGS_PROJECT,
          agentId: env.NEXT_PUBLIC_FLAGS_AGENT,
          environment: env.NEXT_PUBLIC_FLAGS_ENVIRONMENT,
        }}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </FlagsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
