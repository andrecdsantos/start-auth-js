'use server'

import { sql } from "@vercel/postgres"
import { z } from "zod"
import bcrypt  from "bcrypt"
import { redirect } from "next/navigation"
import { User } from "#/types/user"
import { signIn } from "#/app/auth/providers"

const UserSchema = z.object({
    id: z.string(),
    name: z.string({ required_error: 'O nome é obrigatório'})
    .min(3, 'O nome deve conter pelo menos 3 caracteres'),
    email: z.string().email('Insira um email válido'),
    password: z.string().min(6, 'A senha deve conter pelo menos 6 caracteres'),
    image: z.string(),
    role: z.string()
})

const CreateUser = UserSchema.omit({ id: true, image: true, role: true })

type CreateUserState = {
    errors?: {
       name?: string[]//array pq tem mais de uma validacao de erro, cada erro é uma posicao do array 
       email?: string[] //aqui nao é obrigatorio ser array, pq so tem uma validacao, mas foi feito array pensando em incrementos de mais validaçoes no futuro
       password?: string[] 
    }
}

//foi dado o nome state pq armazena o estado da validacao, mas podia ser errors tmbm
export async function createUser(state: CreateUserState, formData: FormData) {
    const validatedFields = CreateUser.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    })
    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Preencha todos os campos' //mensagem de erro universal
        }
    }

    //se passou pelas validaçoes chegou aqui e pode ser salvo no banco 
    const { name, email, password } = validatedFields.data

    const hashedPassword = await bcrypt.hash(password, 10)//fazendo a criptografia da senha, primeiro param nome do campo, segundo a seguranca da criptografia
    const githubImage = `https://github.com/${name}.png`//se o usuario se cadastrar com o mesmo nome do github ele vai ter a foto do github
    const role = 'user'
    try {
        await sql`
            INSERT INTO users (name, email, password, image, role)
            VALUES (${name}, ${email}, ${hashedPassword}, ${githubImage}, ${role}) 
        `
    } catch (error) {
        return {message: 'erro ao inserir usuário no banco de dados'}
    }
    redirect('/auth/login')
}

export async function getUserByEmail(email: string) {
    try {
        const { rows } = await sql<User>`SELECT * FROM users WHERE email = ${email}`
        console.log('GETUSERBYEMAIL: ', rows)
        return rows[0]
    } catch (error) {
        throw new Error('Este usuário não existe')
    }
}

export async function authenticate(state: string | undefined, formData: FormData) { //verifica se o usuario esta autenticado
    try {
        await signIn('credentials', Object.fromEntries(formData))//signIn q eu criei
    } catch (error) { //diferenciando erros de authenticacao de outros erros
        if((error as Error).message.includes('CredentialsSignin')) return 'CredentialsSignin'

        throw error // outros erros genericos
    }
}