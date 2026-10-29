import { ArrowUpRight, Filter, Search } from 'lucide-react'

import { sampleHistory } from '../../data/demo'
import { confidenceLabel } from '../../lib/confidence'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

const statusColor = {
  completed: 'success',
  processing: 'warning',
  failed: 'destructive',
  queued: 'secondary',
} as const

export function HistoryTable() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 sm:p-5 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-lg font-semibold text-white">Analysis history</div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-300">
            <Search size={14} />
            Search
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={14} />
            Filters
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-3 font-medium">Case</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Prediction</th>
              <th className="pb-3 font-medium">Result</th>
              <th className="pb-3 font-medium">Confidence</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {sampleHistory.map((record) => (
              <tr key={record.id} className="border-t border-white/10 text-slate-200">
                <td className="py-3 pr-4">
                  <div className="font-medium text-white">{record.title}</div>
                  <div className="text-xs text-slate-400">{record.fileName}</div>
                </td>
                <td className="py-3 pr-4">
                  <Badge variant={statusColor[record.status]}>{record.status}</Badge>
                </td>
                <td className="py-3 pr-4">
                  <span className="capitalize">{record.label.replace('_', ' ')}</span>
                </td>
                <td className="py-3 pr-4">
                  {record.confidence >= 0.5 && record.label !== 'uncertain'
                    ? record.label === 'ai_generated' ? 'AI-generated' : 'Real'
                    : 'Inconclusive'}
                </td>
                <td className="py-3 pr-4">{confidenceLabel(record.confidence)}</td>
                <td className="py-3 pr-4 text-slate-400">
                  {new Date(record.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3">
                  <button className="inline-flex items-center gap-1 text-slate-300 hover:text-white">
                    Open
                    <ArrowUpRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
