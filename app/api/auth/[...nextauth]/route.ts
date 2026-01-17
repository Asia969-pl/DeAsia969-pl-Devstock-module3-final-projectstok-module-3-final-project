import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/library/prisma";
import bcrypt from "bcrypt";

// 🔹 Typ użytkownika
interface User {
  id: number;
  email: string;
  name?: string | null;
  phone?: string | null;
  picture?: string | null;
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
  interface JWT {
    user?: User;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<User | null> {
        if (!credentials?.identifier || !credentials.password) {
          return null;
        }

        // ✅ 1. Szukamy usera TYLKO po email / phone
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { phone: credentials.identifier },
            ],
          },
        });

        if (!user || !user.password) return null;

        // ✅ 2. PORÓWNANIE HASHA
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        // ✅ 3. Zwracamy usera do sesji
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          picture: user.picture,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
