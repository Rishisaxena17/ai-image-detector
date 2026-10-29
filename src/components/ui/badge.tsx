import * as React from 'react'

import { cn } from '../../lib/utils'

const badgeVariants = {
  default: 'border border-sky-400/30 bg-sky-500/10 text-sky-100',
  success: 'border border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
  warning: 'border border-amber-400/30 bg-amber-500/10 text-amber-200',
  destructive: 'border border-red-400/30 bg-red-500/10 text-red-200',
  secondary: 'border border-white/10 bg-slate-800 text-slate-200',
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof badgeVariants }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.18em] uppercase',
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  )
}
