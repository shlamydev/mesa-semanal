import type { MealId, Recipe, RecipeFilter } from '../types'

interface Options {
  filter: RecipeFilter
  query: string
  meal?: MealId
}

export function filterRecipes(list: readonly Recipe[], { filter, query, meal }: Options): Recipe[] {
  const q = query.trim().toLowerCase()
  return list.filter(
    (r) =>
      (filter === 'all' ||
        (filter === 'fast' && r.t <= 20) ||
        (filter === 'v' && r.tg.length > 0) ||
        (filter === 'vg' && r.tg.includes('vg'))) &&
      (!q || r.n.toLowerCase().includes(q)) &&
      (!meal || r.m.includes(meal)),
  )
}
