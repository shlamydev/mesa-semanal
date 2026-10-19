const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

/** Las 7 fechas (lunes a domingo) de la semana que contiene `from`. */
export function weekDates(from: Date): Date[] {
  const monday = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i))
}

/** «Semana del 19 al 25 de octubre» o «Semana del 27 de octubre al 2 de noviembre». */
export function weekLabel(dates: readonly Date[]): string {
  const first = dates[0]
  const last = dates[dates.length - 1]
  if (first.getMonth() === last.getMonth()) {
    return `Semana del ${first.getDate()} al ${last.getDate()} de ${MONTHS[last.getMonth()]}`
  }
  return `Semana del ${first.getDate()} de ${MONTHS[first.getMonth()]} al ${last.getDate()} de ${MONTHS[last.getMonth()]}`
}
