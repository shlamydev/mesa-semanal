import { useState } from 'react'
import { formatKcalPerson, formatQty } from '../lib/format'
import { scaleQty } from '../lib/shopping'
import { useStore } from '../state/useStore'
import { dietLabel } from './dietLabel'
import { Modal } from './Modal'

interface Props {
  id: number
  onClose: () => void
  /** Abre el formulario para editar una receta propia. */
  onEdit: (id: number) => void
  notify: (msg: string) => void
}

export function RecipeDetailModal({ id, onClose, onEdit, notify }: Props) {
  const { state, recipes, dispatch } = useStore()
  const [confirming, setConfirming] = useState(false)
  const recipe = recipes.find((r) => r.id === id)
  if (!recipe) return null
  const { people } = state

  return (
    <Modal
      title={
        <>
          {recipe.e} {recipe.n}
        </>
      }
      onClose={onClose}
    >
      <div className="meta">
        {recipe.t} min · {formatKcalPerson(recipe.k)} · para {people} {people === 1 ? 'persona' : 'personas'}
      </div>
      {(recipe.custom || recipe.tg.length > 0) && (
        <div style={{ marginTop: 6 }}>
          {recipe.custom && <span className="tag">Propia</span>}
          {recipe.tg.map((t) => (
            <span className="tag" key={t}>
              {dietLabel[t]}
            </span>
          ))}
        </div>
      )}
      {recipe.ing.length > 0 ? (
        <ul>
          {recipe.ing.map(([n, qty, unit]) => (
            <li key={`${n}|${unit}`}>
              {formatQty(scaleQty(qty, people))} {unit} de {n.toLowerCase()}
            </li>
          ))}
        </ul>
      ) : (
        <p className="hint">Esta receta no tiene ingredientes.</p>
      )}
      {recipe.s && recipe.s.length > 0 && (
        <>
          <h3 className="steps-title">Preparación</h3>
          <ol className="steps">
            {recipe.s.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </>
      )}
      <p className="hint">Cambia el número de personas arriba y las cantidades se ajustan solas.</p>

      {confirming ? (
        <div role="alertdialog" aria-label="Confirmar eliminación">
          <p>¿Eliminar «{recipe.n}»? También se quitará de la semana.</p>
          <div className="actions">
            <button
              className="btn danger"
              onClick={() => {
                dispatch({ type: 'DELETE_CUSTOM', id: recipe.id })
                notify(`Receta «${recipe.n}» eliminada`)
                onClose()
              }}
            >
              Sí, eliminar
            </button>
            <button className="btn" onClick={() => setConfirming(false)}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="actions">
          <button className="btn" onClick={onClose}>
            Cerrar
          </button>
          {recipe.custom && (
            <button className="btn" onClick={() => onEdit(recipe.id)}>
              Editar receta
            </button>
          )}
          {recipe.custom && (
            <button className="btn danger" onClick={() => setConfirming(true)}>
              Eliminar receta
            </button>
          )}
        </div>
      )}
    </Modal>
  )
}
