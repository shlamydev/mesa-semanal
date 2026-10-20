import { useEffect, useState } from 'react'
import { loadTheme, saveTheme, defaultTheme, type Theme } from '../lib/theme'

/** Tema claro/oscuro: claro por defecto, hasta que el usuario elige otro. */
export function useTheme(): [Theme, () => void] {
  const [chosen, setChosen] = useState<Theme | null>(() => loadTheme())
  const theme = chosen ?? defaultTheme()

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
