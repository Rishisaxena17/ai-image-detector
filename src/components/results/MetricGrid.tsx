import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react'

const metrics = [
  { label: 'AI-signal score', value: '88%', icon: Sparkles },
  { label: 'Authenticity estimate', value: '12%', icon: ShieldCheck },
  { label: 'Review priority', value: 'High', icon: ArrowUpRight },
]

export function MetricGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-sky-200 ring-1 ring-sky-400/20">
            <Icon size={18} />
          </div>
          <div className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
          <div className="text-2xl font-semibold text-white">{value}</div>
        </div>
      ))}
    </div>
  )
}
