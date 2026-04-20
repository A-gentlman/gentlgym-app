import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/useTheme'
import { navItems } from './navConfig'

export function Sidebar() {
  useTheme()

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-[260px] flex-col border-r border-white/[0.06] bg-[#0A0A0A]/80 py-8 backdrop-blur-2xl md:flex">
      {/* Subtle gradient overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.01) 100%)',
        }}
        aria-hidden
      />

      <div className="relative px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 bg-transparent items-center justify-center overflow-visible">
            <img 
              src="/GentlGYMlogo.png" 
              alt="GentlGYM" 
              className="h-full w-full object-contain drop-shadow-[0_4px_16px_rgba(255,255,255,0.15)] invert filter"
              onError={(e) => { 
                e.currentTarget.style.display = 'none'; 
                e.currentTarget.parentElement!.className = "relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_4px_16px_rgba(99,102,241,0.35)]";
                e.currentTarget.parentElement!.innerHTML = '<span class="text-sm font-bold tracking-tight">G</span>'; 
              }} 
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-[900] tracking-tight text-[var(--text)]">GentlGYM</p>
            <p className="text-[11px] font-medium text-white/40">Training tracker</p>
          </div>
        </div>
      </div>

      <nav className="relative mt-10 flex flex-1 flex-col gap-0.5 px-3" aria-label="Main">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ease-out',
                isActive
                  ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_3px_rgba(0,0,0,0.2)]'
                  : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-400 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                )}
                <span
                  className={[
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'bg-white/[0.04] text-white/50 group-hover:bg-white/[0.06] group-hover:text-white/70',
                  ].join(' ')}
                >
                  {item.icon}
                </span>
                <span className="relative z-[1]">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative mt-auto pt-4 px-4">
        <p className="px-2 text-center text-[10px] leading-relaxed text-white/25">
          GentlGYM · v2.0
        </p>
      </div>
    </aside>
  )
}
