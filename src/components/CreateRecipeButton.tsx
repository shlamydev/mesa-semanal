interface Props {
  query: string
  onClick: () => void
}

/** Se ofrece cuando una búsqueda o filtro no da resultados. */
export function CreateRecipeButton({ query, onClick }: Props) {
  const q = query.trim()
  return (
    <button className="btn" onClick={onClick}>
      {q ? `+ Crear receta «${q}»` : '+ Crear receta'}
    </button>
  )
}
