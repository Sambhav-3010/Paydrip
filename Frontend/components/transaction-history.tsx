'use client'

interface Transaction {
  hash: string
  type: 'withdrawal' | 'pause' | 'resume' | 'terminate' | 'create'
  amount?: number
  date: Date
  status: 'confirmed' | 'pending'
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

const typeLabels = {
  withdrawal: 'Withdrawal',
  pause: 'Stream Paused',
  resume: 'Stream Resumed',
  terminate: 'Stream Terminated',
  create: 'Stream Created',
}

const typeColors = {
  withdrawal: 'text-accent',
  pause: 'text-muted-foreground',
  resume: 'text-accent',
  terminate: 'text-destructive',
  create: 'text-accent',
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No transactions yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 divide-y divide-border border border-border rounded-lg">
      {transactions.map((tx) => (
        <div key={tx.hash} className="p-4 hover:bg-secondary/30 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`font-medium ${typeColors[tx.type]}`}>
                {typeLabels[tx.type]}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {tx.date.toLocaleDateString()} at {tx.date.toLocaleTimeString()}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">{tx.hash}</p>
            </div>
            <div className="text-right">
              {tx.amount && (
                <p className="font-semibold text-foreground">{tx.amount.toFixed(3)} ETH</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {tx.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
