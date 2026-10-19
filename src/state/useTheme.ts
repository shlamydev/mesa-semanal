import { useEffect, useState } from 'react'
import { loadTheme, saveTheme, systemTheme, type Theme } from '../lib/theme'

/** Tema claro/oscuro: respeta al sistema hasta que el usuario elige uno. */
export function useTheme(): [Theme, () => void] {
  const [chosen, setChosen] = useState<Theme | null>(() => loadTheme())
  const theme = chosen ?? systemTheme()

  useEffect(() => {
    if (chosen) document.documentElement.dataset.theme = chosen
  }, [chosen])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    saveTheme(next)
    setChosen(next)
  }
  return [theme, toggle]
}
