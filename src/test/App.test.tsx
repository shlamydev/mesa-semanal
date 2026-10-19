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

  it('copia la lista de la compra al portapapeles', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByText('+ Añadir')[0])
    await user.click(screen.getByText('Tostada de aguacate y huevo'))
    await user.click(screen.getByRole('tab', { name: /Compra/ }))
    await user.click(screen.getByRole('button', { name: 'Copiar lista' }))
    const text = await navigator.clipboard.readText()
    expect(text).toContain('Lista de la compra (2 personas)')
    expect(text).toContain('- Aguacate: 1 ud')
    expect(screen.getByText('Lista copiada')).toBeInTheDocument()
  })
})
