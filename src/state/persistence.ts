import { DEFAULT_MEALS, MEAL_ORDER } from '../data/meals'
import type { Diet, Ingredient, MealId, Recipe, State } from '../types'
import { initialState, MAX_GOAL, MAX_PEOPLE, MIN_PEOPLE } from './reducer'

export const STORAGE_KEY = 'mesa-semanal'

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

function cleanPeople(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v)
    ? Math.min(MAX_PEOPLE, Math.max(MIN_PEOPLE, Math.round(v)))
    : initialState.people
}

function cleanGoal(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? Math.min(MAX_GOAL, Math.max(0, Math.round(v))) : 0
}

function cleanPlan(v: unknown): Record<string, number> {
  if (!isRecord(v)) return {}
  return Object.fromEntries(Object.entries(v).filter(([, id]) => typeof id === 'number')) as Record<string, number>
}

function cleanFlags(v: unknown): Record<string, boolean> {
  if (!isRecord(v)) return {}
  return Object.fromEntries(Object.entries(v).filter(([, f]) => typeof f === 'boolean')) as Record<string, boolean>
}

function cleanMeals(v: unknown): MealId[] {
  const valid = Array.isArray(v) ? MEAL_ORDER.filter((m) => v.includes(m)) : []
  return valid.length ? valid : [...DEFAULT_MEALS]
}

function cleanIngredient(v: unknown): Ingredient | null {
  if (!Array.isArray(v) || v.length !== 4) return null
  const [n, q, u, c] = v as unknown[]
  return typeof n === 'string' && typeof q === 'number' && typeof u === 'string' && typeof c === 'string'
    ? [n, q, u, c]
    : null
}

function cleanRecipe(v: unknown): Recipe | null {
  if (!isRecord(v)) return null
  const { id, n, e, t, tg, m, ing, k } = v
  if (
    typeof id !== 'number' ||
    typeof n !== 'string' ||
    typeof e !== 'string' ||
    typeof t !== 'number' ||
    typeof m !== 'string' ||
    typeof k !== 'number' ||
    !Array.isArray(tg) ||
    !Array.isArray(ing)
  )
    return null
  const steps = Array.isArray(v.s) ? v.s.filter((x): x is string => typeof x === 'string' && x.trim() !== '') : []
  return {
    id,
    n,
    e,
    t,
    k,
    m,
    tg: tg.filter((d): d is Diet => d === 'v' || d === 'vg'),
    ing: ing.map(cleanIngredient).filter((i): i is Ingredient => i !== null),
    ...(steps.length ? { s: steps } : {}),
    custom: true,
  }
}

/** Convierte lo guardado en un estado válido; lo que falte o esté roto toma el valor por defecto. */
export function sanitizeState(raw: unknown): State {
  if (!isRecord(raw)) return { ...initialState, meals: [...initialState.meals] }
  return {
    people: cleanPeople(raw.people),
    plan: cleanPlan(raw.plan),
    done: cleanFlags(raw.done),
    have: cleanFlags(raw.have),
    meals: cleanMeals(raw.meals),
    goal: cleanGoal(raw.goal),
    custom: Array.isArray(raw.custom) ? raw.custom.map(cleanRecipe).filter((r): r is Recipe => r !== null) : [],
  }
}

export function loadState(storage: Storage = localStorage): State {
  try {
    const text = storage.getItem(STORAGE_KEY)
    return sanitizeState(text ? JSON.parse(text) : null)
  } catch {
    return sanitizeState(null)
  }
}

export function saveState(state: State, storage: Storage = localStorage): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Almacenamiento lleno o bloqueado: la app sigue funcionando sin persistir.
  }
}
