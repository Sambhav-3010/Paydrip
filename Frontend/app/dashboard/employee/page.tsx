'use client'

import { useCallback, useEffect, useState } from 'react'
import { Nav } from '@/components/nav'
import { PageHeader } from '@/components/page-header'
import { EmployeeOverview } from '@/components/employee-overview'
import { EmployeeStreamsList } from '@/components/employee-streams-list'
import { useWeb3 } from '@/contexts/Web3Context'
import { fetchEmployeeStreams } from '@/lib/stream-contract'
import type { ChainStream } from '@/lib/stream-types'
import { Button } from '@/components/ui/button'

export default function EmployeeDashboard() {
  const { account, contract, isConnected, connectWallet, isConnecting } = useWeb3()
  const [streams, setStreams] = useState<ChainStream[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStreams = useCallback(async () => {
    if (!contract || !account) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchEmployeeStreams(contract, account)
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
            title="Employee Dashboard"
            description="Track and withdraw from your salary streams"
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
              <EmployeeOverview streams={streams} />

              {error && (
                <div className="brutal-card p-4 mb-6 text-destructive">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="brutal-card p-8 text-center">
                  Loading your streams...
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <h2 className="text-xl font-bold brutal-title">Your Streams</h2>
                      <div className="flex-1 brutal-divider" />
                    </div>
                    <EmployeeStreamsList streams={activeStreams} />
                  </div>

                  {nonActiveStreams.length > 0 && (
                    <div className="mt-10">
                      <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-xl font-bold brutal-title">Completed Streams</h2>
                        <div className="flex-1 brutal-divider" />
                      </div>
                      <EmployeeStreamsList streams={nonActiveStreams} />
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

