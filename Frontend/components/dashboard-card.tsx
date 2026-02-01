'use client';

import React from "react"

interface DashboardCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  highlight?: boolean
}

export function DashboardCard({ children, className = '', onClick, highlight }: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={`brutal-card p-6 ${highlight ? 'bg-accent' : 'bg-card'} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
