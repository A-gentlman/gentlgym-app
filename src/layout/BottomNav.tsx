import { NavLink } from 'react-router-dom'
import { navItems } from './navConfig'

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--glass-border)] bg-[var(--bg)]/90 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden"
      aria-label="Main"
    >
      <ul className="mx-auto flex max-w-lg justify-around px-1">
        {navItems.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [
                  'group flex flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-medium transition-colors duration-300 sm:text-xs',
                  isActive ? 'text-[var(--text)]' : 'text-[var(--text-muted)]',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={[
                      'flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300',
                      isActive
                        ? 'border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-[0_0_18px_rgba(255,255,255,0.06)]'
                        : 'group-hover:bg-[var(--surface)]',
                    ].join(' ')}
                  >
                    <span className="scale-90 transition-transform duration-300 group-hover:scale-95">
                      {item.icon}
                    </span>
                  </span>
                  <span className="max-w-[4.5rem] truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
