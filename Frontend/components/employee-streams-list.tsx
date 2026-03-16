'use client'

import Link from 'next/link'
import { StreamStatus } from '@/components/stream-status'
import { Button } from '@/components/ui/button'
import type { ChainStream } from '@/lib/stream-types'
import { formatAddress } from '@/lib/stream-contract'

interface EmployeeStreamsListProps {
  streams: ChainStream[]
}

export function EmployeeStreamsList({ streams }: EmployeeStreamsListProps) {
  if (streams.length === 0) {
    return (
      <div className="brutal-card bg-card p-12 text-center">
        <p className="brutal-kicker">Empty State</p>
        <p className="mt-3 text-2xl font-bold brutal-title">No Streams Yet</p>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">Ask your employer to set up a salary stream.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {streams.map((stream) => (
        <Link key={stream.id} href={`/stream/${stream.id}`} className="block">
          <div className="brutal-card brutal-card-hover bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="brutal-kicker">From</p>
                  <p className="text-xl font-bold text-foreground">{formatAddress(stream.employer)}</p>
                  <p className="break-all brutal-mono text-xs text-muted-foreground">{stream.employer}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="brutal-inset px-4 py-3">
                    <p className="brutal-kicker">Total</p>
                    <p className="mt-2 brutal-mono text-lg font-bold text-foreground">{stream.totalAmountEth.toFixed(4)} ETH</p>
                  </div>

                  <div className="brutal-inset px-4 py-3">
                    <p className="brutal-kicker">Available</p>
                    <p className="mt-2 brutal-mono text-lg font-bold text-primary">{stream.withdrawableEth.toFixed(4)} ETH</p>
                  </div>

                  <div className="brutal-inset px-4 py-3">
                    <p className="brutal-kicker">Status</p>
                    <div className="mt-2">
                      <StreamStatus status={stream.status} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 lg:min-w-56 lg:flex-col lg:items-end">
                <div className="text-right">
                  <p className="brutal-kicker">Stream ID</p>
                  <p className="mt-2 brutal-mono text-lg font-bold">#{stream.id}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" disabled={stream.withdrawableEth <= 0} className="min-w-24 bg-primary text-primary-foreground">
                    Withdraw
                  </Button>
                  <Button size="sm" className="min-w-20 bg-secondary text-secondary-foreground">
                    Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
