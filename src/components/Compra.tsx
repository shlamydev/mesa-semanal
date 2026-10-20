import { useId, useMemo } from 'react'
import { shoppingListText } from '../lib/exportList'
import { formatQty } from '../lib/format'
import { buildShoppingList, groupBySection, itemKey } from '../lib/shopping'
import { useStore } from '../state/useStore'
import '../styles/compra.css'

interface Props {
  notify: (msg: string) => void
}

export function Compra({ notify }: Props) {
  const { state, dispatch, recipes } = useStore()
  const uid = useId()
  const { plan, people, meals, have, done } = state

  const items = useMemo(() => buildShoppingList(plan, recipes, people, meals), [plan, recipes, people, meals])

  if (!items.length) {
    return (
      <>
        <h2 className="pagetitle">Lista de la compra</h2>
        <div className="emptystate">
          <span className="big" aria-hidden="true">
            🛒
          </span>
          <p>
            Tu lista está vacía. Añade comidas en la pestaña Semana y los ingredientes aparecerán aquí, sumados y
            ajustados a {people} {people === 1 ? 'persona' : 'personas'}.
          </p>
        </div>
      </>
    )
  }

  const need = items.filter((i) => !have[i.n])
  const got = items.filter((i) => have[i.n])
  const bought = need.filter((i) => done[itemKey(i.n, i.u)]).length
  const pct = Math.round((bought / Math.max(need.length, 1)) * 100)

  const text = shoppingListText(items, have, done, people)
  const canShare = typeof navigator.share === 'function'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      notify('Lista copiada')
    } catch {
      notify('No se pudo copiar la lista')
    }
  }
  const share = async () => {
    try {
      await navigator.share({ title: 'Lista de la compra', text })
    } catch {
      // El usuario canceló el diálogo de compartir: no hay nada que avisar.
    }
  }

  return (
    <>
      <h2 className="pagetitle">Lista de la compra</h2>
      <div className="shophead">
        <div className="hint">
          {bought} de {need.length} comprados
        </div>
        {text && (
          <div className="tools noprint">
            <button className="btn" onClick={copy}>
              Copiar lista
            </button>
            {canShare && (
              <button className="btn" onClick={share}>
                Compartir
              </button>
            )}
            <button className="btn" onClick={() => window.print()}>
              Imprimir
            </button>
          </div>
        )}
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
