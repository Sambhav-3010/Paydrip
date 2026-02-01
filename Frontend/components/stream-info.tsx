interface StreamInfoProps {
  label: string
  value: string | number
  unit?: string
  highlight?: boolean
}

export function StreamInfo({ label, value, unit, highlight }: StreamInfoProps) {
  return (
    <div>
      <p className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-2">
        {label}
      </p>
      <div className={`brutal-stat ${highlight ? 'text-primary' : 'text-foreground'}`}>
        {value}
        {unit && <span className="text-base font-normal ml-2 text-muted-foreground">{unit}</span>}
      </div>
    </div>
  )
}
