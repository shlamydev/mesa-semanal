import { useEffect, useRef, useState } from 'react'
import { Cabecera } from './components/Cabecera'
import { Compra } from './components/Compra'
import { StoreProvider } from './state/StoreProvider'
import { useStore } from './state/useStore'
import { buildShoppingList, pendingCount } from './lib/shopping'

type Tab = 'week' | 'rec' | 'shop'

const TABS: { id: Tab; label: string }[] = [
  { id: 'week', label: 'Semana' },
  { id: 'rec', label: 'Recetas' },
  { id: 'shop', label: 'Compra' },
]

function Shell() {
  const { state, recipes } = useStore()
  const [tab, setTab] = useState<Tab>('week')
  const [toast, setToast] = useState('')
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const notify = (msg: string) => {
    setToast(msg)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 1800)
  }
  void notify

  const pending = pendingCount(
    buildShoppingList(state.plan, recipes, state.people, state.meals),
    state.have,
    state.done,
  )

  return (
    <div className="wrap">
      <Cabecera />
      <nav role="tablist" aria-label="Secciones">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="panel"
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id === 'shop' && <span className="badge">{pending}</span>}
          </button>
        ))}
      </nav>
      <main id="panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === 'shop' ? <Compra /> : <p className="empty">En construcción</p>}
      </main>
      <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
