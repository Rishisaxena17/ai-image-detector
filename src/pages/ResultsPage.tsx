import { Download, ExternalLink, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ConfidenceMeter } from '../components/results/ConfidenceMeter'
import { MetricGrid } from '../components/results/MetricGrid'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export function ResultsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Result dashboard</div>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">Analysis output</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Download report</Button>
          <Link to="/detector">
            <Button>Run another analysis</Button>
          </Link>
        </div>
      </div>

      <Card className="border-white/10 bg-slate-900/80">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Prediction: AI-generated</CardTitle>
              <CardDescription>Demo preview result for the interface system</CardDescription>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-700">
              high signal
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <MetricGrid />

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
                <span>Result summary</span>
                <span className="inline-flex items-center gap-2 text-sky-200"><Sparkles size={14} /> AI signal</span>
              </div>
              <p className="mb-4 text-sm leading-7 text-slate-300">
                This is a clearly labelled demo preview and is not a real model result. It is shown here to demonstrate how a live prediction screen would communicate image risk indicators, confidence, and review details.
              </p>
              <ConfidenceMeter value={0.88} label="AI-generated likelihood" />
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <div className="mb-4 text-sm text-slate-300">Analysis details</div>
              <ul className="space-y-3 text-sm text-slate-200">
                <li>Model: VERITAS Vision 2.1</li>
                <li>File type: JPG</li>
                <li>Uploaded: 2026-10-28</li>
                <li>Review status: Completed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-slate-900/80">
          <CardHeader>
            <CardTitle>Evidence summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">Texture consistency: possible synthetic smoothing observed.</div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">Edge definition: mild digital artifact pattern detected.</div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">Background detail: localized anomalies suggest synthetic generation.</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/80">
          <CardHeader>
            <CardTitle>Report export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
              Download a structured report containing the prediction summary, confidence score, metadata, and evidence notes.
            </div>
            <Button className="w-full gap-2">
              <Download size={16} />
              Export PDF report
            </Button>
            <Link to="/analysis/an-1042" className="block">
              <Button variant="secondary" className="w-full gap-2">
                <ExternalLink size={16} />
                Open detailed analysis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
