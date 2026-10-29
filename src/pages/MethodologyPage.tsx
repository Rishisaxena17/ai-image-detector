import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export function MethodologyPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Methodology</div>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">How the model is used</h1>
      </div>

      <Card className="border-white/10 bg-slate-900/80">
        <CardHeader>
          <CardTitle>Signal-based assessment</CardTitle>
          <CardDescription>Explain the model workflow in clear, accessible language.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-slate-300">
          <p>VERITAS AI applies a pretrained image-classification model to assess whether an uploaded image exhibits patterns associated with synthetic or AI-generated media.</p>
          <p>The system estimates the likelihood of synthetic generation based on extracted visual features, style consistency, compression artifacts, and texture behavior. This is a statistical estimate, not a forensic proof.</p>
          <p>It is designed to support analysts by highlighting suspicious patterns for manual review and comparison rather than acting as an absolute decision-maker.</p>
        </CardContent>
      </Card>
    </div>
  )
}
