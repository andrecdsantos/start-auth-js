import NextAuth, { type DefaultSession, DefaultJWT} from "next-auth";

//aqui estou apenas alterando a tipagem
declare module 'next-auth' {
    interface User {
        id: string
        name: string
        email: string
        image?: string | null
        role: string
    }

    //aqui estou alterando o retorno de Session para adicionar tambem a propriedade role.
    interface Session {
        user: {
            role: string
        } & DefaultSession["user"]//interface extend de DefaultSession?
    }
}

//tipagem do jwt
declare module '@auth/core/jwt' {
    interface JWT {
        role: string
    }
}


/* 
Arquivo criado para alterar o retorno padrao das propriedades de Session.user > adicionando a prop role
*/