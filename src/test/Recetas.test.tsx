import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const openTab = (name: string) => userEvent.click(screen.getByRole('tab', { name }))

describe('Recetas', () => {
  it('muestra las calorías aproximadas en las tarjetas', async () => {
    render(<App />)
    await openTab('Recetas')
    const card = screen.getByRole('button', { name: /Tortilla de patatas/ })
    expect(within(card).getByText('≈ 540 kcal por persona')).toBeInTheDocument()
  })

  it('el detalle muestra kcal e ingredientes escalados', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Más personas' })) // 3 personas
    await openTab('Recetas')
    await userEvent.click(screen.getByRole('button', { name: /Tortilla de patatas/ }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/≈ 540 kcal por persona · para 3 personas/)).toBeInTheDocument()
    expect(within(dialog).getByText('750 g de patatas')).toBeInTheDocument()
    expect(within(dialog).queryByText('Eliminar receta')).not.toBeInTheDocument()
  })

  it('filtra por búsqueda y ofrece crear cuando no hay resultados', async () => {
    render(<App />)
    await openTab('Recetas')
    await userEvent.type(screen.getByLabelText('Buscar receta'), 'paella')
    expect(screen.getByText('Ninguna receta coincide. Prueba con otro filtro.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '+ Crear receta «paella»' }))
    expect(screen.getByLabelText('Nombre')).toHaveValue('paella')
  })
})

describe('Recetas propias', () => {
  async function crear(nombre: string) {
    await userEvent.type(screen.getByLabelText('Nombre'), nombre)
  }

  it('"+ Nueva receta" está siempre visible y crea una receta', async () => {
    render(<App />)
    await openTab('Recetas')
    await userEvent.click(screen.getByRole('button', { name: '+ Nueva receta' }))
    await crear('Paella')
    await userEvent.clear(screen.getByLabelText(/Kcal/))
    await userEvent.type(screen.getByLabelText(/Kcal/), '700')
    await userEvent.type(screen.getByLabelText('Ingrediente 1: nombre'), 'Arroz')
    await userEvent.type(screen.getByLabelText('Ingrediente 1: cantidad'), '300')
    await userEvent.clear(screen.getByLabelText('Ingrediente 1: unidad'))
    await userEvent.type(screen.getByLabelText('Ingrediente 1: unidad'), 'g')
    await userEvent.click(screen.getByRole('button', { name: 'Crear receta' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const card = screen.getByRole('button', { name: /Paella/ })
    expect(within(card).getByText('≈ 700 kcal por persona')).toBeInTheDocument()
    expect(within(card).getByText('Propia')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('mesa-semanal') ?? '{}').custom).toHaveLength(1)
  })

  it('valida los campos obligatorios', async () => {
    render(<App />)
    await openTab('Recetas')
    await userEvent.click(screen.getByRole('button', { name: '+ Nueva receta' }))
    await userEvent.click(screen.getByRole('button', { name: 'Crear receta' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Escribe un nombre')
    await crear('X')
    await userEvent.type(screen.getByLabelText('Ingrediente 1: nombre'), 'Sal')
    await userEvent.click(screen.getByRole('button', { name: 'Crear receta' }))
    expect(screen.getByRole('alert')).toHaveTextContent('cantidad válida')
  })

  it('desde un hueco sin resultados, la receta se asigna a ese hueco', async () => {
    render(<App />)
    await userEvent.click(screen.getAllByText('+ Añadir')[0]) // lunes, desayuno
    await userEvent.type(screen.getByLabelText('Buscar receta'), 'gachas')
    await userEvent.click(screen.getByRole('button', { name: '+ Crear receta «gachas»' }))
    expect(screen.getByLabelText('Desayuno')).toBeChecked() // comida del hueco preseleccionada
    await userEvent.click(screen.getByRole('button', { name: 'Crear receta' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const panel = within(screen.getByRole('tabpanel'))
    expect(panel.getByText('gachas', { exact: false })).toBeInTheDocument()
    expect(panel.getByText('≈ 400 kcal')).toBeInTheDocument() // total del lunes
  })

  it('se puede eliminar una receta propia y desaparece de la semana', async () => {
    render(<App />)
    await userEvent.click(screen.getAllByText('+ Añadir')[0])
    await userEvent.type(screen.getByLabelText('Buscar receta'), 'gachas')
    await userEvent.click(screen.getByRole('button', { name: '+ Crear receta «gachas»' }))
    await userEvent.click(screen.getByRole('button', { name: 'Crear receta' }))

    await openTab('Recetas')
    await userEvent.click(screen.getByRole('button', { name: /gachas/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar receta' }))
    await userEvent.click(screen.getByRole('button', { name: 'Sí, eliminar' }))
    expect(screen.queryByRole('button', { name: /gachas/ })).not.toBeInTheDocument()

    await openTab('Semana')
    expect(within(screen.getByRole('tabpanel')).queryByText('gachas', { exact: false })).not.toBeInTheDocument()
    expect(screen.getAllByText('+ Añadir')).toHaveLength(21)
  })

  it('las recetas de serie muestran sus pasos y no se pueden editar', async () => {
    render(<App />)
    await openTab('Recetas')
    await userEvent.click(screen.getByRole('button', { name: /Tortilla de patatas/ }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Preparación')).toBeInTheDocument()
    expect(within(dialog).getByText(/Pela y corta las patatas/)).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Editar receta' })).not.toBeInTheDocument()
  })

  it('se puede editar una receta propia: cambia el nombre y añade pasos', async () => {
    render(<App />)
    await openTab('Recetas')
    await userEvent.click(screen.getByRole('button', { name: '+ Nueva receta' }))
    await userEvent.type(screen.getByLabelText('Nombre'), 'Gachas')
    await userEvent.click(screen.getByRole('button', { name: 'Crear receta' }))

    await userEvent.click(screen.getByRole('button', { name: /Gachas/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Editar receta' }))
    const name = screen.getByLabelText('Nombre')
    expect(name).toHaveValue('Gachas')
    await userEvent.clear(name)
    await userEvent.type(name, 'Gachas dulces')
    await userEvent.type(screen.getByLabelText(/Pasos de preparación/), 'Hervir la leche{Enter}Añadir la harina')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    // vuelve al detalle con los datos nuevos
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/Gachas dulces/)).toBeInTheDocument()
    expect(within(dialog).getByText('Hervir la leche')).toBeInTheDocument()
    expect(within(dialog).getByText('Añadir la harina')).toBeInTheDocument()
  })

  it('eliminar una receta propia se puede deshacer y vuelve a su hueco', async () => {
    render(<App />)
    await userEvent.click(screen.getAllByText('+ Añadir')[0])
    await userEvent.type(screen.getByLabelText('Buscar receta'), 'gachas')
    await userEvent.click(screen.getByRole('button', { name: '+ Crear receta «gachas»' }))
    await userEvent.click(screen.getByRole('button', { name: 'Crear receta' }))
    await openTab('Recetas')
    await userEvent.click(screen.getByRole('button', { name: /gachas/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar receta' }))
    await userEvent.click(screen.getByRole('button', { name: 'Sí, eliminar' }))
    expect(screen.queryByRole('button', { name: /gachas/ })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Deshacer' }))
    expect(screen.getByRole('button', { name: /gachas/ })).toBeInTheDocument()
    await openTab('Semana')
    expect(screen.getAllByText('+ Añadir')).toHaveLength(20)
  })
})
