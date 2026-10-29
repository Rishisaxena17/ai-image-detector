import { ArrowLeft, Download, FileText, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

import { sampleDetail } from '../data/demo'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { ConfidenceMeter } from '../components/results/ConfidenceMeter'

export function AnalysisDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/history" className="inline-flex items-center gap-2 text-sm text-slate-300">
          <ArrowLeft size={16} />
          Back to history
        </Link>
        <Button variant="outline" className="gap-2">
          <Download size={16} />
          Download report
        </Button>
      </div>

      <Card className="border-white/10 bg-slate-900/80">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Case ID {sampleDetail.id}</div>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">{sampleDetail.title}</h1>
            </div>
            <Badge variant={sampleDetail.label === 'ai_generated' ? 'default' : 'success'}>
              {sampleDetail.label.replace('_', ' ')}
            </Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
                <ShieldAlert size={16} className="text-amber-300" />
                Result summary
              </div>
              <p className="text-sm leading-7 text-slate-300">{sampleDetail.summary}</p>
              <div className="mt-6">
                <ConfidenceMeter value={sampleDetail.confidence} />
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <div className="text-sm font-medium text-slate-200">Case metadata</div>
              <div className="space-y-2 text-sm text-slate-400">
                <div>Created: {new Date(sampleDetail.createdAt).toLocaleString()}</div>
                <div>Model: {sampleDetail.model}</div>
                <div>File: {sampleDetail.fileName}</div>
                <div>Format: {sampleDetail.fileType}</div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm text-slate-200">
                <FileText size={16} className="text-sky-200" />
                Evidence notes
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                {sampleDetail.evidence.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900 p-3">
                    <div className="mb-1 font-medium text-white">{item.label}</div>
                    <div>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <div className="mb-3 text-sm font-medium text-slate-200">Artifacts</div>
              <div className="space-y-3 text-sm text-slate-300">
                {sampleDetail.artifacts.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900 p-3">
                    <span>{item.label}</span>
                    <span className="text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
