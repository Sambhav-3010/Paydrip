'use client'

import Link from 'next/link'
import { EmployeeStream } from '@/lib/mock-employee'
import { StreamStatus } from '@/components/stream-status'
import { Button } from '@/components/ui/button'

interface EmployeeStreamsListProps {
  streams: EmployeeStream[]
}

export function EmployeeStreamsList({ streams }: EmployeeStreamsListProps) {
  if (streams.length === 0) {
    return (
      <div className="brutal-card p-12 text-center">
        <p className="text-2xl font-bold brutal-title mb-2">No Streams Yet</p>
        <p className="text-muted-foreground">Ask your employer to set up a salary stream.</p>
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
                  From
                </p>
                <p className="font-bold">{stream.employerName}</p>
                <p className="text-xs text-muted-foreground brutal-mono">{stream.employer}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                  Total
                </p>
                <p className="font-bold brutal-mono text-xl">{stream.totalAmount} ETH</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                  Available
                </p>
                <p className="font-bold brutal-mono text-xl text-primary">{stream.remaining.toFixed(3)} ETH</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                  Status
                </p>
                <StreamStatus status={stream.status} />
              </div>

              <div className="flex justify-end gap-2">
                <Button size="sm" className="brutal-button">
                  Withdraw
                </Button>
                <Button size="sm" className="brutal-button brutal-button-secondary">
                  Details
                </Button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
