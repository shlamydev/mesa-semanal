import { useId, useMemo } from 'react'
import { formatQty } from '../lib/format'
import { buildShoppingList, groupBySection, itemKey } from '../lib/shopping'
import { useStore } from '../state/useStore'
import '../styles/compra.css'

export function Compra() {
  const { state, dispatch, recipes } = useStore()
  const uid = useId()
  const { plan, people, meals, have, done } = state

  const items = useMemo(() => buildShoppingList(plan, recipes, people, meals), [plan, recipes, people, meals])

  if (!items.length) {
    return (
      <div className="emptystate">
        <span className="big" aria-hidden="true">
          🛒
        </span>
        <p>
          Tu lista está vacía. Añade comidas en la pestaña Semana y los ingredientes aparecerán aquí, sumados y
          ajustados a {people} {people === 1 ? 'persona' : 'personas'}.
        </p>
      </div>
    )
  }

  const need = items.filter((i) => !have[i.n])
  const got = items.filter((i) => have[i.n])
  const bought = need.filter((i) => done[itemKey(i.n, i.u)]).length
  const pct = Math.round((bought / Math.max(need.length, 1)) * 100)

  return (
    <>
      <div className="hint">
        {bought} de {need.length} comprados
      </div>
      <div className="bar" role="progressbar" aria-label="Progreso de la compra" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div style={{ width: `${pct}%` }} />
      </div>

      {groupBySection(need).map(([section, list]) => (
        <section className="cat" key={section} aria-label={section}>
          <h3>{section}</h3>
          {list.map((i) => {
            const key = itemKey(i.n, i.u)
            const checked = Boolean(done[key])
            const id = `${uid}-${key.replace(/\W+/g, '_')}`
            return (
              <div className={`it ${checked ? 'done' : ''}`} key={key}>
                <input type="checkbox" id={id} checked={checked} onChange={() => dispatch({ type: 'TOGGLE_DONE', key })} />
                <label htmlFor={id}>{i.n}</label>
                <span className="q">
                  {formatQty(i.q)} {i.u}
                </span>
                <button className="have" onClick={() => dispatch({ type: 'TOGGLE_HAVE', name: i.n })}>
                  Ya lo tengo
                </button>
              </div>
            )
          })}
        </section>
      ))}

      {got.length > 0 && (
        <section className="cat" aria-label="En tu despensa">
          <h3>En tu despensa</h3>
          {got.map((i) => (
            <div className="it" key={itemKey(i.n, i.u)}>
              <label>{i.n}</label>
              <span className="q">
                {formatQty(i.q)} {i.u}
              </span>
              <button className="have" onClick={() => dispatch({ type: 'TOGGLE_HAVE', name: i.n })}>
                Volver a la lista
              </button>
            </div>
          ))}
        </section>
      )}
    </>
  )
}
