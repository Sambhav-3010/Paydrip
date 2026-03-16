'use client'

import { DashboardCard } from '@/components/dashboard-card'
import { StreamInfo } from '@/components/stream-info'
import type { ChainStream } from '@/lib/stream-types'

interface EmployeeOverviewProps {
  streams: ChainStream[]
}

export function EmployeeOverview({ streams }: EmployeeOverviewProps) {
  const activeStreams = streams.filter((s) => s.status === 'active').length
  const totalAccrued = streams.reduce((sum, s) => sum + s.accruedEth, 0)
  const totalWithdrawn = streams.reduce((sum, s) => sum + s.totalWithdrawnEth, 0)
  const totalRemaining = streams.reduce((sum, s) => sum + s.withdrawableEth, 0)

  const cardData = [
    { label: 'Active Streams', value: activeStreams, highlight: false },
    { label: 'Total Accrued', value: totalAccrued.toFixed(3), unit: 'ETH', highlight: true },
    { label: 'Withdrawn', value: totalWithdrawn.toFixed(3), unit: 'ETH', highlight: false },
    { label: 'Available', value: totalRemaining.toFixed(3), unit: 'ETH', highlight: true },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
      {cardData.map((card) => (
        <DashboardCard key={card.label} highlight={card.highlight}>
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
