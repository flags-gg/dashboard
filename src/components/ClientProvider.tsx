"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {type ReactNode, useState} from 'react'
import {ThemeProvider} from "~/components/theme-provider";
import {FlagsProvider} from "@flags-gg/react-library";
import {flagsConfig} from "~/env";

export default function ClientProvider({ children, flagConfig }: { children: ReactNode, flagConfig?: typeof flagsConfig }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ThemeProvider attribute="class" defaultTheme={"dark"} enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <FlagsProvider options={flagConfig ?? flagsConfig}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </FlagsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
