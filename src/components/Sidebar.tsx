import type { ReactNode } from 'react'
import { MAX_PEOPLE, MIN_PEOPLE } from '../state/reducer'
import { useStore } from '../state/useStore'
import { useTheme } from '../state/useTheme'
import { BookIcon, CalendarIcon, CartIcon, LogoMark, MoonIcon, SunIcon } from './Icons'
import '../styles/sidebar.css'

export type Tab = 'week' | 'rec' | 'shop'

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: 'week', label: 'Semana', icon: <CalendarIcon /> },
  { id: 'rec', label: 'Recetas', icon: <BookIcon /> },
  { id: 'shop', label: 'Compra', icon: <CartIcon /> },
]

interface Props {
  tab: Tab
  onTab: (tab: Tab) => void
  /** ingredientes pendientes de comprar (insignia de la pestaña Compra) */
  pending: number
}

/** Barra lateral en escritorio; cabecera superior y pestañas inferiores en móvil. */
export function Sidebar({ tab, onTab, pending }: Props) {
  const { state, dispatch } = useStore()
  const [theme, toggleTheme] = useTheme()
  const set = (people: number) => dispatch({ type: 'SET_PEOPLE', people })

  return (
    <aside className="side">
      <div className="brand">
        <LogoMark size={34} />
        <h1>Mesa Semanal</h1>
      </div>

      <nav role="tablist" aria-label="Secciones" aria-orientation="vertical">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="panel"
            onClick={() => onTab(t.id)}
          >
            {t.icon}
            <span className="tablabel">{t.label}</span>
            {t.id === 'shop' && <span className="badge">{pending}</span>}
          </button>
        ))}
      </nav>

      <div className="sidetools">
        <div className="people" role="group" aria-label="Número de personas">
          <span>Personas</span>
          <div className="stepper">
            <button aria-label="Menos personas" disabled={state.people <= MIN_PEOPLE} onClick={() => set(state.people - 1)}>
              −
            </button>
            <b aria-live="polite">{state.people}</b>
            <button aria-label="Más personas" disabled={state.people >= MAX_PEOPLE} onClick={() => set(state.people + 1)}>
              +
            </button>
          </div>
        </div>
        <button
          className="themebtn"
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </aside>
  )
}
