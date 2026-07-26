/**
 * Cliente de Prisma conectado a Amazon RDS PostgreSQL.
 *
 * Prisma 7 requiere un driver adapter explícito en lugar de leer la URL desde
 * el schema. Se usa `@prisma/adapter-pg` sobre el driver `pg`.
 *
 * Nota sobre TLS: RDS presenta un certificado firmado por la CA de Amazon, que
 * el driver no reconoce en su almacén por defecto. El parámetro
 * `uselibpqcompat=true` de la cadena de conexión hace que `sslmode=require`
 * cifre el tránsito sin exigir la validación completa de la cadena, que es la
 * semántica estándar de libpq. El tráfico va cifrado; lo que no se verifica es
 * la identidad del servidor. Para producción con datos reales de pacientes hay
 * que pasar a `sslmode=verify-full` con el bundle de CA de RDS descargado, tal
 * como se indica en el roadmap de la auditoría de seguridad.
 *
 * El patrón singleton evita agotar el pool de conexiones: en desarrollo, el
 * hot-reload de Next.js reevalúa los módulos en cada cambio, y sin esto cada
 * recarga abriría un cliente nuevo hasta tumbar la instancia db.t4g.micro,
 * que admite pocas conexiones concurrentes.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function crearCliente(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL no está definida");
  }

  const adapter = new PrismaPg({
    connectionString,

    // Tope de conexiones por instancia de cómputo.
    //
    // La instancia db.t4g.micro tiene 1 GB de RAM y admite del orden de 100
    // conexiones simultáneas. Amplify puede levantar varias instancias de
    // cómputo en paralelo bajo carga, y cada una abriría su propio pool. Con el
    // valor por defecto, unas pocas instancias concurrentes agotan el límite del
    // servidor y las consultas empiezan a fallar con "too many connections" —
    // que en esta app significa que la pantalla de camas disponibles deja de
    // funcionar justo cuando hay más demanda.
    //
    // Con 5 por instancia, harían falta 20 instancias concurrentes para llegar
    // al límite, lo que da margen suficiente.
    max: 5,

    // Cierra conexiones ociosas para liberar cupo en el servidor.
    idleTimeoutMillis: 30_000,

    // Si no hay conexión libre en 10 segundos, falla rápido en lugar de dejar
    // la petición esperando indefinidamente.
    connectionTimeoutMillis: 10_000,
  });

  return new PrismaClient({ adapter });
}

/**
 * Devuelve el cliente, o `null` si no hay `DATABASE_URL` configurada.
 *
 * Se devuelve `null` en lugar de lanzar una excepción porque la app debe poder
 * construirse y servirse sin base de datos: durante `next build` las páginas se
 * prerenderizan sin acceso a RDS, y en una demo la app tiene que abrir aunque
 * la base esté caída. Cada consulta decide qué hacer ante la ausencia.
 */
export function obtenerPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;

  if (!globalForPrisma.prisma) {
    try {
      globalForPrisma.prisma = crearCliente();
    } catch {
      return null;
    }
  }

  return globalForPrisma.prisma;
}
