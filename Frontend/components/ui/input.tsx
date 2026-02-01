import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full min-w-0 bg-input px-4 py-3 text-base border-2 border-border transition-all outline-none',
        'placeholder:text-muted-foreground',
        'focus:shadow-[0_0_0_3px_var(--primary)]',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
