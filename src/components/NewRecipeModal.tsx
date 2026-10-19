import { useId, useState, type FormEvent } from 'react'
import { MEAL_ORDER, MEALS, SECTIONS, mealById } from '../data/meals'
import { parseSlot } from '../lib/slots'
import { useStore } from '../state/useStore'
import type { Diet, Ingredient, MealId, Recipe } from '../types'
import { Modal } from './Modal'
import '../styles/form.css'

interface Props {
  /** Si se crea desde un hueco, la receta se asigna a ese hueco. */
  slot?: string
  initialName?: string
  /** Si se indica, el formulario edita esta receta propia en vez de crear una. */
  recipe?: Recipe
  onClose: () => void
  notify: (msg: string) => void
}

interface Row {
  name: string
  qty: string
  unit: string
  section: string
}

const emptyRow = (): Row => ({ name: '', qty: '', unit: 'ud', section: SECTIONS[0] })
const DEFAULT_EMOJI = '🍽️'

const rowsOf = (r: Recipe): Row[] =>
  r.ing.length
    ? r.ing.map(([name, qty, unit, section]) => ({ name, qty: String(qty), unit, section }))
    : [emptyRow()]

export function NewRecipeModal({ slot, initialName = '', recipe, onClose, notify }: Props) {
  const { dispatch } = useStore()
  const uid = useId()
  const slotMeal = !recipe && slot ? parseSlot(slot).meal : null

  const [name, setName] = useState(recipe?.n ?? initialName)
  const [emoji, setEmoji] = useState(recipe?.e ?? DEFAULT_EMOJI)
  const [minutes, setMinutes] = useState(String(recipe?.t ?? 20))
  const [kcal, setKcal] = useState(String(recipe?.k ?? 400))
  const [diet, setDiet] = useState<'' | Diet>(recipe?.tg[0] ?? '')
  const [meals, setMeals] = useState<MealId[]>(
    recipe ? MEAL_ORDER.filter((id) => recipe.m.includes(id)) : slotMeal ? [slotMeal] : ['l', 'd'],
  )
  const [rows, setRows] = useState<Row[]>(recipe ? rowsOf(recipe) : [emptyRow()])
  const [steps, setSteps] = useState(recipe?.s?.join('\n') ?? '')
  const [error, setError] = useState('')

  const setRow = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)))

  const toggleMeal = (id: MealId) =>
    setMeals((ms) => (ms.includes(id) ? ms.filter((m) => m !== id) : [...ms, id]))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n = name.trim()
    const t = Number(minutes)
    const k = Number(kcal)
    if (!n) return setError('Escribe un nombre para la receta.')
    if (!Number.isFinite(t) || t < 1) return setError('Indica los minutos de preparación (1 o más).')
    if (!Number.isFinite(k) || k < 0) return setError('Indica las kcal por persona (0 o más).')
    if (meals.length === 0) return setError('Elige al menos una comida donde encaje la receta.')

    const ing: Ingredient[] = []
    for (const row of rows) {
      const rowName = row.name.trim()
      if (!rowName) continue // filas vacías: los ingredientes son opcionales
      const qty = Number(row.qty.replace(',', '.'))
      if (!Number.isFinite(qty) || qty <= 0) return setError(`Indica una cantidad válida para «${rowName}».`)
      ing.push([rowName, qty, row.unit.trim() || 'ud', row.section])
    }

    const stepList = steps
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)
    const data = {
      n,
      e: emoji.trim() || DEFAULT_EMOJI,
      t: Math.round(t),
      k: Math.round(k),
      tg: diet ? [diet] : [],
      m: MEAL_ORDER.filter((id) => meals.includes(id)).join(''),
      ing,
      ...(stepList.length ? { s: stepList } : {}),
    }
    if (recipe) {
      dispatch({ type: 'UPDATE_CUSTOM', id: recipe.id, recipe: data })
      notify(`Receta «${n}» actualizada`)
    } else {
      dispatch({ type: 'ADD_CUSTOM', slot, recipe: data })
      notify(`Receta «${n}» creada`)
    }
    onClose()
  }

  return (
    <Modal title={recipe ? 'Editar receta' : 'Nueva receta'} onClose={onClose}>
      <form className="form" onSubmit={submit} noValidate>
        {slotMeal && slot && (
          <p className="hint">Se añadirá también a este hueco ({mealById(slotMeal).label.toLowerCase()}).</p>
        )}
        <div className="field">
          <label htmlFor={`${uid}-name`}>Nombre</label>
          <input id={`${uid}-name`} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor={`${uid}-min`}>Minutos</label>
            <input id={`${uid}-min`} type="number" min={1} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor={`${uid}-kcal`}>Kcal por persona (aprox.)</label>
            <input id={`${uid}-kcal`} type="number" min={0} value={kcal} onChange={(e) => setKcal(e.target.value)} />
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor={`${uid}-diet`}>Dieta</label>
            <select id={`${uid}-diet`} value={diet} onChange={(e) => setDiet(e.target.value as '' | Diet)}>
              <option value="">Cualquiera</option>
              <option value="v">Vegetariana</option>
              <option value="vg">Vegana</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={`${uid}-emoji`}>Emoji</label>
            <input id={`${uid}-emoji`} value={emoji} maxLength={8} onChange={(e) => setEmoji(e.target.value)} />
          </div>
        </div>

        <fieldset className="field">
          <legend>Encaja en</legend>
          <div className="checks">
            {MEALS.map((m) => (
              <label className="check" key={m.id}>
                <input type="checkbox" checked={meals.includes(m.id)} onChange={() => toggleMeal(m.id)} />
                {m.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>Ingredientes (opcional, cantidades para 2 personas)</legend>
          {rows.map((row, i) => (
            <div className="ingrow" key={i}>
              <input
                aria-label={`Ingrediente ${i + 1}: nombre`}
                placeholder="Nombre"
                value={row.name}
                onChange={(e) => setRow(i, { name: e.target.value })}
              />
              <input
                aria-label={`Ingrediente ${i + 1}: cantidad`}
                placeholder="Cant."
                inputMode="decimal"
                value={row.qty}
                onChange={(e) => setRow(i, { qty: e.target.value })}
              />
              <input
                aria-label={`Ingrediente ${i + 1}: unidad`}
                placeholder="Unidad"
                value={row.unit}
                onChange={(e) => setRow(i, { unit: e.target.value })}
              />
              <select
                className="sec"
                aria-label={`Ingrediente ${i + 1}: sección`}
                value={row.section}
                onChange={(e) => setRow(i, { section: e.target.value })}
              >
                {SECTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button
                type="button"
                className="btn rm"
                aria-label={`Quitar ingrediente ${i + 1}`}
                onClick={() => setRows((rs) => (rs.length === 1 ? [emptyRow()] : rs.filter((_, j) => j !== i)))}
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" className="btn" onClick={() => setRows((rs) => [...rs, emptyRow()])}>
            + Añadir ingrediente
          </button>
        </fieldset>

        <div className="field">
          <label htmlFor={`${uid}-steps`}>Pasos de preparación (opcional, uno por línea)</label>
          <textarea id={`${uid}-steps`} rows={4} value={steps} onChange={(e) => setSteps(e.target.value)} />
        </div>

        {error && (
          <p className="err" role="alert">
            {error}
          </p>
        )}
        <div className="actions">
          <button type="submit" className="btn pri">
            {recipe ? 'Guardar cambios' : 'Crear receta'}
          </button>
          <button type="button" className="btn" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  )
}
