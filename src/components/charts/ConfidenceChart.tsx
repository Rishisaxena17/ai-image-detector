export function ConfidenceChart() {
  const values = [34, 48, 66, 54, 76, 88, 92]

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
      <div className="mb-4 text-sm font-medium text-slate-200">Confidence trend</div>
      <div className="flex h-40 items-end gap-2">
        {values.map((value, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-xl bg-gradient-to-t from-sky-400 to-cyan-300"
              style={{ height: `${value}%` }}
            />
            <span className="text-[10px] uppercase tracking-widest text-slate-400">
              {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
