'use server'

import { Todo } from "#/types/todo"
import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const TodoSchema = z.object({
     id: z.string(),
     todo: z.string(),
     created_at: z.string()
})

const CreateTodo = TodoSchema.omit({ id:true, created_at:true})

export async function createTodo(formData: FormData) {
    const { todo } = CreateTodo.parse({
        todo: formData.get('todo')//name do input
    })
    const date = new Date().toISOString()//converte a data para o formato internacional iso UTC do banco de dados

    try {
        await sql`INSERT INTO todos (todo, created_at) VALUES (${todo}, ${date})`
    } catch (error) {
        return { message: 'falha ao criar todo'}
    }

    revalidatePath('/todos')//revalidar o cache para atualizar a lista com o novo valor inserido
    redirect('/todos')
    /* 
    const rawTodoData = {
        todo: formData.get('todo')valor do campo name do input
    }
    console.log(rawTodoData)
    */
}

/* export async function getTodos() {
    try {
        const { rows } = await sql`SELECT * FROM todos`
        return rows
    } catch (error) {
        return { message: 'erro ao buscar todos no banco de dados.'}
    }
} */

export async function getFilteredTodos(query: string) {
    try {
        const { rows } = await sql` 
            SELECT * 
            FROM todos
            WHERE todos.todo
            ILIKE ${`%${query}%`}
            ORDER BY todos.created_at DESC 
        `
        //ILIKE sem case sensitive --- %entre% texto parecido
        return rows
    } catch (error) {
        return { message: 'erro ao buscar todos no banco de dados.'}
    }
}

export async function deleteTodo(id: string) {
    try {
        await sql`DELETE FROM todos WHERE id = ${id}`
    } catch (error) {
        return {  message: 'erro ao deletar todo do banco de dados'}
    }
    revalidatePath('/todos')
}