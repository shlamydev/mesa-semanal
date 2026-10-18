import { MAX_PEOPLE, MIN_PEOPLE } from '../state/reducer'
import { useStore } from '../state/useStore'
import '../styles/cabecera.css'

export function Cabecera() {
  const { state, dispatch } = useStore()
  const set = (people: number) => dispatch({ type: 'SET_PEOPLE', people })
  return (
    <header>
      <h1>Mesa Semanal</h1>
      <div className="people" role="group" aria-label="Número de personas">
        Personas
        <button aria-label="Menos personas" disabled={state.people <= MIN_PEOPLE} onClick={() => set(state.people - 1)}>
          −
        </button>
        <b aria-live="polite">{state.people}</b>
        <button aria-label="Más personas" disabled={state.people >= MAX_PEOPLE} onClick={() => set(state.people + 1)}>
          +
        </button>
      </div>
    </header>
  )
}
