import { useEffect, useMemo, useRef, useState, type CSSProperties, type DragEvent, type KeyboardEvent } from 'react'
import { DAYS, MEALS, type Meal } from '../data/meals'
import { formatKcal } from '../lib/format'
import { dayKcal, goalProgress } from '../lib/nutrition'
import { slotKey } from '../lib/slots'
import { suggestPlan } from '../lib/suggest'
import { weekDates, weekLabel } from '../lib/week'
import { useStore } from '../state/useStore'
import type { Notify } from '../types'
import '../styles/semana.css'

interface Props {
  onPick: (slot: string) => void
  notify: Notify
}

export function Semana({ onPick, notify }: Props) {
  const { state, dispatch, recipes } = useStore()
  const { meals, plan } = state
  const [over, setOver] = useState<string | null>(null)
  const weekRef = useRef<HTMLDivElement>(null)
  const byId = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes])
  const active = MEALS.filter((m) => meals.includes(m.id))
  const [now] = useState(() => new Date())
  const dates = useMemo(() => weekDates(now), [now])
  const today = (now.getDay() + 6) % 7 // lunes = 0

  // La animación de «sello» solo debe verse en huecos que se rellenan después de cargar la vista.
  useEffect(() => {
    weekRef.current?.classList.add('live')
  }, [])

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
      <div className="weekhead">
        <h2 className="pagetitle">{weekLabel(dates)}</h2>
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
              const patch = { plan: state.plan, done: state.done }
              dispatch({ type: 'CLEAR_WEEK' })
              notify('Semana vaciada', () => dispatch({ type: 'RESTORE', patch }))
            }}
          >
            Vaciar
          </button>
        </div>
      </div>
      <p className="hint weekhint">
        Toca un hueco para elegir receta. Arrastra una comida para moverla o intercambiarla. Las kcal son aproximadas
        y por persona.
      </p>

      <div className="mealbar" role="group" aria-label="Comidas que se muestran">
        <span className="hint">Comidas:</span>
        {MEALS.map((m) => (
          <button key={m.id} className="chip" aria-pressed={meals.includes(m.id)} onClick={() => toggleMeal(m)}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="week" ref={weekRef} style={{ '--cols': active.length, '--span': active.length + 1 } as CSSProperties}>
        {active.map((m, i) => (
          <div className="colh" key={m.id} style={{ '--r': i + 2 } as CSSProperties}>
            {m.label}
          </div>
        ))}
        {DAYS.map((dayName, day) => {
          const kcal = dayKcal(plan, recipes, day, meals)
          const goal = kcal > 0 ? goalProgress(kcal, state.goal) : null
          return (
            <div className="day" key={dayName} style={{ '--c': day + 2 } as CSSProperties}>
              <div className="dayhead">
                <span className={`dnum ${day === today ? 'is-today' : ''}`}>{dates[day].getDate()}</span>
                <div className="dinfo">
                  <h3>
                    {dayName}
                    {day === today && <span className="today">Hoy</span>}
                  </h3>
                  {kcal > 0 && <span className="meta">{formatKcal(kcal)}</span>}
                  {goal && (
                    <span className={`goalbar ${goal.over > 0 ? 'over' : ''}`}>
                      <span
                        className="track"
                        role="progressbar"
                        aria-label={`Objetivo de kcal del ${dayName.toLowerCase()}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={goal.pct}
                      >
                        <span style={{ width: `${goal.pct}%` }} />
                      </span>
                      {goal.over > 0 && <span className="meta">+{goal.over} sobre el objetivo</span>}
                    </span>
                  )}
                </div>
              </div>
              <div className="slots">
                {active.map((m) => {
                  const key = slotKey(day, m.id)
                  const recipe = byId.get(plan[key])
                  const cls = (recipe ? 'slot on' : 'slot') + (over === key ? ' over' : '')
                  const label = (
                    <span className="k">
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
                      key={`${key}-${recipe.id}`}
                      className={cls}
                      data-k={key}
                      role="button"
                      tabIndex={0}
                      draggable
                      aria-label={`${m.label} del ${dayName.toLowerCase()}: ${recipe.n}. Cambiar receta`}
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
                          {recipe.t} min · {Math.round(recipe.k)} kcal
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
