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
      className={`brutal-card relative overflow-hidden p-6 sm:p-7 ${highlight ? 'bg-[linear-gradient(135deg,rgba(249,115,22,0.2),rgba(255,255,255,0.98))]' : 'bg-card'} ${onClick ? 'cursor-pointer brutal-card-hover' : ''} ${className}`}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-2 ${highlight ? 'bg-primary' : 'bg-secondary'}`} />
      {children}
    </div>
  )
}
