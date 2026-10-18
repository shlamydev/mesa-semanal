import { initialState } from './reducer'
import { loadState, sanitizeState, saveState, STORAGE_KEY } from './persistence'

describe('persistencia', () => {
  it('guarda y recupera el estado', () => {
    const state = {
      ...initialState,
      people: 4,
      plan: { '0l': 2 },
      meals: ['b' as const, 'm' as const],
      custom: [{ id: 1000, n: 'X', e: '🍲', t: 5, tg: ['vg' as const], m: 'l', k: 100, ing: [['Sal', 1, 'g', 'Despensa'] as const], custom: true }],
    }
    saveState(state)
    expect(loadState()).toEqual(state)
  })

  it('usa la clave mesa-semanal', () => {
    saveState(initialState)
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('migra el formato antiguo del prototipo (sin meals ni custom)', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ people: 3, plan: { '0l': 1 }, done: {}, have: {} }))
    const s = loadState()
    expect(s.people).toBe(3)
    expect(s.meals).toEqual(['b', 'l', 'd'])
    expect(s.custom).toEqual([])
  })

  it('ignora JSON roto', () => {
    localStorage.setItem(STORAGE_KEY, '{no es json')
    expect(loadState()).toEqual(initialState)
  })

  it('sanea valores inválidos', () => {
    const s = sanitizeState({ people: 'x', plan: { a: 'b', '0l': 1 }, meals: ['z'], custom: [{ id: 'mal' }] })
    expect(s.people).toBe(2)
    expect(s.plan).toEqual({ '0l': 1 })
    expect(s.meals).toEqual(['b', 'l', 'd'])
    expect(s.custom).toEqual([])
  })
})
