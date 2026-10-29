import { Menu, Search } from 'lucide-react'

import { Sidebar } from './Sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050816] text-slate-100">
      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_35%),linear-gradient(180deg,#050816_0%,#0b1120_100%)]">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-slate-900/80 text-slate-200 lg:hidden"
                aria-label="Toggle navigation"
              >
                <Menu size={18} />
              </button>

              <div className="flex flex-1 items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-sky-200">
                    Demo preview
                  </div>
                </div>

                <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 md:flex">
                  <Search size={16} className="text-slate-400" />
                  Search case files
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
