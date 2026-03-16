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

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <PageHeader
            title="Employer Dashboard"
            description="Manage salary streams for your team"
            action={<CreateStreamModal onCreated={loadStreams} />}
          />

          {!isConnected && (
            <div className="brutal-card p-8 mb-8 text-center space-y-4">
              <p className="text-xl font-bold brutal-title">Connect wallet to continue</p>
              <Button onClick={connectWallet} disabled={isConnecting}>
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          )}

          {isConnected && (
            <>
              <EmployerOverview streams={streams} />

              {error && (
                <div className="brutal-card p-4 mb-6 text-destructive">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="brutal-card p-8 text-center">
                  Loading employer streams...
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <h2 className="text-xl font-bold brutal-title">Active Streams</h2>
                      <div className="flex-1 brutal-divider" />
                    </div>
                    <StreamsList streams={activeStreams} />
                  </div>

                  {nonActiveStreams.length > 0 && (
                    <div className="mt-10">
                      <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-xl font-bold brutal-title">Completed & Terminated</h2>
                        <div className="flex-1 brutal-divider" />
                      </div>
                      <StreamsList streams={nonActiveStreams} />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}

