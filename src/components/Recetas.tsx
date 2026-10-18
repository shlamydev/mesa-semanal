import { useState } from 'react'
import { filterRecipes } from '../lib/filter'
import { formatKcalPerson } from '../lib/format'
import { useStore } from '../state/useStore'
import type { RecipeFilter } from '../types'
import { CreateRecipeButton } from './CreateRecipeButton'
import { dietLabel } from './dietLabel'
import { Filtros } from './Filtros'
import '../styles/recetas.css'

interface Props {
  onOpen: (id: number) => void
  onNew: (name?: string) => void
}

export function Recetas({ onOpen, onNew }: Props) {
  const { recipes } = useStore()
  const [filter, setFilter] = useState<RecipeFilter>('all')
  const [query, setQuery] = useState('')
  const list = filterRecipes(recipes, { filter, query })

  return (
    <>
      <div className="tools">
        <input
          className="search"
          placeholder="Buscar receta"
          aria-label="Buscar receta"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn pri" onClick={() => onNew()}>
          + Nueva receta
        </button>
      </div>
      <Filtros value={filter} onChange={setFilter} />
      <div className="grid">
        {list.map((r) => (
          <button key={r.id} className="rc" onClick={() => onOpen(r.id)}>
            <span className="em">{r.e}</span>
            <b>{r.n}</b>
            <span className="meta">
              {r.t} min · {r.ing.length === 0 ? 'sin ingredientes' : `${r.ing.length} ${r.ing.length === 1 ? 'ingrediente' : 'ingredientes'}`}
            </span>
            <span className="meta">{formatKcalPerson(r.k)}</span>
            <span>
              {r.custom && <span className="tag">Propia</span>}
              {r.tg.map((t) => (
                <span className="tag" key={t}>
                  {dietLabel[t]}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
      {list.length === 0 && (
        <div className="noresults">
          <p className="empty">Ninguna receta coincide. Prueba con otro filtro.</p>
          <CreateRecipeButton query={query} onClick={() => onNew(query.trim())} />
        </div>
      )}
    </>
  )
}
