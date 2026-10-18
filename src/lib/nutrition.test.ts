import type { Recipe } from '../types'
import { dayKcal } from './nutrition'

const mk = (id: number, k: number): Recipe => ({ id, n: 'r', e: 'x', t: 5, tg: [], m: 'bald', k, ing: [] })
const recipes = [mk(1, 300), mk(2, 500)]

describe('dayKcal', () => {
  it('suma las kcal de las comidas activas del día', () => {
    expect(dayKcal({ '0b': 1, '0l': 2 }, recipes, 0, ['b', 'l', 'd'])).toBe(800)
  })
  it('no cuenta las comidas ocultas', () => {
    expect(dayKcal({ '0b': 1, '0l': 2 }, recipes, 0, ['b'])).toBe(300)
  })
  it('no mezcla días', () => {
    expect(dayKcal({ '0b': 1, '1b': 2 }, recipes, 1, ['b'])).toBe(500)
  })
  it('devuelve 0 si no hay nada', () => {
    expect(dayKcal({}, recipes, 3, ['b', 'l'])).toBe(0)
  })
})
