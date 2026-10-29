import { AlertTriangle, CheckCircle2, FileImage, ShieldCheck } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const checks = [
  { label: 'File fingerprint', value: 'SHA-256 verified', status: 'checked' },
  { label: 'Metadata scan', value: 'EXIF data reviewed safely', status: 'checked' },
  { label: 'Compression review', value: 'Mild artifacts noted', status: 'warning' },
  { label: 'Image integrity', value: 'No hard evidence of manipulation', status: 'checked' },
]

export function ForensicsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Forensics</div>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">Image inspection</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/10 bg-slate-900/80">
          <CardHeader>
            <CardTitle>Evidence review</CardTitle>
            <CardDescription>Review the image-level checks in a simple, readable layout.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-sky-200">
                  <FileImage size={18} />
                </div>
                <div>
                  <div className="font-medium text-white">sample-image.jpg</div>
                  <div className="text-sm text-slate-400">JPG • 2.3 MB</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {checks.map(({ label, value, status }) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <div>
                    <div className="text-sm font-medium text-slate-100">{label}</div>
                    <div className="text-xs text-slate-400">{value}</div>
                  </div>

                  {status === 'checked' ? (
                    <CheckCircle2 size={18} className="text-green-400" />
                  ) : (
                    <AlertTriangle size={18} className="text-amber-300" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck size={18} /> Safety note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-slate-300">
            <p>These checks are support signals for human review. They do not prove that an image is authentic or synthetic.</p>
            <p>Metadata, compression, and pixel patterns should be examined together with the broader context of the image.</p>
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3 text-slate-200">
              Use forensic inspection to guide review, not to make a final claim.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
