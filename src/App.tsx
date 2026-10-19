import { useEffect, useRef, useState } from 'react'
import { Cabecera } from './components/Cabecera'
import { Compra } from './components/Compra'
import { NewRecipeModal } from './components/NewRecipeModal'
import { PickRecipeModal } from './components/PickRecipeModal'
import { RecipeDetailModal } from './components/RecipeDetailModal'
import { Recetas } from './components/Recetas'
import { Semana } from './components/Semana'
import { buildShoppingList, pendingCount } from './lib/shopping'
import { StoreProvider } from './state/StoreProvider'
import { useStore } from './state/useStore'
import type { Notify } from './types'

type Tab = 'week' | 'rec' | 'shop'
type ModalState =
  | { kind: 'pick'; slot: string }
  | { kind: 'recipe'; id: number }
  | { kind: 'new'; slot?: string; name?: string }
  | { kind: 'edit'; id: number }
  | null

const TABS: { id: Tab; label: string }[] = [
  { id: 'week', label: 'Semana' },
  { id: 'rec', label: 'Recetas' },
  { id: 'shop', label: 'Compra' },
]

function Shell() {
  const { state, recipes } = useStore()
  const [tab, setTab] = useState<Tab>('week')
  const [toast, setToast] = useState<{ msg: string; undo?: () => void } | null>(null)
  const [modal, setModal] = useState<ModalState>(null)
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const notify: Notify = (msg, undo) => {
    setToast({ msg, undo })
    window.clearTimeout(timer.current)
    // Con «Deshacer» el aviso dura más para dar tiempo a pulsarlo.
    timer.current = window.setTimeout(() => setToast(null), undo ? 6000 : 1800)
  }
  const close = () => setModal(null)

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
        {tab === 'week' && <Semana onPick={(slot) => setModal({ kind: 'pick', slot })} notify={notify} />}
        {tab === 'rec' && (
          <Recetas onOpen={(id) => setModal({ kind: 'recipe', id })} onNew={(name) => setModal({ kind: 'new', name })} />
        )}
        {tab === 'shop' && <Compra notify={notify} />}
      </main>

      {modal?.kind === 'pick' && (
        <PickRecipeModal
          slot={modal.slot}
          onClose={close}
          onCreate={(name) => setModal({ kind: 'new', slot: modal.slot, name })}
        />
      )}
      {modal?.kind === 'recipe' && (
        <RecipeDetailModal
          id={modal.id}
          onClose={close}
          onEdit={(id) => setModal({ kind: 'edit', id })}
          notify={notify}
        />
      )}
      {modal?.kind === 'edit' && (
        <NewRecipeModal
          recipe={recipes.find((r) => r.id === modal.id)}
          onClose={() => setModal({ kind: 'recipe', id: modal.id })}
          notify={notify}
        />
      )}
      {modal?.kind === 'new' && (
        <NewRecipeModal slot={modal.slot} initialName={modal.name} onClose={close} notify={notify} />
      )}

      <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">
        {toast?.msg}
        {toast?.undo && (
          <button
            onClick={() => {
              toast.undo?.()
              window.clearTimeout(timer.current)
              setToast(null)
            }}
          >
            Deshacer
          </button>
        )}
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
