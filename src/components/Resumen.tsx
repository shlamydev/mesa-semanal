import { formatKcal } from '../lib/format'
import { buildShoppingList, pendingCount } from '../lib/shopping'
import { weekSummary } from '../lib/summary'
import { MAX_GOAL } from '../state/reducer'
import { useStore } from '../state/useStore'
import '../styles/resumen.css'

/** Cifras de la semana: progreso del plan, media de kcal, objetivo diario y compra pendiente. */
export function Resumen() {
  const { state, dispatch, recipes } = useStore()
  const { filled, total, avgKcal } = weekSummary(state.plan, recipes, state.meals)
  const pending = pendingCount(
    buildShoppingList(state.plan, recipes, state.people, state.meals),
    state.have,
    state.done,
  )
  const pct = Math.round((filled / Math.max(total, 1)) * 100)

  return (
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
        <dt>
          <label htmlFor="goal">Objetivo diario</label>
        </dt>
        <dd className="goal">
          <input
            id="goal"
            type="number"
            inputMode="numeric"
            min={0}
            max={MAX_GOAL}
            step={50}
            placeholder="Sin objetivo"
            value={state.goal || ''}
            onChange={(e) => dispatch({ type: 'SET_GOAL', goal: Number(e.target.value) })}
          />
          <span>kcal</span>
        </dd>
      </div>
      <div>
        <dt>Por comprar</dt>
        <dd>{`${pending} ${pending === 1 ? 'ingrediente' : 'ingredientes'}`}</dd>
      </div>
    </dl>
  )
}
