import { getFilteredTodos, getTodos } from "#/actions/todos"
import { auth } from "../auth/providers"
import { CheckTodo } from "./check-todo"
import { DeleteTodo } from "./delete-todo"
/* 
const todos = [
  {
    id: crypto.randomUUID(),
    todo: 'Passear com o dog',
    created_at: 'Fri Dec 08 2023 00:00:00'
  },
  {
    id: crypto.randomUUID(),
    todo: 'Ir para academia',
    created_at: 'Fri Dec 08 2023 00:00:00'
  },
  {
    id: crypto.randomUUID(),
    todo: 'Visitar avó',
    created_at: 'Fri Dec 08 2023 00:00:00'
  },
] 
*/

export async function TodosList({ query } : { query: string}) {
  const session = await auth()
  const isAdmin = session?.user.role === 'admin'
  const todos = await getFilteredTodos(query) //const todos = await getTodos() 
  return (
    <ul className="w-80 min-h-80 p-8 border rounded-md bg-violet-50">
      {todos.map(todo => (
        <li key={todo.id} className="mb-1">
          <label className="flex items-center gap-2">
            <CheckTodo>{todo.todo}</CheckTodo>
            {
              isAdmin &&
              <DeleteTodo id={todo.id}/>
            }
          </label>
        </li>
      ))}
    </ul>
  )
}