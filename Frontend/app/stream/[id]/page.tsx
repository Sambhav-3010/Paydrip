'use client'

import { useState, useEffect } from 'react'
import { Nav } from '@/components/nav'
import { PageHeader } from '@/components/page-header'
import { DashboardCard } from '@/components/dashboard-card'
import { StreamInfo } from '@/components/stream-info'
import { StreamStatus } from '@/components/stream-status'
import { StreamProgress } from '@/components/stream-progress'
import { StreamActions } from '@/components/stream-actions'
import { TransactionHistory } from '@/components/transaction-history'
import { useAccrual } from '@/hooks/use-accrual'
import { mockStreams } from '@/lib/mock-streams'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Transaction {
  hash: string
  type: 'withdrawal' | 'pause' | 'resume' | 'terminate' | 'create'
  amount?: number
  date: Date
  status: 'confirmed' | 'pending'
}

export default function StreamDetailPage({ params }: { params: { id: string } }) {
  const [isEmployer, setIsEmployer] = useState(true)
  const stream = mockStreams[0]

  const { accrued, remaining } = useAccrual({
    startDate: stream.startDate,
    endDate: stream.endDate,
    totalAmount: stream.amount,
    initialWithdrawn: stream.withdrawn,
  })

  const mockTransactions: Transaction[] = [
    {
      hash: '0x123def456',
      type: 'create',
      date: stream.startDate,
      status: 'confirmed',
    },
    {
      hash: '0xabc789def',
      type: 'withdrawal',
      amount: 2.8,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'confirmed',
    },
  ]

  const daysRemaining = Math.ceil((stream.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const totalDays = Math.ceil(
    (stream.endDate.getTime() - stream.startDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href={isEmployer ? '/dashboard/employer' : '/dashboard/employee'}>
            <Button variant="outline" size="sm" className="gap-2 mb-8 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>

          <div className="space-y-8">
            <div>
              <PageHeader
                title={stream.recipientName}
                description={`Stream ID: ${stream.id}`}
              />
              <div className="flex items-center gap-4">
                <StreamStatus status={stream.status} />
                <span className="text-sm text-muted-foreground">
                  {daysRemaining} of {totalDays} days remaining
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <DashboardCard>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Stream Details</h3>
                    <div className="space-y-4">
                      <StreamInfo label="Total Amount" value={stream.amount} unit="ETH" />
                      <StreamInfo label="Start Date" value={stream.startDate.toLocaleDateString()} />
                      <StreamInfo label="End Date" value={stream.endDate.toLocaleDateString()} />
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard>
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground">Current Status</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <StreamInfo
                        label="Accrued"
                        value={accrued.toFixed(3)}
                        unit="ETH"
                        highlight
                      />
                      <StreamInfo label="Withdrawn" value={stream.withdrawn.toFixed(3)} unit="ETH" />
                    </div>
                    <StreamProgress
                      accrued={accrued}
                      total={stream.amount}
                      withdrawn={stream.withdrawn}
                    />
                  </div>
                </DashboardCard>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <DashboardCard>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {isEmployer ? 'Stream Recipient' : 'Stream Employer'}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium text-foreground">
                          {isEmployer ? stream.recipientName : 'TechCorp Inc'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-mono text-sm text-foreground break-all">
                          {isEmployer ? stream.recipient : '0x70997970C51812e339D9B73b0245ad59419F4572'}
                        </p>
                      </div>
                      {!isEmployer && (
                        <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                          View Employer Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Actions</h3>
                    <StreamActions
                      status={stream.status}
                      isEmployer={isEmployer}
                      available={remaining}
                    />
                  </div>
                </DashboardCard>
              </div>
            </div>

            <DashboardCard>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
                <TransactionHistory transactions={mockTransactions} />
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </>
  )
}
