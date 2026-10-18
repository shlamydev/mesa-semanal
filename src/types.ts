/** b desayuno, a almuerzo, l comida, m merienda, d cena */
export type MealId = 'b' | 'a' | 'l' | 'm' | 'd'

/** v vegetariana, vg vegana. Lista vacía = cualquiera. */
export type Diet = 'v' | 'vg'

/** [nombre, cantidad para 2 personas, unidad, sección del supermercado] */
export type Ingredient = readonly [name: string, qty: number, unit: string, section: string]

export interface Recipe {
  id: number
  /** nombre */
  n: string
  /** emoji */
  e: string
  /** minutos */
  t: number
  tg: Diet[]
  /** comidas válidas, p. ej. "bam" */
  m: string
  ing: Ingredient[]
  /** kcal aproximadas por persona */
  k: number
  /** true en las recetas creadas por el usuario */
  custom?: boolean
}

export type NewRecipe = Omit<Recipe, 'id' | 'custom'>

/** Clave "<día 0-6><comida>" -> id de receta */
export type Plan = Record<string, number>

export interface State {
  people: number
  plan: Plan
  done: Record<string, boolean>
  have: Record<string, boolean>
  /** comidas visibles, en orden canónico (nunca vacío) */
  meals: MealId[]
  custom: Recipe[]
}

export interface ShoppingItem {
  n: string
  u: string
  c: string
  q: number
}

export type RecipeFilter = 'all' | 'fast' | 'v' | 'vg'
