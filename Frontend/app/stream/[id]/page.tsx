'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Nav } from '@/components/nav'
import { PageHeader } from '@/components/page-header'
import { DashboardCard } from '@/components/dashboard-card'
import { StreamInfo } from '@/components/stream-info'
import { StreamStatus } from '@/components/stream-status'
import { StreamProgress } from '@/components/stream-progress'
import { StreamActions } from '@/components/stream-actions'
import { TransactionHistory } from '@/components/transaction-history'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useWeb3 } from '@/contexts/Web3Context'
import { fetchStream, fetchStreamTransactions, formatAddress, getDaysRemaining, getDurationDays } from '@/lib/stream-contract'
import type { ChainStream, StreamTransaction } from '@/lib/stream-types'

export default function StreamDetailPage({ params }: { params: { id: string } }) {
  const streamId = Number(params.id)
  const { account, contract, isConnected, connectWallet, isConnecting } = useWeb3()
  const [stream, setStream] = useState<ChainStream | null>(null)
  const [transactions, setTransactions] = useState<StreamTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStream = useCallback(async () => {
    if (!contract || Number.isNaN(streamId)) return

    setIsLoading(true)
    setError(null)
    try {
      const [streamData, txData] = await Promise.all([
        fetchStream(contract, streamId),
        fetchStreamTransactions(contract, streamId),
      ])
      setStream(streamData)
      setTransactions(txData)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load stream details'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [contract, streamId])

  useEffect(() => {
    loadStream()
  }, [loadStream])

  useEffect(() => {
    if (!contract || Number.isNaN(streamId)) return
    const interval = setInterval(() => {
      loadStream()
    }, 12_000)
    return () => clearInterval(interval)
  }, [contract, loadStream, streamId])

  const isEmployer = useMemo(() => {
    if (!stream || !account) return false
    return account.toLowerCase() === stream.employer.toLowerCase()
  }, [account, stream])

  const isEmployee = useMemo(() => {
    if (!stream || !account) return false
    return account.toLowerCase() === stream.employee.toLowerCase()
  }, [account, stream])

  const daysRemaining = stream ? getDaysRemaining(stream.endTime) : 0
  const totalDays = stream ? getDurationDays(stream.startTime, stream.endTime) : 0

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

          {!isConnected && (
            <div className="brutal-card p-8 mb-8 text-center space-y-4">
              <p className="text-xl font-bold brutal-title">Connect wallet to continue</p>
              <Button onClick={connectWallet} disabled={isConnecting}>
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          )}

          {error && (
            <div className="brutal-card p-4 mb-8 text-destructive">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="brutal-card p-8 text-center">Loading stream details...</div>
          )}

          {stream && (
            <div className="space-y-8">
              <div>
                <PageHeader
                  title={`Stream #${stream.id}`}
                  description={`Employee: ${formatAddress(stream.employee)} | Employer: ${formatAddress(stream.employer)}`}
                />
                <div className="flex items-center gap-4">
                  <StreamStatus status={stream.status} />
                  <span className="text-sm text-muted-foreground">
                    {daysRemaining} of {totalDays} days remaining
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <DashboardCard>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Stream Details</h3>
                      <div className="space-y-4">
                        <StreamInfo label="Total Amount" value={stream.totalAmountEth.toFixed(4)} unit="ETH" />
                        <StreamInfo label="Start Time" value={new Date(stream.startTime * 1000).toLocaleString()} />
                        <StreamInfo label="End Time" value={new Date(stream.endTime * 1000).toLocaleString()} />
                      </div>
                    </div>
                  </DashboardCard>

                  <DashboardCard>
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-foreground">Current Status</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <StreamInfo
                          label="Accrued"
                          value={stream.accruedEth.toFixed(4)}
                          unit="ETH"
                          highlight
                        />
                        <StreamInfo label="Withdrawn" value={stream.totalWithdrawnEth.toFixed(4)} unit="ETH" />
                      </div>
                      <StreamProgress
                        accrued={stream.accruedEth + stream.totalWithdrawnEth}
                        total={stream.totalAmountEth}
                        withdrawn={stream.totalWithdrawnEth}
                      />
                    </div>
                  </DashboardCard>
                </div>

                <div className="space-y-6">
                  <DashboardCard>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        {isEmployer ? 'Stream Recipient' : 'Stream Employer'}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="font-mono text-sm text-foreground break-all">
                            {isEmployer ? stream.employee : stream.employer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DashboardCard>

                  <DashboardCard>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Actions</h3>
                      {isEmployer || isEmployee ? (
                        <StreamActions
                          streamId={stream.id}
                          status={stream.status}
                          isEmployer={isEmployer}
                          available={stream.withdrawableEth}
                          onUpdated={loadStream}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Connected wallet is not part of this stream.
                        </p>
                      )}
                    </div>
                  </DashboardCard>
                </div>
              </div>

              <DashboardCard>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
                  <TransactionHistory transactions={transactions} />
                </div>
              </DashboardCard>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

