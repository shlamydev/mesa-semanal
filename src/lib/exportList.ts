import type { ShoppingItem } from '../types'
import { formatQty } from './format'
import { groupBySection, itemKey } from './shopping'

/**
 * Texto plano de lo que queda por comprar, agrupado por sección.
 * Deja fuera lo que ya está en la despensa y lo ya comprado.
 */
export function shoppingListText(
  items: readonly ShoppingItem[],
  have: Record<string, boolean>,
  done: Record<string, boolean>,
  people: number,
): string {
  const pending = items.filter((i) => !have[i.n] && !done[itemKey(i.n, i.u)])
  if (!pending.length) return ''
  const title = `Lista de la compra (${people} ${people === 1 ? 'persona' : 'personas'})`
  const blocks = groupBySection(pending).map(
    ([section, list]) => `${section}\n${list.map((i) => `- ${i.n}: ${formatQty(i.q)} ${i.u}`).join('\n')}`,
  )
  return [title, ...blocks].join('\n\n')
}
