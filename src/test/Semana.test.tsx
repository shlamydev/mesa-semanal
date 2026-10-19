import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const meal = (name: string) => screen.getByRole('button', { name })
const columns = () => document.querySelectorAll('.colh').length

describe('Semana', () => {
  it('empieza con desayuno, comida y cena', () => {
    render(<App />)
    expect(columns()).toBe(3)
    expect(meal('Desayuno')).toHaveAttribute('aria-pressed', 'true')
    expect(meal('Almuerzo')).toHaveAttribute('aria-pressed', 'false')
  })

  it('añade y oculta comidas; la cuadrícula se adapta', async () => {
    render(<App />)
    await userEvent.click(meal('Almuerzo'))
    await userEvent.click(meal('Merienda'))
    expect(columns()).toBe(5)
    await userEvent.click(meal('Cena'))
    expect(columns()).toBe(4)
  })

  it('siempre deja al menos una comida activa', async () => {
    render(<App />)
    await userEvent.click(meal('Desayuno'))
    await userEvent.click(meal('Cena'))
    await userEvent.click(meal('Comida'))
    expect(columns()).toBe(1)
    expect(meal('Comida')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Debe quedar al menos una comida activa')).toBeInTheDocument()
  })

  it('elige una receta para un hueco y muestra sus kcal y el total del día', async () => {
    render(<App />)
    await userEvent.click(screen.getAllByText('+ Añadir')[0]) // lunes, desayuno
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Desayuno del lunes')).toBeInTheDocument()
    await userEvent.click(within(dialog).getByText('Tostada de aguacate y huevo'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const week = within(document.querySelector<HTMLElement>('.week')!)
    expect(week.getByText('≈ 380 kcal por persona', { exact: false })).toBeInTheDocument()
    expect(week.getByText('≈ 380 kcal')).toBeInTheDocument()
    // la cabecera refleja el progreso y la media diaria
    expect(screen.getByText('1 de 21 comidas')).toBeInTheDocument()
    expect(screen.getByText('≈ 380 kcal por persona', { selector: 'dd' })).toBeInTheDocument()
  })

  it('el selector se cierra con Escape', async () => {
    render(<App />)
    await userEvent.click(screen.getAllByText('+ Añadir')[0])
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('ocultar una comida conserva su receta, pero no cuenta en la compra', async () => {
    render(<App />)
    await userEvent.click(screen.getAllByText('+ Añadir')[0])
    await userEvent.click(screen.getByText('Tostada de aguacate y huevo'))
    await userEvent.click(meal('Desayuno'))
    await userEvent.click(screen.getByRole('tab', { name: /Compra/ }))
    expect(screen.getByText(/Tu lista está vacía/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('tab', { name: 'Semana' }))
    await userEvent.click(meal('Desayuno'))
    expect(screen.getByText('Tostada de aguacate y huevo', { exact: false })).toBeInTheDocument()
  })

  it('sugerir semana solo rellena las comidas activas', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Sugerir semana' }))
    expect(screen.queryAllByText('+ Añadir')).toHaveLength(0)
    await userEvent.click(meal('Merienda'))
    expect(screen.getAllByText('+ Añadir')).toHaveLength(7)
  })
})
