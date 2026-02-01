import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold uppercase tracking-wider transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground border-2 border-border shadow-[4px_4px_0_var(--border)] hover:shadow-[6px_6px_0_var(--border)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
        secondary: 'bg-secondary text-secondary-foreground border-2 border-border shadow-[4px_4px_0_var(--border)] hover:shadow-[6px_6px_0_var(--border)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
        outline: 'bg-background text-foreground border-2 border-border shadow-[4px_4px_0_var(--border)] hover:shadow-[6px_6px_0_var(--border)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
        ghost: 'hover:bg-secondary',
        link: 'text-primary underline-offset-4 hover:underline',
        destructive: 'bg-destructive text-destructive-foreground border-2 border-border shadow-[4px_4px_0_var(--border)] hover:shadow-[6px_6px_0_var(--border)] hover:translate-x-[-2px] hover:translate-y-[-2px]',
      },
      size: {
        default: 'h-10 px-5 py-2 text-sm',
        sm: 'h-8 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'size-10',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
