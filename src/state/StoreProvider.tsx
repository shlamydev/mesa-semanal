import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { BASE_RECIPES } from '../data/recipes'
import type { State } from '../types'
import { StoreContext } from './context'
import { loadState, saveState } from './persistence'
import { reducer } from './reducer'

interface Props {
  children: ReactNode
  /** Estado inicial; por defecto se lee de localStorage. */
  initial?: State
}

export function StoreProvider({ children, initial }: Props) {
  const [state, dispatch] = useReducer(reducer, initial, (init) => init ?? loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo(
    () => ({ state, dispatch, recipes: [...BASE_RECIPES, ...state.custom] }),
    [state],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
