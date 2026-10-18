import { BASE_RECIPES } from '../data/recipes'
import { filterRecipes } from './filter'

describe('filterRecipes', () => {
  it('sin filtros devuelve todo', () => {
    expect(filterRecipes(BASE_RECIPES, { filter: 'all', query: '' })).toHaveLength(BASE_RECIPES.length)
  })
  it('rápidas: 20 min o menos', () => {
    const r = filterRecipes(BASE_RECIPES, { filter: 'fast', query: '' })
    expect(r.length).toBeGreaterThan(0)
    expect(r.every((x) => x.t <= 20)).toBe(true)
  })
  it('vegetarianas incluye las veganas; veganas solo las veganas', () => {
    const v = filterRecipes(BASE_RECIPES, { filter: 'v', query: '' })
    const vg = filterRecipes(BASE_RECIPES, { filter: 'vg', query: '' })
    expect(vg.every((x) => x.tg.includes('vg'))).toBe(true)
    expect(v.length).toBeGreaterThan(vg.length)
  })
  it('busca por nombre sin distinguir mayúsculas', () => {
    expect(filterRecipes(BASE_RECIPES, { filter: 'all', query: ' TORTILLA ' }).map((r) => r.id)).toEqual([1])
  })
  it('filtra por comida', () => {
    const r = filterRecipes(BASE_RECIPES, { filter: 'all', query: '', meal: 'm' })
    expect(r.length).toBeGreaterThanOrEqual(3)
    expect(r.every((x) => x.m.includes('m'))).toBe(true)
  })
  it('puede no dar resultados', () => {
    expect(filterRecipes(BASE_RECIPES, { filter: 'all', query: 'zzz' })).toEqual([])
  })
})

describe('recetas de serie', () => {
  it('todas tienen kcal e ids únicos', () => {
    expect(BASE_RECIPES.every((r) => r.k > 0)).toBe(true)
    expect(new Set(BASE_RECIPES.map((r) => r.id)).size).toBe(BASE_RECIPES.length)
  })
  it('hay recetas para cada comida', () => {
    for (const meal of ['b', 'a', 'l', 'm', 'd']) {
      expect(BASE_RECIPES.some((r) => r.m.includes(meal))).toBe(true)
    }
  })
})
