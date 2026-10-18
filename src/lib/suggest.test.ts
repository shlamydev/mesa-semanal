import { BASE_RECIPES } from '../data/recipes'
import { suggestPlan } from './suggest'

describe('suggestPlan', () => {
  it('rellena solo las comidas activas', () => {
    const plan = suggestPlan(BASE_RECIPES, ['b', 'd'], {})
    expect(Object.keys(plan)).toHaveLength(14)
    expect(Object.keys(plan).every((k) => k.endsWith('b') || k.endsWith('d'))).toBe(true)
  })
  it('respeta lo ya planificado', () => {
    const plan = suggestPlan(BASE_RECIPES, ['l'], { '0l': 7 })
    expect(plan['0l']).toBe(7)
  })
  it('conserva el plan de comidas ocultas', () => {
    const plan = suggestPlan(BASE_RECIPES, ['l'], { '0d': 9 })
    expect(plan['0d']).toBe(9)
  })
  it('usa recetas válidas para cada comida', () => {
    const plan = suggestPlan(BASE_RECIPES, ['m'], {})
    for (const id of Object.values(plan)) {
      expect(BASE_RECIPES.find((r) => r.id === id)?.m).toContain('m')
    }
  })
})
