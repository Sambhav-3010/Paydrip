'use client'

interface StreamProgressProps {
  accrued: number
  total: number
  withdrawn: number
}

export function StreamProgress({ accrued, total, withdrawn }: StreamProgressProps) {
  const accruedPercent = (accrued / total) * 100
  const withdrawnPercent = (withdrawn / total) * 100
  const remainingPercent = ((total - accrued) / total) * 100

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-foreground">Accrual Progress</p>
          <p className="text-sm text-muted-foreground">
            {accrued.toFixed(3)} / {total} ETH
          </p>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${Math.min(accruedPercent, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div className="border border-accent/20 rounded p-2">
          <p className="text-muted-foreground text-xs">Withdrawn</p>
          <p className="font-semibold text-foreground">{withdrawnPercent.toFixed(0)}%</p>
        </div>
        <div className="border border-accent/20 rounded p-2">
          <p className="text-muted-foreground text-xs">Available</p>
          <p className="font-semibold text-accent">{(100 - withdrawnPercent).toFixed(0)}%</p>
        </div>
        <div className="border border-accent/20 rounded p-2">
          <p className="text-muted-foreground text-xs">Not Accrued</p>
          <p className="font-semibold text-foreground">{remainingPercent.toFixed(0)}%</p>
        </div>
      </div>
    </div>
  )
}
