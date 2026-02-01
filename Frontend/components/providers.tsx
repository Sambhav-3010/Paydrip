'use client'

import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
      <Toaster position="bottom-right" />
    </ThemeProvider>
  )
}
