import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const location = useLocation()

  return (
    <div className="app-shell relative min-h-dvh overflow-x-hidden text-[var(--text)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.03) 0%, transparent 40%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.025),transparent_35%)]"
        aria-hidden
      />
      <Sidebar />
      <main className="relative min-h-dvh pb-24 md:ml-[260px] md:pb-10">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
          <div key={location.pathname} className="page-transition">
            <Outlet />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
