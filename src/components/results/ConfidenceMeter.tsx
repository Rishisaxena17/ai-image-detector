import { motion } from 'framer-motion'

export function ConfidenceMeter({
  value,
  label = 'Confidence',
}: {
  value: number
  label?: string
}) {
  const percent = Math.min(100, Math.max(0, Math.round(value * 100)))
  const barColor =
    percent >= 75
      ? 'from-sky-400 to-cyan-300'
      : percent >= 45
        ? 'from-slate-500 to-slate-400'
        : 'from-slate-400 to-slate-500'

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-200">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-white">{percent}%</span>
        </div>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800 ring-1 ring-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
        />
      </div>
    </div>
  )
}
