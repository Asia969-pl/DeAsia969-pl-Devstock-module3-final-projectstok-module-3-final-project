// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/library/prisma";
import bcrypt from "bcrypt";

/* ================= TYPES ================= */

interface User {
  id: number;
  email: string;
  name?: string | null;
  phone?: string | null;
  picture?: string | null;
}

/* ================= NEXT-AUTH TYPES ================= */

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User;
  }
}

/* ================= AUTH OPTIONS ================= */

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

        // 1️⃣ SZUKAMY USERA (BEZ HASŁA W WHERE)
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { phone: credentials.identifier },
            ],
          },
        });

        if (!user || !user.password) {
          return null;
        }

        // 2️⃣ PORÓWNANIE HASŁA (bcrypt)
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        // 3️⃣ ZWRACAMY DANE DO SESJI
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          picture: user.picture ?? null,
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
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
