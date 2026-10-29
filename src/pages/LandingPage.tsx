import { ArrowRight, CheckCircle2, ChevronRight, Shield, Sparkles, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

const featureCards = [
  { title: 'Simple upload flow', description: 'Upload an image, review it, and analyze it without extra clutter.', icon: UploadCloud },
  { title: 'Clear AI signal', description: 'See a straightforward prediction and confidence score in plain language.', icon: Sparkles },
  { title: 'Easy review history', description: 'Keep each result organized so it is easy to review and compare later.', icon: Shield },
]

export function LandingPage() {
  return (
    <div className="space-y-8 pb-12">
      <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),transparent_30%),linear-gradient(135deg,#0b1120_0%,#111827_35%,#0f172a_100%)] p-6 shadow-[0_30px_80px_rgba(14,116,144,0.18)] sm:p-8 lg:p-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div className="mb-4 inline-flex items-center rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-sky-200">
              AI image forensics
            </div>
            <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              Detect synthetic imagery with real clarity.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              VERITAS AI helps you review uploaded images with a clear confidence estimate, visual evidence cues, and a confident workflow built for fast analysis.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/detector">
                <Button className="gap-2">
                  Analyze image <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/methodology">
                <Button variant="outline">View method</Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Easy upload</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Clear review</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Quick results</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
            <Card className="overflow-hidden border-white/10 bg-slate-900/80 p-0">
              <div className="border-b border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Preview</div>
                  <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-1 text-[10px] uppercase text-sky-200">sample</span>
                </div>
              </div>
              <div className="space-y-4 p-4">
                <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3">
                  <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Input image</span>
                    <span>2.3 MB</span>
                  </div>
                  <div className="h-44 rounded-xl bg-[linear-gradient(135deg,_rgba(56,189,248,0.18),_rgba(15,23,42,0.9)),url('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                    <span>AI-generated likelihood</span>
                    <span className="font-semibold text-white">88%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {featureCards.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="h-full border-white/10 bg-slate-900/80">
            <CardContent className="p-5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-400/20 text-sky-200 ring-1 ring-sky-300/20">
                <Icon size={20} />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
              <p className="text-sm leading-6 text-slate-300">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-white/10 bg-slate-900/80">
          <CardContent className="space-y-5 p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">How it works</div>
            <h3 className="text-2xl font-semibold text-white">A straightforward review flow.</h3>
            <ol className="space-y-4 text-sm text-slate-300">
              <li className="flex gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-100">1</span> Upload an image from your device.</li>
              <li className="flex gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-100">2</span> Check the file and review the result.</li>
              <li className="flex gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-100">3</span> View the prediction and confidence score.</li>
              <li className="flex gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-100">4</span> Keep a record of each review for later.</li>
            </ol>
            <Link to="/detector">
              <Button variant="secondary" className="gap-2">Start a review <ChevronRight size={16} /></Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/80">
          <CardContent className="p-6">
            <div className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Important note</div>
            <div className="space-y-4 text-sm leading-6 text-slate-300">
              <p>VERITAS AI provides a helpful estimate to support human review, not a final verdict.</p>
              <p>Image quality, compression, and editing can affect the score. Use the output as part of a broader review process.</p>
              <p className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-3 text-sky-100">This tool is meant to assist review—not replace judgment.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
