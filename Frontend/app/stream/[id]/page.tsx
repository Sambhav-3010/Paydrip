'use client'

import { use, useCallback, useEffect, useMemo, useState } from 'react'
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
import type { ChainStream, SalaryStreamLiveMessage, StreamTransaction } from '@/lib/stream-types'

export default function StreamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const streamId = Number(id)
  const { account, contract, isConnected, connectWallet, isConnecting } = useWeb3()
  const [stream, setStream] = useState<ChainStream | null>(null)
  const [transactions, setTransactions] = useState<StreamTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [liveConnection, setLiveConnection] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')
  const [liveMode, setLiveMode] = useState<'kafka' | 'fallback' | null>(null)
  const [liveError, setLiveError] = useState<string | null>(null)
  const [liveMessage, setLiveMessage] = useState<SalaryStreamLiveMessage | null>(null)

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

  useEffect(() => {
    if (!isConnected || Number.isNaN(streamId)) {
      setLiveConnection('idle')
      return
    }

    setLiveConnection('connecting')
    setLiveError(null)

    const source = new EventSource(`/api/streams/${streamId}/live`)

    const parseJsonData = <T,>(event: Event): T | null => {
      const data = (event as MessageEvent).data
      if (typeof data !== 'string' || data.length === 0) return null
      try {
        return JSON.parse(data) as T
      } catch {
        return null
      }
    }

    const onStatus = (event: Event) => {
      const parsed = parseJsonData<{ state?: string; mode?: 'kafka' | 'fallback' }>(event)
      if (!parsed) return
      if (parsed.state === 'connected') {
        setLiveConnection('connected')
        setLiveMode(parsed.mode ?? null)
      }
    }

    const onSalary = (event: Event) => {
      const parsed = parseJsonData<SalaryStreamLiveMessage>(event)
      if (!parsed) return
      setLiveMessage(parsed)
      setLiveConnection('connected')
      setLiveError(null)
      setStream((current) => {
        if (!current) return current
        return {
          ...current,
          employer: parsed.employer,
          employee: parsed.employee,
          totalAmountEth: parsed.totalAmountEth,
          accruedEth: parsed.accruedEth,
          withdrawableEth: parsed.withdrawableEth,
          totalWithdrawnEth: parsed.totalWithdrawnEth,
          startTime: parsed.startTime,
          endTime: parsed.endTime,
          status: parsed.status,
        }
      })
    }

    const onError = (event: Event) => {
      const parsed = parseJsonData<{ message?: string }>(event)
      setLiveConnection('error')
      setLiveError(parsed?.message ?? 'Kafka feed unavailable')
    }

    source.addEventListener('status', onStatus)
    source.addEventListener('salary', onSalary)
    source.addEventListener('live-error', onError)
    source.onerror = () => {
      setLiveConnection('error')
      setLiveError('Kafka feed disconnected')
    }

    return () => {
      source.removeEventListener('status', onStatus)
      source.removeEventListener('salary', onSalary)
      source.removeEventListener('live-error', onError)
      source.close()
    }
  }, [isConnected, streamId])

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
  const liveStatus = liveMessage?.status ?? stream?.status
  const liveAvailable = liveMessage?.withdrawableEth ?? stream?.withdrawableEth ?? 0

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
                <div className="flex flex-wrap items-center gap-4">
                  <StreamStatus status={stream.status} />
                  <span className="text-sm text-muted-foreground">
                    {daysRemaining} of {totalDays} days remaining
                  </span>
                  <span className={`brutal-tag ${liveConnection === 'connected' ? 'brutal-tag-primary' : 'brutal-tag-muted'}`}>
                    {liveConnection === 'connected'
                      ? liveMode === 'fallback'
                        ? 'Live Direct'
                        : 'Kafka Live'
                      : 'Kafka Offline'}
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
                      <h3 className="text-lg font-semibold text-foreground">Live Salary Feed</h3>
                      <p className="text-sm text-muted-foreground">
                        {liveMode === 'fallback'
                          ? 'Signed salary snapshots streamed directly from chain while Kafka is unavailable.'
                          : 'Signed salary snapshots streamed in real time through Kafka.'}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <StreamInfo
                          label="Live Accrued"
                          value={(liveMessage?.accruedEth ?? stream.accruedEth).toFixed(4)}
                          unit="ETH"
                          highlight
                        />
                        <StreamInfo
                          label="Live Available"
                          value={(liveMessage?.withdrawableEth ?? stream.withdrawableEth).toFixed(4)}
                          unit="ETH"
                          highlight
                        />
                      </div>
                      <div className="brutal-inset px-4 py-3">
                        <p className="brutal-kicker">Signed Snapshot</p>
                        <p className="mt-2 break-all brutal-mono text-xs text-foreground">
                          {liveMessage?.signature ?? 'Waiting for signed Kafka event'}
                        </p>
                        {liveMessage && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Updated {new Date(liveMessage.producedAt).toLocaleString()}
                          </p>
                        )}
                        {liveError && <p className="mt-2 text-xs text-destructive">{liveError}</p>}
                      </div>
                    </div>
                  </DashboardCard>

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
                          status={liveStatus ?? stream.status}
                          isEmployer={isEmployer}
                          available={liveAvailable}
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

