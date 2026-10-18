/** Redondea a un decimal y usa coma decimal (1,5). */
export const formatQty = (n: number): string => String(Math.round(n * 10) / 10).replace('.', ',')

export const formatKcal = (k: number): string => `≈ ${Math.round(k)} kcal`

export const formatKcalPerson = (k: number): string => `${formatKcal(k)} por persona`
