import type { RecipeFilter } from '../types'
import '../styles/recetas.css'

const FILTERS: readonly (readonly [RecipeFilter, string])[] = [
  ['all', 'Todas'],
  ['fast', 'Rápidas (≤20 min)'],
  ['v', 'Vegetarianas'],
  ['vg', 'Veganas'],
]

interface Props {
  value: RecipeFilter
  onChange: (f: RecipeFilter) => void
}

export function Filtros({ value, onChange }: Props) {
  return (
    <div className="filters" role="group" aria-label="Filtrar recetas">
      {FILTERS.map(([id, label]) => (
        <button key={id} className="chip" aria-pressed={value === id} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </div>
  )
}
