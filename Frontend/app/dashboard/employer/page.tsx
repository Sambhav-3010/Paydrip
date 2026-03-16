'use client'

import { useCallback, useEffect, useState } from 'react'
import { Nav } from '@/components/nav'
import { PageHeader } from '@/components/page-header'
import { EmployerOverview } from '@/components/employer-overview'
import { StreamsList } from '@/components/streams-list'
import { CreateStreamModal } from '@/components/create-stream-modal'
import { useWeb3 } from '@/contexts/Web3Context'
import { fetchEmployerStreams } from '@/lib/stream-contract'
import type { ChainStream } from '@/lib/stream-types'
import { Button } from '@/components/ui/button'

export default function EmployerDashboard() {
  const { account, contract, isConnected, connectWallet, isConnecting } = useWeb3()
  const [streams, setStreams] = useState<ChainStream[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStreams = useCallback(async () => {
    if (!contract || !account) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchEmployerStreams(contract, account)
      setStreams(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load streams'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [account, contract])

  useEffect(() => {
    loadStreams()
  }, [loadStreams])

  const activeStreams = streams.filter((s) => s.status === 'active')
  const nonActiveStreams = streams.filter((s) => s.status !== 'active')
  const totalManagedEth = streams.reduce((sum, stream) => sum + stream.totalAmountEth, 0)

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background">
        <div className="dashboard-shell">
          <div className="dashboard-backdrop pattern-grid" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <section className="brutal-card overflow-hidden bg-card/95">
              <div className="grid gap-6 border-b-[3px] border-border px-6 py-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:px-8 lg:py-8">
                <PageHeader
                  title="Employer Dashboard"
                  description="Manage salary streams, monitor accrual, and keep payroll execution clean."
                  action={<CreateStreamModal onCreated={loadStreams} />}
                />

                <div className="grid grid-cols-2 gap-3 self-start lg:grid-cols-1">
                  <div className="brutal-inset px-4 py-3">
                    <p className="brutal-kicker">Connected Wallet</p>
                    <p className="mt-2 truncate brutal-mono text-sm font-bold text-foreground">{account ?? 'Not connected'}</p>
                  </div>
                  <div className="brutal-inset px-4 py-3">
                    <p className="brutal-kicker">Payroll Managed</p>
                    <p className="mt-2 brutal-mono text-2xl font-bold text-foreground">{totalManagedEth.toFixed(3)} ETH</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 px-6 py-6 lg:px-8 lg:py-8">
                {!isConnected && (
                  <div className="brutal-card bg-secondary p-8 text-center space-y-4">
                    <p className="text-xl font-bold brutal-title">Connect wallet to continue</p>
                    <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
                      This dashboard reads your payroll streams from Sepolia and unlocks create, pause, and terminate actions once the wallet session is active.
                    </p>
                    <Button onClick={connectWallet} disabled={isConnecting} className="min-w-44">
                      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </Button>
                  </div>
                )}

                {isConnected && (
                  <>
                    <EmployerOverview streams={streams} />

                    {error && (
                      <div className="brutal-card border-destructive bg-destructive/5 px-5 py-4 text-destructive">
                        {error}
                      </div>
                    )}

                    {isLoading ? (
                      <div className="brutal-card bg-secondary p-10 text-center">
                        <p className="brutal-kicker">Loading</p>
                        <p className="mt-3 text-lg font-semibold">Fetching employer streams...</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="brutal-kicker">Live Payroll</p>
                              <div className="mt-2 flex items-center gap-4">
                                <h2 className="text-2xl font-bold brutal-title">Active Streams</h2>
                                <span className="brutal-tag brutal-tag-primary">{activeStreams.length}</span>
                              </div>
                            </div>
                            <p className="max-w-xl text-sm text-muted-foreground">
                              Review funded streams, verify accrued value, and jump into management actions without losing context.
                            </p>
                          </div>
                          <StreamsList streams={activeStreams} />
                        </div>

                        {nonActiveStreams.length > 0 && (
                          <div className="space-y-4 pt-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="brutal-kicker">Archive</p>
                                <div className="mt-2 flex items-center gap-4">
                                  <h2 className="text-2xl font-bold brutal-title">Completed & Terminated</h2>
                                  <span className="brutal-tag brutal-tag-muted">{nonActiveStreams.length}</span>
                                </div>
                              </div>
                              <p className="max-w-xl text-sm text-muted-foreground">
                                Historical streams stay separate from active payroll so the operational view remains clean.
                              </p>
                            </div>
                            <StreamsList streams={nonActiveStreams} />
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}

