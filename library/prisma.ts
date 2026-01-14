// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Tworzymy globalny obiekt, żeby uniknąć wielokrotnego tworzenia instancji w dev (hot reload)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Tworzymy lub używamy istniejącej instancji
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ 
    log: ["query"],
  });

// W dev przypisujemy instancję do globalThis, aby hot reload nie tworzył nowego klienta
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
