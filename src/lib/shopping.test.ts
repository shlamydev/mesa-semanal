import { BASE_RECIPES } from '../data/recipes'
import type { Recipe } from '../types'
import { buildShoppingList, groupBySection, itemKey, pendingCount, scaleQty } from './shopping'

const recipes: Recipe[] = [
  { id: 1, n: 'A', e: 'x', t: 10, tg: [], m: 'l', k: 100, ing: [['Cebolla', 1, 'ud', 'Verdura'], ['Arroz', 100, 'g', 'Despensa']] },
  { id: 2, n: 'B', e: 'x', t: 10, tg: [], m: 'ld', k: 100, ing: [['Cebolla', 2, 'ud', 'Verdura'], ['Arroz', 1, 'kg', 'Despensa']] },
]
const ALL = ['b', 'a', 'l', 'm', 'd'] as const

describe('scaleQty', () => {
  it('escala por personas / 2', () => {
    expect(scaleQty(100, 2)).toBe(100)
    expect(scaleQty(100, 4)).toBe(200)
    expect(scaleQty(100, 1)).toBe(50)
  })
})

describe('buildShoppingList', () => {
  it('suma ingredientes con mismo nombre y unidad', () => {
    const list = buildShoppingList({ '0l': 1, '1l': 2 }, recipes, 2, ALL)
    expect(list.find((i) => i.n === 'Cebolla')?.q).toBe(3)
  })

  it('no mezcla unidades distintas del mismo ingrediente', () => {
    const list = buildShoppingList({ '0l': 1, '1l': 2 }, recipes, 2, ALL)
    expect(list.filter((i) => i.n === 'Arroz')).toHaveLength(2)
  })

  it('escala las cantidades por número de personas', () => {
    const list = buildShoppingList({ '0l': 1 }, recipes, 4, ALL)
    expect(list.find((i) => i.n === 'Arroz')?.q).toBe(200)
  })

  it('ignora las comidas ocultas pero no toca el plan', () => {
    const plan = { '0l': 1, '0d': 2 }
    const list = buildShoppingList(plan, recipes, 2, ['l'])
    expect(list.find((i) => i.n === 'Cebolla')?.q).toBe(1)
    expect(plan).toEqual({ '0l': 1, '0d': 2 })
  })

  it('ignora recetas que ya no existen', () => {
    expect(buildShoppingList({ '0l': 999 }, recipes, 2, ALL)).toEqual([])
  })

  it('funciona con las recetas de serie', () => {
    const list = buildShoppingList({ '0l': 1 }, BASE_RECIPES, 2, ALL)
    expect(list.map((i) => i.n)).toContain('Huevos')
  })
})

describe('groupBySection', () => {
  it('agrupa por sección y ordena por nombre', () => {
    const list = buildShoppingList({ '0l': 1 }, recipes, 2, ALL)
    const groups = groupBySection(list)
    expect(groups.map(([s]) => s)).toEqual(['Despensa', 'Verdura'])
    expect(groups[0][1].map((i) => i.n)).toEqual(['Arroz'])
  })
})

describe('pendingCount', () => {
  it('descarta lo comprado y lo que ya se tiene en la despensa', () => {
    const list = buildShoppingList({ '0l': 1 }, recipes, 2, ALL)
    expect(pendingCount(list, {}, {})).toBe(2)
    expect(pendingCount(list, { Cebolla: true }, {})).toBe(1)
    expect(pendingCount(list, {}, { [itemKey('Arroz', 'g')]: true })).toBe(1)
  })
})
