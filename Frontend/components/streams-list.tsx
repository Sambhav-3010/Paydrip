'use client'

import Link from 'next/link'
import { StreamStatus } from '@/components/stream-status'
import { Button } from '@/components/ui/button'
import type { ChainStream } from '@/lib/stream-types'
import { formatAddress } from '@/lib/stream-contract'

interface StreamsListProps {
  streams: ChainStream[]
}

export function StreamsList({ streams }: StreamsListProps) {
  if (streams.length === 0) {
    return (
      <div className="brutal-card p-12 text-center">
        <p className="text-2xl font-bold brutal-title mb-2">No Streams Yet</p>
        <p className="text-muted-foreground">Create your first salary stream to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {streams.map((stream) => (
        <Link key={stream.id} href={`/stream/${stream.id}`}>
          <div className="brutal-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                  Recipient
                </p>
                <p className="font-bold">{formatAddress(stream.employee)}</p>
                <p className="text-xs text-muted-foreground brutal-mono">{stream.employee}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                  Total
                </p>
                <p className="font-bold brutal-mono text-xl">{stream.totalAmountEth.toFixed(4)} ETH</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                  Accrued
                </p>
                <p className="font-bold brutal-mono text-xl text-primary">{stream.accruedEth.toFixed(4)} ETH</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                  Status
                </p>
                <StreamStatus status={stream.status} />
              </div>

              <div className="flex justify-end">
                <Button size="sm" className="brutal-button brutal-button-secondary">
                  Manage
                </Button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
