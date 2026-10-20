export type Theme = 'light' | 'dark'

export const THEME_KEY = 'mesa-semanal-theme'

/** Tema guardado por el usuario; null = el de por defecto (claro). */
export function loadTheme(storage: Storage = localStorage): Theme | null {
  try {
    const v = storage.getItem(THEME_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

export function saveTheme(theme: Theme, storage: Storage = localStorage): void {
  try {
    storage.setItem(THEME_KEY, theme)
  } catch {
    // Sin almacenamiento: el tema solo dura esta sesión.
  }
}

/** Tema por defecto: claro. Solo es oscuro si el usuario lo elige con el botón. */
export const defaultTheme = (): Theme => 'light'
