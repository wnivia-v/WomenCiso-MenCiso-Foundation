// Prisma client singleton
// Se activará cuando se conecte la base de datos PostgreSQL
// Por ahora el sistema funciona con datos de demostración

// Para activar:
// 1. Tener PostgreSQL corriendo localmente
// 2. Ejecutar: npx prisma migrate dev --name init
// 3. Ejecutar: npx prisma generate
// 4. Descomentar el código de abajo

// import { PrismaClient } from "@prisma/client";
//
// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };
//
// export const prisma = globalForPrisma.prisma ?? new PrismaClient();
//
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export {};
