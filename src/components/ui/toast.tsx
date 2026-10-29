import * as React from 'react'

import { cn } from '../../lib/utils'

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'destructive'
}

export function Toast({
  title,
  description,
  variant = 'default',
  className,
  ...props
}: ToastProps) {
  const tone = {
    default: 'border-sky-500/40 bg-slate-900 text-slate-100',
    success: 'border-emerald-500/40 bg-emerald-950/80 text-emerald-100',
    destructive: 'border-red-500/40 bg-red-950/80 text-red-100',
  }

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm rounded-2xl border p-4 shadow-lg backdrop-blur-sm',
        tone[variant],
        className,
      )}
      {...props}
    >
      {title ? <div className="mb-1 text-sm font-semibold">{title}</div> : null}
      {description ? <p className="text-sm text-slate-300">{description}</p> : null}
    </div>
  )
}
