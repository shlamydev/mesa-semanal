import type { ShoppingItem } from '../types'
import { shoppingListText } from './exportList'

const items: ShoppingItem[] = [
  { n: 'Patatas', u: 'g', c: 'Verdura y fruta', q: 500 },
  { n: 'Huevos', u: 'ud', c: 'Lácteos y huevos', q: 6 },
  { n: 'Aceite', u: 'ml', c: 'Despensa', q: 100 },
  { n: 'Cebolla', u: 'ud', c: 'Verdura y fruta', q: 1.5 },
]

describe('shoppingListText', () => {
  it('agrupa por sección con cantidades legibles', () => {
    expect(shoppingListText(items, {}, {}, 2)).toBe(
      [
        'Lista de la compra (2 personas)',
        'Despensa\n- Aceite: 100 ml',
        'Lácteos y huevos\n- Huevos: 6 ud',
        'Verdura y fruta\n- Cebolla: 1,5 ud\n- Patatas: 500 g',
      ].join('\n\n'),
    )
  })

  it('omite lo que ya tienes y lo ya comprado', () => {
    const text = shoppingListText(items, { Aceite: true }, { 'Huevos|ud': true }, 1)
    expect(text).not.toContain('Aceite')
    expect(text).not.toContain('Huevos')
    expect(text).toContain('Lista de la compra (1 persona)')
  })

  it('devuelve cadena vacía si no queda nada', () => {
    expect(shoppingListText([], {}, {}, 2)).toBe('')
    expect(shoppingListText(items.slice(0, 1), {}, { 'Patatas|g': true }, 2)).toBe('')
  })
})
