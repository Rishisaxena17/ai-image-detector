import { BarChart3, Camera, FileText, History, Lock, ScanSearch, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { cn } from '../../lib/utils'

const navItems = [
  { label: 'Landing', to: '/', icon: Sparkles },
  { label: 'Detector', to: '/detector', icon: Camera },
  { label: 'Forensics', to: '/forensics', icon: ScanSearch },
  { label: 'Results', to: '/results', icon: BarChart3 },
  { label: 'History', to: '/history', icon: History },
  { label: 'Methodology', to: '/methodology', icon: FileText },
  { label: 'Privacy', to: '/privacy', icon: Lock },
]

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/80 px-5 py-6 lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20">
          V
        </div>
        <div>
          <div className="text-lg font-semibold text-white">VERITAS AI</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            forensic review
          </div>
        </div>
      </div>

      <nav className="space-y-1.5">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-sky-500/20 to-cyan-400/10 text-white ring-1 ring-sky-400/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white',
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
