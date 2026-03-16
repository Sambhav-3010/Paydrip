'use client'

import React from "react"

import { Providers } from '@/components/providers'
import { Analytics } from '@vercel/analytics/next'

export function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === 'true'

  return (
    <Providers>
      {children}
      {analyticsEnabled && <Analytics />}
    </Providers>
  )
}
