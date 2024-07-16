import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "@auth/core/providers/credentials";
import GitHub from "@auth/core/providers/github";
import { User } from "@/shared/types/response/user";
import { Metadata } from "@/shared/types/response/dto";
import { URI_PATH } from "@/shared/constants/path";

declare module "next-auth" {
  interface Session {
    user: {
      data: {
        user: User,
        accessToken: string,
      },
      metadata: Metadata,
      accessToken: string,
    } & DefaultSession['user'],
    picture: string,
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const authResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/${URI_PATH.AUTH.SIGN_IN}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': '*/*'
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          })
        if (!authResponse.ok) {
          return null
        }

        return await authResponse.json()
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.access_token) {
        const githubAuth = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/${URI_PATH.AUTH.SIGN_IN_GITHUB}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': '*/*',
            },
            body: JSON.stringify({
              githubToken: account.access_token,
            })
          })
        const sessionAuthJson = await githubAuth.json()
        user = {
          ...sessionAuthJson,
        }
      }
      user && (token.user = { ...user } as any)
      return token
    },
    async signIn({ account, user, credentials }) {
      if (!credentials) {
        const githubAuth = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/${URI_PATH.AUTH.SIGN_IN_GITHUB}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': '*/*',
            },
            body: JSON.stringify({
              githubToken: account?.access_token,
            }),
          });

        if (!githubAuth.ok) return false;
      }

      return true;
    },
    session({ session, token }) {
      return { ...session, ...token }
    },
  },
  session: {
    maxAge: 3600,
  },
  jwt: {
    maxAge: 3600
  },
  trustHost: true,
  pages: {
    newUser: '/auth/signup',
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/signin'
  },
})