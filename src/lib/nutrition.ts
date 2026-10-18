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
