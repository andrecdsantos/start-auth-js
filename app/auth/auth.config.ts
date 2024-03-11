import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: { signIn: '/auth/login'},
    callbacks: {
        authorized({ auth, request: { nextUrl }}) { //auth recebe null ou um obj session que possui os dados do usuario da sessao 
            const isLoggedIn = !!auth?.user // convertendo o resultado em booleano atraves de !!
            const isPrivateRoutes = nextUrl.pathname.startsWith('/private')//verificando se a rota de rquisicao começa com private
            const isAuthRoutes = nextUrl.pathname.startsWith('/auth')//verificando se o usuario esta tentando acessar uma rota de autenticacao

            if(!isLoggedIn && isPrivateRoutes) {
                return false
            }
            if(isLoggedIn && isAuthRoutes) { //se o usuario esta logado e esta tentando acessar a rota de autenticacao(naz faz sentido)
                 return Response.redirect(new URL('/private', nextUrl)) //rota p ser enviado, a requisicao retornada da funcao authorized
            }

            return true //usuario autenticado
        },
        jwt({ token, user }) {
            if(user) token.role = user.role
            //console.log('token: ', token)
            //console.log('user: ', user)
            return token
        },
        session( { session, token }) {
            if(token.role) session.user.role = token.role
            return session
        }
    },
    providers: []
} as NextAuthConfig