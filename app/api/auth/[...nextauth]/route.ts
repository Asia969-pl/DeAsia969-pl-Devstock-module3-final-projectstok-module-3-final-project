import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/library/prisma";
import bcrypt from "bcryptjs";

/* =========================
   TYPES
========================= */

interface User {
  id: number;
  email: string;
  name?: string | null;
  phone?: string | null;
  picture?: string | null;
}

/* =========================
   NEXTAUTH TYPE AUGMENTATION
========================= */

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

/* =========================
   AUTH OPTIONS
========================= */

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) {
          return null;
        }

        // 🔎 1. Szukamy usera po email LUB phone
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

        // 🔐 2. Porównanie hasła (bcryptjs)
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        // ✅ 3. Zwracamy dane usera do JWT / sesji
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
      if (user) {
        token.user = user as User;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as User;
      }
      return session;
    },
  },
};

/* =========================
   HANDLER
========================= */

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
