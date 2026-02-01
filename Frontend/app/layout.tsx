import React from "react"
import type { Metadata, Viewport } from 'next'
import { RootLayoutClient } from './root-layout-client'
import './globals.css'

export const metadata: Metadata = {
  title: 'PayDrip - Decentralized Salary Streaming',
  description: 'Continuous, trustless payroll powered by Ethereum - Your salary, streaming like memories',
  generator: 'v0.app'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}
