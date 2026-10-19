import { DEFAULT_MEALS, MEAL_ORDER } from '../data/meals'
import type { MealId, NewRecipe, Plan, Recipe, State } from '../types'

export const MIN_PEOPLE = 1
export const MAX_PEOPLE = 12
export const MAX_GOAL = 6000
/** Las recetas propias empiezan en este id para no chocar con las de serie. */
const FIRST_CUSTOM_ID = 1000

export const initialState: State = {
  people: 2,
  plan: {},
  done: {},
  have: {},
  meals: [...DEFAULT_MEALS],
  custom: [],
  goal: 0,
}

export type Action =
  | { type: 'SET_PEOPLE'; people: number }
  | { type: 'SET_GOAL'; goal: number }
  | { type: 'SET_SLOT'; slot: string; recipeId: number }
  | { type: 'REMOVE_SLOT'; slot: string }
  | { type: 'MOVE_SLOT'; from: string; to: string }
  | { type: 'SET_PLAN'; plan: Plan }
  | { type: 'CLEAR_WEEK' }
  | { type: 'TOGGLE_DONE'; key: string }
  | { type: 'TOGGLE_HAVE'; name: string }
  | { type: 'TOGGLE_MEAL'; meal: MealId }
  | { type: 'ADD_CUSTOM'; recipe: NewRecipe; slot?: string }
  | { type: 'UPDATE_CUSTOM'; id: number; recipe: NewRecipe }
  | { type: 'DELETE_CUSTOM'; id: number }

export const nextCustomId = (custom: readonly Recipe[]): number =>
  Math.max(FIRST_CUSTOM_ID - 1, ...custom.map((r) => r.id)) + 1

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PEOPLE':
      return { ...state, people: Math.min(MAX_PEOPLE, Math.max(MIN_PEOPLE, Math.round(action.people))) }

    case 'SET_GOAL': {
      const goal = Number.isFinite(action.goal) ? Math.round(action.goal) : 0
      return { ...state, goal: Math.min(MAX_GOAL, Math.max(0, goal)) }
    }

    case 'SET_SLOT':
      return { ...state, plan: { ...state.plan, [action.slot]: action.recipeId } }

    case 'REMOVE_SLOT': {
      const { [action.slot]: _removed, ...plan } = state.plan
      return { ...state, plan }
    }

    case 'MOVE_SLOT': {
      const { from, to } = action
      const moving = state.plan[from]
      if (from === to || moving === undefined) return state
      const target = state.plan[to]
      const plan = { ...state.plan, [to]: moving }
      if (target === undefined) delete plan[from]
      else plan[from] = target
      return { ...state, plan }
    }

    case 'SET_PLAN':
      return { ...state, plan: action.plan }

    case 'CLEAR_WEEK':
      return { ...state, plan: {}, done: {} }

    case 'TOGGLE_DONE':
      return { ...state, done: { ...state.done, [action.key]: !state.done[action.key] } }

    case 'TOGGLE_HAVE':
      return { ...state, have: { ...state.have, [action.name]: !state.have[action.name] } }

    case 'TOGGLE_MEAL': {
      const active = state.meals.includes(action.meal)
      // Siempre debe quedar al menos una comida activa.
      if (active && state.meals.length === 1) return state
      const meals = active
        ? state.meals.filter((m) => m !== action.meal)
        : MEAL_ORDER.filter((m) => m === action.meal || state.meals.includes(m))
      return { ...state, meals }
    }

    case 'ADD_CUSTOM': {
      const recipe: Recipe = { ...action.recipe, id: nextCustomId(state.custom), custom: true }
      const plan = action.slot ? { ...state.plan, [action.slot]: recipe.id } : state.plan
      return { ...state, custom: [...state.custom, recipe], plan }
    }

    case 'UPDATE_CUSTOM': {
      if (!state.custom.some((r) => r.id === action.id)) return state
      const updated: Recipe = { ...action.recipe, id: action.id, custom: true }
      return { ...state, custom: state.custom.map((r) => (r.id === action.id ? updated : r)) }
    }

    case 'DELETE_CUSTOM': {
      if (!state.custom.some((r) => r.id === action.id)) return state
      const plan = Object.fromEntries(Object.entries(state.plan).filter(([, id]) => id !== action.id))
      return { ...state, custom: state.custom.filter((r) => r.id !== action.id), plan }
    }
  }
}
