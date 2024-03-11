//import credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { getUserByEmail } from "#/actions/users";
import bcrypt from "bcrypt"
import NextAuth from "next-auth";

// sobreescrevendo o prividers padrao criado no auth.config
const providers = {
    ...authConfig,
    providers: [  
        Credentials({
            async authorize(credentials) { // func authorize retorna ou o usuario ou null
                const parsedCredentials = z.object({
                    email: z.string().email('Insira um email válido'),
                    password: z.string().min(6, 'A senha deve conter no minimo 6 caracteres')
                }).safeParse(credentials)
                
                if(parsedCredentials.success) { // se passou pela validacao
                    const {email, password} = parsedCredentials.data //transferindo os dados do obj para as const
                    const user = await getUserByEmail(email) // verifica se o usuario esta cadastrado no banco de dados

                    if(!user) return null

                    const passwordMatch = await bcrypt.compare(password, user.password)//se a senha q digitou e a mesma no bando de dados retorna verdadeiro
                    if(passwordMatch) {
                        return user
                    }
                }
                return null
            }
         }) 
    ]
}

export const { auth, signIn, signOut } = NextAuth(providers)