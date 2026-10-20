import type { MealId } from '../types'

export interface Meal {
  id: MealId
  label: string
}

/** Orden en que se muestran las comidas en la cuadrícula. */
export const MEALS: readonly Meal[] = [
  { id: 'b', label: 'Desayuno' },
  { id: 'a', label: 'Almuerzo' },
  { id: 'l', label: 'Comida' },
  { id: 'm', label: 'Merienda' },
  { id: 'd', label: 'Cena' },
]

export const MEAL_ORDER: readonly MealId[] = MEALS.map((m) => m.id)

/** Las mismas tres comidas que tenía el prototipo original. */
export const DEFAULT_MEALS: readonly MealId[] = ['b', 'l', 'd']

export const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const

export const SECTIONS = [
  'Verdura y fruta',
  'Carne y pescado',
  'Lácteos y huevos',
  'Panadería',
  'Despensa',
  'Otros',
] as const

export const mealById = (id: MealId): Meal => MEALS.find((m) => m.id === id) ?? MEALS[0]
