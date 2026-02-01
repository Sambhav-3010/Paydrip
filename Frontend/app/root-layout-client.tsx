'use client'

import React from "react"

import { Providers } from '@/components/providers'
import { Analytics } from '@vercel/analytics/next'

export function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      {children}
      <Analytics />
    </Providers>
  )
}
