import { cn } from '../../lib/utils'

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-xl bg-slate-800/80', className)} />
  )
}

export { Skeleton }
