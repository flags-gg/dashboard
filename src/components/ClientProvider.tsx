"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {type ReactNode, useState} from 'react'
import { ThemeProvider, useTheme } from "next-themes";
import {FlagsProvider} from "@flags-gg/react-library";
import {flagsConfig} from "~/env";

export default function ClientProvider({ children, flagConfig }: { children: ReactNode, flagConfig?: typeof flagsConfig }) {
  const [queryClient] = useState(() => new QueryClient())
  const {theme} = useTheme()

  console.info("Flags Config", flagsConfig, "FlagConfig", flagConfig)

  return (
    <ThemeProvider attribute="class" defaultTheme={theme} enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <FlagsProvider options={flagConfig ?? flagConfig}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </FlagsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
