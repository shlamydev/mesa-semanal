import { DAYS } from '../data/meals'
import type { MealId, Plan, Recipe } from '../types'
import { dayKcal } from './nutrition'
import { slotKey } from './slots'

export interface WeekSummary {
  /** huecos con receta entre las comidas activas */
  filled: number
  /** huecos totales de la semana (7 días × comidas activas) */
  total: number
  /** media de kcal por persona de los días que tienen alguna comida; 0 si no hay ninguno */
  avgKcal: number
}

export function weekSummary(plan: Plan, recipes: readonly Recipe[], meals: readonly MealId[]): WeekSummary {
  let filled = 0
  const kcals: number[] = []
  DAYS.forEach((_, day) => {
    const dayFilled = meals.filter((m) => plan[slotKey(day, m)] !== undefined).length
    filled += dayFilled
    if (dayFilled > 0) kcals.push(dayKcal(plan, recipes, day, meals))
  })
  const avgKcal = kcals.length ? kcals.reduce((a, b) => a + b, 0) / kcals.length : 0
  return { filled, total: DAYS.length * meals.length, avgKcal }
}
