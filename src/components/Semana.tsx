import { useMemo, useState, type CSSProperties, type DragEvent, type KeyboardEvent } from 'react'
import { DAYS, MEALS, type Meal } from '../data/meals'
import { formatKcal, formatKcalPerson } from '../lib/format'
import { dayKcal } from '../lib/nutrition'
import { slotKey } from '../lib/slots'
import { suggestPlan } from '../lib/suggest'
import { useStore } from '../state/useStore'
import '../styles/semana.css'

interface Props {
  onPick: (slot: string) => void
  notify: (msg: string) => void
}

export function Semana({ onPick, notify }: Props) {
  const { state, dispatch, recipes } = useStore()
  const { meals, plan } = state
  const [over, setOver] = useState<string | null>(null)
  const byId = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes])
  const active = MEALS.filter((m) => meals.includes(m.id))
  const [today] = useState(() => (new Date().getDay() + 6) % 7) // lunes = 0

  const toggleMeal = (meal: Meal) => {
    if (meals.length === 1 && meals.includes(meal.id)) {
      notify('Debe quedar al menos una comida activa')
      return
    }
    dispatch({ type: 'TOGGLE_MEAL', meal: meal.id })
  }

  const dropOn = (e: DragEvent, to: string) => {
    e.preventDefault()
    setOver(null)
    const from = e.dataTransfer.getData('text/plain')
    if (from) dispatch({ type: 'MOVE_SLOT', from, to })
  }

  const dropProps = (key: string) => ({
    onDragOver: (e: DragEvent) => {
      e.preventDefault()
      setOver(key)
    },
    onDragLeave: () => setOver(null),
    onDrop: (e: DragEvent) => dropOn(e, key),
  })

  return (
    <>
      <div className="tools">
        <button
          className="btn pri"
          onClick={() => {
            dispatch({ type: 'SET_PLAN', plan: suggestPlan(recipes, meals, plan) })
            notify('Semana completada con sugerencias')
          }}
        >
          Sugerir semana
        </button>
        <button
          className="btn"
          onClick={() => {
            dispatch({ type: 'CLEAR_WEEK' })
            notify('Semana vaciada')
          }}
        >
          Vaciar
        </button>
        <span className="hint">
          Toca un hueco para elegir receta. Arrastra una comida para moverla o intercambiarla. Las kcal son
          aproximadas y por persona.
        </span>
      </div>

      <div className="mealbar" role="group" aria-label="Comidas que se muestran">
        <span className="hint">Comidas:</span>
        {MEALS.map((m) => (
          <button key={m.id} className="chip" aria-pressed={meals.includes(m.id)} onClick={() => toggleMeal(m)}>
            <i style={{ background: m.color }} />
            {m.label}
          </button>
        ))}
      </div>

      <div className="week" style={{ '--cols': active.length } as CSSProperties}>
        <div />
        {active.map((m) => (
          <div className="colh" key={m.id}>
            <i style={{ background: m.color }} />
            {m.label}
          </div>
        ))}
        {DAYS.map((dayName, day) => {
          const kcal = dayKcal(plan, recipes, day, meals)
          return (
            <div className="day" key={dayName}>
              <div className="dayhead">
                <h3>
                  {dayName}
                  {day === today && <span className="today">Hoy</span>}
                </h3>
                {kcal > 0 && <span className="meta">{formatKcal(kcal)}</span>}
              </div>
              <div className="slots">
                {active.map((m) => {
                  const key = slotKey(day, m.id)
                  const recipe = byId.get(plan[key])
                  const cls = (recipe ? 'slot on' : 'slot') + (over === key ? ' over' : '')
                  const label = (
                    <span className="k">
                      <i style={{ background: m.color }} />
                      {m.label}
                    </span>
                  )
                  if (!recipe) {
                    return (
                      <button key={key} className={cls} data-k={key} onClick={() => onPick(key)} {...dropProps(key)}>
                        {label}
                        <span className="add">+ Añadir</span>
                      </button>
                    )
                  }
                  const onKeyDown = (e: KeyboardEvent) => {
                    if (e.target !== e.currentTarget) return
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onPick(key)
                    }
                  }
                  return (
                    <div
                      key={key}
                      className={cls}
                      data-k={key}
                      role="button"
                      tabIndex={0}
                      draggable
                      aria-label={`${m.label} del ${dayName.toLowerCase()}: ${recipe.n}. Cambiar receta`}
                      style={{ '--c': m.color } as CSSProperties}
                      onClick={() => onPick(key)}
                      onKeyDown={onKeyDown}
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', key)}
                      {...dropProps(key)}
                    >
                      <span className="em" aria-hidden="true">
                        {recipe.e}
                      </span>
                      {label}
                      <span className="txt">
                        <span className="n">{recipe.n}</span>
                        <span className="meta">
                          {recipe.t} min · {formatKcalPerson(recipe.k)}
                        </span>
                      </span>
                      <button
                        className="x"
                        aria-label={`Quitar ${recipe.n}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          dispatch({ type: 'REMOVE_SLOT', slot: key })
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
