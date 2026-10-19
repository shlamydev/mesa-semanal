import type { MealId, Plan, Recipe } from '../types'
import { slotKey } from './slots'

/** kcal aproximadas por persona de un día, contando solo las comidas activas. */
export function dayKcal(
  plan: Plan,
  recipes: readonly Recipe[],
  day: number,
  meals: readonly MealId[],
): number {
  const byId = new Map(recipes.map((r) => [r.id, r]))
  return meals.reduce((sum, meal) => {
    const id = plan[slotKey(day, meal)]
    return sum + (id === undefined ? 0 : (byId.get(id)?.k ?? 0))
  }, 0)
}

export interface GoalProgress {
  /** porcentaje del objetivo cubierto, limitado a 100 */
  pct: number
  /** kcal por encima del objetivo (0 si no se supera) */
  over: number
}

/** Progreso de un día frente al objetivo diario; null si no hay objetivo. */
export function goalProgress(kcal: number, goal: number): GoalProgress | null {
  if (goal <= 0) return null
  return { pct: Math.min(100, Math.round((kcal / goal) * 100)), over: Math.max(0, Math.round(kcal - goal)) }
}
