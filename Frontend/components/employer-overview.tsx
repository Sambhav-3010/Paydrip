'use client'

import { Stream } from '@/lib/mock-streams'
import { DashboardCard } from '@/components/dashboard-card'
import { StreamInfo } from '@/components/stream-info'

interface EmployerOverviewProps {
  streams: Stream[]
}

export function EmployerOverview({ streams }: EmployerOverviewProps) {
  const activeStreams = streams.filter((s) => s.status === 'active').length
  const totalDeposited = streams.reduce((sum, s) => sum + s.amount, 0)
  const totalAccrued = streams.reduce((sum, s) => sum + s.accrued, 0)
  const totalWithdrawn = streams.reduce((sum, s) => sum + s.withdrawn, 0)

  const cardData = [
    { label: 'Active Streams', value: activeStreams, highlight: false },
    { label: 'Total Deposited', value: totalDeposited.toFixed(2), unit: 'ETH', highlight: false },
    { label: 'Total Accrued', value: totalAccrued.toFixed(3), unit: 'ETH', highlight: true },
    { label: 'Total Withdrawn', value: totalWithdrawn.toFixed(3), unit: 'ETH', highlight: false },
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
