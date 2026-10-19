import { weekDates, weekLabel } from './week'

const days = (d: Date[]) => d.map((x) => x.getDate())

describe('weekDates', () => {
  it('empieza en lunes aunque la fecha sea otro día', () => {
    // 21 oct 2026 es miércoles
    expect(days(weekDates(new Date(2026, 9, 21)))).toEqual([19, 20, 21, 22, 23, 24, 25])
  })
  it('un domingo pertenece a la semana que termina ese día', () => {
    expect(days(weekDates(new Date(2026, 9, 25)))).toEqual([19, 20, 21, 22, 23, 24, 25])
  })
  it('cruza el cambio de mes y de año', () => {
    expect(days(weekDates(new Date(2026, 11, 31)))).toEqual([28, 29, 30, 31, 1, 2, 3])
  })
})

describe('weekLabel', () => {
  it('semana dentro de un mes', () => {
    expect(weekLabel(weekDates(new Date(2026, 9, 21)))).toBe('Semana del 19 al 25 de octubre')
  })
  it('semana entre dos meses', () => {
    expect(weekLabel(weekDates(new Date(2026, 9, 28)))).toBe('Semana del 26 de octubre al 1 de noviembre')
  })
})
