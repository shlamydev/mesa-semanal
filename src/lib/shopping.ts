import type { MealId, Plan, Recipe, ShoppingItem } from '../types'
import { parseSlot } from './slots'

/** Clave de un ingrediente en la lista: mismo nombre y misma unidad. */
export const itemKey = (name: string, unit: string): string => `${name}|${unit}`

/** Las cantidades de las recetas están definidas para 2 personas. */
export const scaleQty = (qty: number, people: number): number => (qty * people) / 2

/**
 * Suma los ingredientes de todas las comidas planificadas.
 * Ignora las comidas ocultas (sus recetas siguen en el plan, pero no se compran).
 */
export function buildShoppingList(
  plan: Plan,
  recipes: readonly Recipe[],
  people: number,
  meals: readonly MealId[],
): ShoppingItem[] {
  const byId = new Map(recipes.map((r) => [r.id, r]))
  const acc = new Map<string, ShoppingItem>()
  for (const [slot, recipeId] of Object.entries(plan)) {
    if (!meals.includes(parseSlot(slot).meal)) continue
    const recipe = byId.get(recipeId)
    if (!recipe) continue
    for (const [n, qty, u, c] of recipe.ing) {
      const key = itemKey(n, u)
      const item = acc.get(key) ?? { n, u, c, q: 0 }
      item.q += scaleQty(qty, people)
      acc.set(key, item)
    }
  }
  return [...acc.values()]
}

/** Agrupa por sección (orden alfabético) y ordena los ingredientes por nombre. */
export function groupBySection(items: readonly ShoppingItem[]): [string, ShoppingItem[]][] {
  const sections = [...new Set(items.map((i) => i.c))].sort((a, b) => a.localeCompare(b))
  return sections.map((section) => [
    section,
    items.filter((i) => i.c === section).sort((a, b) => a.n.localeCompare(b.n)),
  ])
}

/** Ingredientes que quedan por comprar (ni en la despensa ni marcados). */
export const pendingCount = (
  items: readonly ShoppingItem[],
  have: Record<string, boolean>,
  done: Record<string, boolean>,
): number => items.filter((i) => !have[i.n] && !done[itemKey(i.n, i.u)]).length
