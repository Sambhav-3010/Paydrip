'use client'

import { DashboardCard } from '@/components/dashboard-card'
import { StreamInfo } from '@/components/stream-info'
import type { ChainStream } from '@/lib/stream-types'

interface EmployerOverviewProps {
  streams: ChainStream[]
}

export function EmployerOverview({ streams }: EmployerOverviewProps) {
  const activeStreams = streams.filter((s) => s.status === 'active').length
  const totalDeposited = streams.reduce((sum, s) => sum + s.totalAmountEth, 0)
  const totalAccrued = streams.reduce((sum, s) => sum + s.accruedEth, 0)
  const totalWithdrawn = streams.reduce((sum, s) => sum + s.totalWithdrawnEth, 0)

  const cardData = [
    { label: 'Active Streams', value: activeStreams, highlight: false },
    { label: 'Total Deposited', value: totalDeposited.toFixed(2), unit: 'ETH', highlight: false },
    { label: 'Total Accrued', value: totalAccrued.toFixed(3), unit: 'ETH', highlight: true },
    { label: 'Total Withdrawn', value: totalWithdrawn.toFixed(3), unit: 'ETH', highlight: false },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cardData.map((card) => (
        <DashboardCard key={card.label} highlight={card.highlight} className="min-h-[176px]">
          <StreamInfo
            label={card.label}
            value={card.value}
            unit={card.unit}
            highlight={card.highlight}
          />
        </DashboardCard>
      ))}
    </div>
  )
}
