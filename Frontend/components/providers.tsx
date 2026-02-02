'use client'

import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { Web3Provider } from '@/contexts/Web3Context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
      disableTransitionOnChange={false}
    >
      <Web3Provider>
        {children}
      </Web3Provider>
      <Toaster position="bottom-right" />
    </ThemeProvider>
  )
}
