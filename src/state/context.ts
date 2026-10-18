import { createContext, type Dispatch } from 'react'
import type { Recipe, State } from '../types'
import type { Action } from './reducer'

export interface Store {
  state: State
  dispatch: Dispatch<Action>
  /** Recetas de serie + propias */
  recipes: Recipe[]
}

export const StoreContext = createContext<Store | null>(null)
