import { DAYS } from '../data/meals'
import type { MealId, Plan, Recipe } from '../types'
import { slotKey } from './slots'

/**
 * Rellena los huecos vacíos de las comidas activas con recetas válidas,
 * intentando no repetir. Respeta lo que ya está en el plan.
 */
export function suggestPlan(
  recipes: readonly Recipe[],
  meals: readonly MealId[],
  plan: Plan,
  rng: () => number = Math.random,
): Plan {
  const next: Plan = { ...plan }
  const used = new Set<number>()
  DAYS.forEach((_, day) => {
    for (const meal of meals) {
      const key = slotKey(day, meal)
      if (next[key] !== undefined) continue
      const valid = recipes.filter((r) => r.m.includes(meal))
      const fresh = valid.filter((r) => !used.has(r.id))
      const pool = fresh.length ? fresh : valid
      if (!pool.length) continue
      const pick = pool[Math.floor(rng() * pool.length)]
      used.add(pick.id)
      next[key] = pick.id
    }
  })
  return next
}
