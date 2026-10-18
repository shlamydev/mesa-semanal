import { useState } from 'react'
import { DAYS, mealById } from '../data/meals'
import { filterRecipes } from '../lib/filter'
import { formatKcalPerson } from '../lib/format'
import { parseSlot } from '../lib/slots'
import { useStore } from '../state/useStore'
import type { RecipeFilter } from '../types'
import { dietLabel } from './dietLabel'
import { Filtros } from './Filtros'
import { Modal } from './Modal'

interface Props {
  slot: string
  onClose: () => void
}

/** Selector de receta para un hueco concreto de la semana. */
export function PickRecipeModal({ slot, onClose }: Props) {
  const { recipes, dispatch } = useStore()
  const { day, meal } = parseSlot(slot)
  const [filter, setFilter] = useState<RecipeFilter>('all')
  const [query, setQuery] = useState('')
  const list = filterRecipes(recipes, { filter, query, meal })

  return (
    <Modal title={`${mealById(meal).label} del ${DAYS[day].toLowerCase()}`} onClose={onClose}>
      <input
        className="search"
        placeholder="Buscar receta"
        aria-label="Buscar receta"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Filtros value={filter} onChange={setFilter} />
      {list.map((r) => (
        <button
          key={r.id}
          className="pick"
          onClick={() => {
            dispatch({ type: 'SET_SLOT', slot, recipeId: r.id })
            onClose()
          }}
        >
          <span className="em">{r.e}</span>
          <span>
            <b>{r.n}</b>
            <br />
            <span className="meta">
              {r.t} min · {formatKcalPerson(r.k)}
              {r.tg.map((t) => ` · ${dietLabel[t]}`).join('')}
            </span>
          </span>
        </button>
      ))}
      {list.length === 0 && <p className="empty">Sin resultados con estos filtros.</p>}
      <button className="btn" style={{ marginTop: 12 }} onClick={onClose}>
        Cerrar
      </button>
    </Modal>
  )
}
