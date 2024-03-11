'use client'
import { useSearchParams, usePathname, useRouter } from "next/navigation"

export function SearchTodos() {
  const searchParams = useSearchParams()//permite manipular os params da URL
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearchTodos = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('query', value)//cria um novo param, retorna o nome do parametro e o seu valor
    } else {
      params.delete('query')//qndo n tiver valor no input, ou ele for limpo deleta o param  
    }
    replace(`${pathname}?${params.toString()}`)//constroi a rota de acordo com o param etro criado 
    //console.log(params)
  }
  return (
    <input
      type="search"
      onChange={e => handleSearchTodos(e.target.value)}
      defaultValue={searchParams.get('query')?.toString()}
      placeholder="Pesquisar todo..." 
      className="block w-80 p-2 mb-4 border rounded-md" 
    />
  )
}