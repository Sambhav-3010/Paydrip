'use client'

type StreamStatusType = 'active' | 'paused' | 'completed' | 'terminated'

interface StreamStatusProps {
  status: StreamStatusType
}

const statusConfig = {
  active: { label: 'ACTIVE', className: 'brutal-tag bg-accent text-accent-foreground' },
  paused: { label: 'PAUSED', className: 'brutal-tag brutal-tag-muted' },
  completed: { label: 'COMPLETED', className: 'brutal-tag brutal-tag-primary' },
  terminated: { label: 'TERMINATED', className: 'brutal-tag bg-destructive text-destructive-foreground' },
}

export function StreamStatus({ status }: StreamStatusProps) {
  const config = statusConfig[status]
  return (
    <span className={config.className}>
      {config.label}
    </span>
  )
}
