import { HistoryTable } from '../components/history/HistoryTable'
import { ConfidenceChart } from '../components/charts/ConfidenceChart'
import { dashboardInsights } from '../data/demo'

export function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Review log</div>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">Analysis history</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardInsights.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</div>
            <div className="mt-3 text-3xl font-semibold text-white">{item.value}</div>
            <div className="mt-2 text-sm text-slate-400">{item.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <HistoryTable />
        <ConfidenceChart />
      </div>
    </div>
  )
}
