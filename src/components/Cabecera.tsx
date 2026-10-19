import { formatKcal } from '../lib/format'
import { buildShoppingList, pendingCount } from '../lib/shopping'
import { weekSummary } from '../lib/summary'
import { MAX_PEOPLE, MIN_PEOPLE } from '../state/reducer'
import { useStore } from '../state/useStore'
import { useTheme } from '../state/useTheme'
import '../styles/cabecera.css'

export function Cabecera() {
  const { state, dispatch, recipes } = useStore()
  const [theme, toggleTheme] = useTheme()
  const set = (people: number) => dispatch({ type: 'SET_PEOPLE', people })

  const { filled, total, avgKcal } = weekSummary(state.plan, recipes, state.meals)
  const pending = pendingCount(
    buildShoppingList(state.plan, recipes, state.people, state.meals),
    state.have,
    state.done,
  )
  const pct = Math.round((filled / Math.max(total, 1)) * 100)

  return (
    <header>
      <div className="brand">
        <h1>Mesa Semanal</h1>
        <p className="hint">Planifica tus comidas y compra solo lo que necesitas.</p>
      </div>
      <div className="headtools">
        <div className="people" role="group" aria-label="Número de personas">
          Personas
          <button aria-label="Menos personas" disabled={state.people <= MIN_PEOPLE} onClick={() => set(state.people - 1)}>
            −
          </button>
          <b aria-live="polite">{state.people}</b>
          <button aria-label="Más personas" disabled={state.people >= MAX_PEOPLE} onClick={() => set(state.people + 1)}>
            +
          </button>
        </div>
        <button
          className="themebtn"
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <dl className="summary" aria-label="Resumen de la semana">
        <div>
          <dt>Planificado</dt>
          <dd>{`${filled} de ${total} comidas`}</dd>
          <div className="bar" role="progressbar" aria-label="Semana planificada" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <div style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div>
          <dt>Media diaria</dt>
          <dd>{avgKcal > 0 ? `${formatKcal(avgKcal)} por persona` : 'Sin datos aún'}</dd>
        </div>
        <div>
          <dt>Por comprar</dt>
          <dd>{`${pending} ${pending === 1 ? 'ingrediente' : 'ingredientes'}`}</dd>
        </div>
      </dl>
    </header>
  )
}
