import type { MealId } from '../types'

/** Clave de un hueco del plan: día (0-6) + comida, p. ej. "2l". */
export const slotKey = (day: number, meal: MealId): string => `${day}${meal}`

export const parseSlot = (key: string): { day: number; meal: MealId } => ({
  day: Number(key[0]),
  meal: key.slice(1) as MealId,
})
