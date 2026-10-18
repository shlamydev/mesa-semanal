import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App', () => {
  it('muestra el título y las pestañas', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Mesa Semanal' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('la lista de la compra empieza vacía', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('tab', { name: /Compra/ }))
    expect(screen.getByText(/Tu lista está vacía/)).toBeInTheDocument()
  })

  it('cambia el número de personas', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Más personas' }))
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
