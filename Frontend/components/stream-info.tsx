interface StreamInfoProps {
  label: string
  value: string | number
  unit?: string
  highlight?: boolean
}

export function StreamInfo({ label, value, unit, highlight }: StreamInfoProps) {
  return (
    <div className="flex h-full flex-col justify-between gap-4 pt-2">
      <p className="brutal-kicker">
        {label}
      </p>
      <div className="space-y-2">
        <div className={`break-words text-3xl font-bold leading-none sm:text-4xl ${highlight ? 'text-foreground' : 'text-foreground'}`}>
          <span className="brutal-mono">{value}</span>
        </div>
        {unit && <span className={`inline-flex w-fit border-2 border-border px-2 py-1 text-xs font-bold uppercase tracking-[0.18em] ${highlight ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>{unit}</span>}
      </div>
    </div>
  )
}
