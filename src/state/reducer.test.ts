import type { NewRecipe } from '../types'
import { initialState, MAX_GOAL, MAX_PEOPLE, nextCustomId, reducer } from './reducer'

const draft: NewRecipe = { n: 'Mi receta', e: '🍲', t: 20, tg: ['v'], m: 'l', k: 400, ing: [['Sal', 1, 'g', 'Despensa']] }

describe('reducer', () => {
  it('limita el número de personas', () => {
    expect(reducer(initialState, { type: 'SET_PEOPLE', people: 0 }).people).toBe(1)
    expect(reducer(initialState, { type: 'SET_PEOPLE', people: 99 }).people).toBe(MAX_PEOPLE)
    expect(reducer(initialState, { type: 'SET_PEOPLE', people: 5 }).people).toBe(5)
  })

  it('el objetivo de kcal se limita y 0 significa sin objetivo', () => {
    expect(initialState.goal).toBe(0)
    expect(reducer(initialState, { type: 'SET_GOAL', goal: 2000 }).goal).toBe(2000)
    expect(reducer(initialState, { type: 'SET_GOAL', goal: -50 }).goal).toBe(0)
    expect(reducer(initialState, { type: 'SET_GOAL', goal: 99999 }).goal).toBe(MAX_GOAL)
    expect(reducer(initialState, { type: 'SET_GOAL', goal: Number.NaN }).goal).toBe(0)
  })

  it('asigna y quita recetas de un hueco', () => {
    const s1 = reducer(initialState, { type: 'SET_SLOT', slot: '0l', recipeId: 3 })
    expect(s1.plan).toEqual({ '0l': 3 })
    expect(reducer(s1, { type: 'REMOVE_SLOT', slot: '0l' }).plan).toEqual({})
  })

  it('mueve una comida a un hueco vacío', () => {
    const s = reducer({ ...initialState, plan: { '0l': 1 } }, { type: 'MOVE_SLOT', from: '0l', to: '1l' })
    expect(s.plan).toEqual({ '1l': 1 })
  })

  it('intercambia dos comidas', () => {
    const s = reducer({ ...initialState, plan: { '0l': 1, '1l': 2 } }, { type: 'MOVE_SLOT', from: '0l', to: '1l' })
    expect(s.plan).toEqual({ '0l': 2, '1l': 1 })
  })

  it('vaciar la semana limpia plan y compras marcadas, no la despensa', () => {
    const s = reducer(
      { ...initialState, plan: { '0l': 1 }, done: { 'a|g': true }, have: { Sal: true } },
      { type: 'CLEAR_WEEK' },
    )
    expect(s.plan).toEqual({})
    expect(s.done).toEqual({})
    expect(s.have).toEqual({ Sal: true })
  })

  it('"ya lo tengo" y marcar comprado alternan', () => {
    const a = reducer(initialState, { type: 'TOGGLE_HAVE', name: 'Sal' })
    expect(a.have.Sal).toBe(true)
    expect(reducer(a, { type: 'TOGGLE_HAVE', name: 'Sal' }).have.Sal).toBe(false)
    expect(reducer(initialState, { type: 'TOGGLE_DONE', key: 'x|g' }).done['x|g']).toBe(true)
  })

  describe('comidas visibles', () => {
    it('añade una comida respetando el orden canónico', () => {
      expect(reducer(initialState, { type: 'TOGGLE_MEAL', meal: 'm' }).meals).toEqual(['b', 'l', 'm', 'd'])
      expect(reducer(initialState, { type: 'TOGGLE_MEAL', meal: 'a' }).meals).toEqual(['b', 'a', 'l', 'd'])
    })
    it('oculta una comida sin borrar su plan', () => {
      const s = reducer({ ...initialState, plan: { '0d': 9 } }, { type: 'TOGGLE_MEAL', meal: 'd' })
      expect(s.meals).toEqual(['b', 'l'])
      expect(s.plan).toEqual({ '0d': 9 })
    })
    it('siempre deja al menos una activa', () => {
      const s = reducer({ ...initialState, meals: ['l'] }, { type: 'TOGGLE_MEAL', meal: 'l' })
      expect(s.meals).toEqual(['l'])
    })
  })

  describe('editar recetas propias', () => {
    const withOne = reducer(initialState, { type: 'ADD_CUSTOM', recipe: draft, slot: '0l' })
    const id = withOne.custom[0].id

    it('actualiza los datos y conserva id, propia y hueco del plan', () => {
      const s = reducer(withOne, { type: 'UPDATE_CUSTOM', id, recipe: { ...draft, n: 'Otra', s: ['Cocer'] } })
      expect(s.custom[0]).toMatchObject({ id, n: 'Otra', s: ['Cocer'], custom: true })
      expect(s.plan['0l']).toBe(id)
    })

    it('ignora ids que no son de recetas propias', () => {
      expect(reducer(withOne, { type: 'UPDATE_CUSTOM', id: 1, recipe: draft })).toBe(withOne)
    })
  })

  describe('recetas propias', () => {
    it('crea con id propio y marcada como custom', () => {
      const s = reducer(initialState, { type: 'ADD_CUSTOM', recipe: draft })
      expect(s.custom).toHaveLength(1)
      expect(s.custom[0]).toMatchObject({ n: 'Mi receta', custom: true })
      expect(s.custom[0].id).toBeGreaterThanOrEqual(1000)
      expect(s.plan).toEqual({})
    })
    it('desde un hueco, se asigna a ese hueco', () => {
      const s = reducer(initialState, { type: 'ADD_CUSTOM', recipe: draft, slot: '2d' })
      expect(s.plan['2d']).toBe(s.custom[0].id)
    })
    it('los ids no se repiten', () => {
      let s = reducer(initialState, { type: 'ADD_CUSTOM', recipe: draft })
      s = reducer(s, { type: 'ADD_CUSTOM', recipe: draft })
      expect(new Set(s.custom.map((r) => r.id)).size).toBe(2)
      expect(nextCustomId(s.custom)).toBe(s.custom[1].id + 1)
    })
    it('al eliminar, se quita también del plan', () => {
      let s = reducer(initialState, { type: 'ADD_CUSTOM', recipe: draft, slot: '2d' })
      s = reducer(s, { type: 'DELETE_CUSTOM', id: s.custom[0].id })
      expect(s.custom).toEqual([])
      expect(s.plan).toEqual({})
    })
    it('no se pueden eliminar las recetas de serie', () => {
      const s = { ...initialState, plan: { '0l': 1 } }
      expect(reducer(s, { type: 'DELETE_CUSTOM', id: 1 })).toBe(s)
    })
  })
})
