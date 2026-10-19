import { BASE_RECIPES } from '../data/recipes'
import { weekSummary } from './summary'

describe('weekSummary', () => {
  it('semana vacía: nada planificado y media 0', () => {
    expect(weekSummary({}, BASE_RECIPES, ['b', 'l', 'd'])).toEqual({ filled: 0, total: 21, avgKcal: 0 })
  })

  it('cuenta huecos y hace la media solo de los días con comidas', () => {
    // lunes: tostada de aguacate (380) + tortilla (540) = 920; martes: porridge (360)
    const plan = { '0b': 2, '0l': 1, '1b': 3 }
    const s = weekSummary(plan, BASE_RECIPES, ['b', 'l', 'd'])
    expect(s.filled).toBe(3)
    expect(s.total).toBe(21)
    expect(s.avgKcal).toBe((920 + 360) / 2)
  })

  it('ignora los huecos de comidas ocultas', () => {
    const s = weekSummary({ '0b': 2, '0l': 1 }, BASE_RECIPES, ['b'])
    expect(s).toEqual({ filled: 1, total: 7, avgKcal: 380 })
  })
})
