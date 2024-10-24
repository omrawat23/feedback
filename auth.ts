import { AuthOptions, getServerSession } from "next-auth"
import GoogleProvider from 'next-auth/providers/google'

// Add id to Session User
declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      email?: string
      image?: string
      name?: string
    }
  }
}

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub
      }
    }),
  },
}

export const getSession = () => getServerSession(authOptions)
export { authOptions }