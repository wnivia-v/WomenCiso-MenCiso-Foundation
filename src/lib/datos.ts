/**
 * Capa de acceso a datos.
 *
 * Cada función devuelve, además de los datos, el origen del que provienen:
 * `"rds"` si salieron de Amazon RDS, `"respaldo"` si la base no respondió y se
 * usaron datos incrustados en el código.
 *
 * Por qué se expone el origen: una app de triage tiene que abrir siempre, así
 * que caer a datos de respaldo es la conducta correcta ante una base caída. Lo
 * que no es correcto es ocultarlo. Un listado de camas disponibles obtenido de
 * un respaldo estático puede llevar a canalizar un paciente a un hospital sin
 * cupo. Quien mira la pantalla necesita saber si está viendo el estado real.
 *
 * Las consultas se ejecutan en el servidor (Server Components), así que la
 * cadena de conexión nunca llega al navegador.
 */

import { obtenerPrisma } from "@/lib/prisma";

export type OrigenDatos = "rds" | "respaldo";

export interface Resultado<T> {
  datos: T;
  origen: OrigenDatos;
  /** Motivo redactado, apto para mostrarse en la interfaz. */
  error?: string;
}

/**
 * Convierte un error de base de datos en un motivo publicable.
 *
 * Los mensajes de PostgreSQL son descriptivos de más para exponerlos: un fallo
 * de autenticación devuelve el nombre de la base, el usuario y el host que se
 * intentó, por ejemplo `no pg_hba.conf entry for host "203.0.113.5", user
 * "postgres", database "womenciso_menciso"`. Ese texto termina en el HTML que
 * recibe el navegador, y le confirma a cualquiera el nombre de la base y del
 * usuario. El mensaje íntegro se registra en el servidor, donde sí es útil.
 */
function motivoPublicable(error: unknown, contexto: string): string {
  const nombre = (error as { name?: string })?.name || "";
  const codigo = (error as { code?: string })?.code || "";

  console.error(`[datos] Fallo al consultar ${contexto}:`, {
    nombre,
    codigo,
    mensaje: (error as { message?: string })?.message,
  });

  // Códigos de Prisma: P1001 sin alcance, P1002 tiempo agotado,
  // P1010 acceso denegado, P2021 tabla inexistente.
  if (codigo === "P1001" || codigo === "P1002") return "La base de datos no responde";
  if (codigo === "P1010") return "Credenciales rechazadas por la base de datos";
  if (codigo === "P2021" || codigo === "P2022") return "Falta ejecutar las migraciones";
  if (nombre.includes("Initialization")) return "No se pudo inicializar la conexión";

  return "Error al consultar la base de datos";
}

/* ============================================================
   HOSPITALES
   ============================================================ */

export interface HospitalVista {
  id: string;
  nombre: string;
  nombreCorto: string;
  tipo: string;
  especialidad: string[];
  direccion: string;
  estado: string;
  municipio: string;
  telefono: string;
  latitud: number;
  longitud: number;
  camasDisponibles: number;
  camasTotales: number;
  tieneUCI: boolean;
  tieneQuirofano: boolean;
  nivelAtencion: string;
}

/** Acorta el nombre institucional para que quepa en tarjetas y marcadores. */
function acortarNombre(nombre: string): string {
  const siglas = nombre.match(/\(([A-Z]{3,})\)/);
  if (siglas) return siglas[1];
  return nombre.length > 32 ? `${nombre.slice(0, 30)}...` : nombre;
}

const HOSPITALES_RESPALDO: HospitalVista[] = [
  {
    id: "respaldo-1",
    nombre: "Centro Nacional de Investigación y Atención de Quemados (CENIAQ)",
    nombreCorto: "CENIAQ",
    tipo: "PUBLICO",
    especialidad: ["Quemaduras", "Cirugía reconstructiva", "Pediatría"],
    direccion: "Av. México-Xochimilco 289",
    estado: "Ciudad de México",
    municipio: "Tlalpan",
    telefono: "55 5999-1000",
    latitud: 19.2866,
    longitud: -99.1621,
    camasDisponibles: 3,
    camasTotales: 40,
    tieneUCI: true,
    tieneQuirofano: true,
    nivelAtencion: "CENTRO_REFERENCIA",
  },
  {
    id: "respaldo-2",
    nombre: "Hospital de Traumatología Victorio de la Fuente Narváez",
    nombreCorto: "H. Traumatología IMSS",
    tipo: "PUBLICO",
    especialidad: ["Quemaduras", "Traumatología"],
    direccion: "Av. Colector 15",
    estado: "Ciudad de México",
    municipio: "Gustavo A. Madero",
    telefono: "55 5747-3500",
    latitud: 19.4823,
    longitud: -99.1187,
    camasDisponibles: 5,
    camasTotales: 30,
    tieneUCI: true,
    tieneQuirofano: true,
    nivelAtencion: "TERCER_NIVEL",
  },
  {
    id: "respaldo-3",
    nombre: "Hospital Pediátrico de Tacubaya",
    nombreCorto: "H. Pediátrico Tacubaya",
    tipo: "PUBLICO",
    especialidad: ["Pediatría", "Quemaduras pediátricas"],
    direccion: "Calle Dr. Márquez 162",
    estado: "Ciudad de México",
    municipio: "Miguel Hidalgo",
    telefono: "55 5515-1133",
    latitud: 19.4002,
    longitud: -99.1893,
    camasDisponibles: 2,
    camasTotales: 15,
    tieneUCI: false,
    tieneQuirofano: true,
    nivelAtencion: "SEGUNDO_NIVEL",
  },
  {
    id: "respaldo-4",
    nombre: "Hospital Civil de Guadalajara Fray Antonio Alcalde",
    nombreCorto: "H. Civil Guadalajara",
    tipo: "PUBLICO",
    especialidad: ["Quemaduras", "Cirugía plástica"],
    direccion: "Calle Hospital 278",
    estado: "Jalisco",
    municipio: "Guadalajara",
    telefono: "33 3942-4400",
    latitud: 20.6803,
    longitud: -103.3474,
    camasDisponibles: 4,
    camasTotales: 25,
    tieneUCI: true,
    tieneQuirofano: true,
    nivelAtencion: "TERCER_NIVEL",
  },
];

export async function obtenerHospitales(): Promise<Resultado<HospitalVista[]>> {
  const prisma = obtenerPrisma();
  if (!prisma) {
    return { datos: HOSPITALES_RESPALDO, origen: "respaldo", error: "Sin configuración de base de datos" };
  }

  try {
    const filas = await prisma.hospital.findMany({
      where: { activo: true },
      orderBy: [{ nivelAtencion: "asc" }, { nombre: "asc" }],
    });

    if (filas.length === 0) {
      return { datos: HOSPITALES_RESPALDO, origen: "respaldo", error: "La base de datos no tiene hospitales" };
    }

    return {
      datos: filas.map((h) => ({
        id: h.id,
        nombre: h.nombre,
        nombreCorto: acortarNombre(h.nombre),
        tipo: h.tipo,
        especialidad: h.especialidad,
        direccion: h.direccion,
        estado: h.estado,
        municipio: h.municipio,
        telefono: h.telefono,
        latitud: h.latitud,
        longitud: h.longitud,
        camasDisponibles: h.camasDisponibles,
        camasTotales: h.camasTotales,
        tieneUCI: h.tieneUCI,
        tieneQuirofano: h.tieneQuirofano,
        nivelAtencion: h.nivelAtencion,
      })),
      origen: "rds",
    };
  } catch (e) {
    return {
      datos: HOSPITALES_RESPALDO,
      origen: "respaldo",
      error: motivoPublicable(e, "hospitales"),
    };
  }
}

/* ============================================================
   EMERGENCIAS
   ============================================================ */

export interface EmergenciaVista {
  id: string;
  folio: string;
  paciente: string;
  edad: number;
  causa: string;
  grado: string;
  superficie: number;
  zonas: string[];
  gravedad: string;
  prioridad: string;
  estado: string;
  fecha: string;
  reportadoPor: string;
  hospital: string | null;
}

/** Calcula la edad en años a partir de la fecha de nacimiento. */
function calcularEdad(fechaNacimiento: Date): number {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) edad--;
  return Math.max(0, edad);
}

const ETIQUETAS_CAUSA: Record<string, string> = {
  LIQUIDO_CALIENTE: "Escaldadura (líquido caliente)",
  FUEGO_DIRECTO: "Fuego directo",
  ELECTRICA: "Eléctrica",
  QUIMICA: "Química",
  RADIACION: "Radiación",
  FRICCION: "Fricción",
  CONGELAMIENTO: "Congelamiento",
  OTRA: "Otra",
};

export function etiquetaCausa(causa: string): string {
  return ETIQUETAS_CAUSA[causa] || causa;
}

const EMERGENCIAS_RESPALDO: EmergenciaVista[] = [
  {
    id: "respaldo-1",
    folio: "EMG-001",
    paciente: "María García López",
    edad: 4,
    causa: "LIQUIDO_CALIENTE",
    grado: "SEGUNDO_GRADO_PROFUNDO",
    superficie: 15,
    zonas: ["brazo_derecho", "torso_anterior"],
    gravedad: "GRAVE",
    prioridad: "ALTA",
    estado: "EN_TRIAGE",
    fecha: new Date().toISOString(),
    reportadoPor: "Madre",
    hospital: "CENIAQ",
  },
  {
    id: "respaldo-2",
    folio: "EMG-002",
    paciente: "Carlos Ramírez Soto",
    edad: 7,
    causa: "FUEGO_DIRECTO",
    grado: "SEGUNDO_GRADO_SUPERFICIAL",
    superficie: 8,
    zonas: ["mano_izquierda", "brazo_izquierdo"],
    gravedad: "MODERADO",
    prioridad: "MEDIA",
    estado: "CANALIZADA",
    fecha: new Date().toISOString(),
    reportadoPor: "Padre",
    hospital: "H. Traumatología IMSS",
  },
  {
    id: "respaldo-3",
    folio: "EMG-003",
    paciente: "Ana Lucía Torres",
    edad: 12,
    causa: "QUIMICA",
    grado: "TERCER_GRADO",
    superficie: 25,
    zonas: ["cara", "cuello", "vias_respiratorias"],
    gravedad: "CRITICO",
    prioridad: "CRITICA",
    estado: "EN_TRANSITO",
    fecha: new Date().toISOString(),
    reportadoPor: "Vecina",
    hospital: "CENIAQ",
  },
];

export async function obtenerEmergencias(): Promise<Resultado<EmergenciaVista[]>> {
  const prisma = obtenerPrisma();
  if (!prisma) {
    return { datos: EMERGENCIAS_RESPALDO, origen: "respaldo", error: "Sin configuración de base de datos" };
  }

  try {
    const filas = await prisma.emergencia.findMany({
      include: { paciente: true, hospital: true },
      orderBy: { fechaReporte: "desc" },
      take: 50,
    });

    if (filas.length === 0) {
      return { datos: [], origen: "rds" };
    }

    return {
      datos: filas.map((e, i) => ({
        id: e.id,
        folio: `EMG-${String(filas.length - i).padStart(3, "0")}`,
        paciente: [e.paciente.nombre, e.paciente.apellidoPaterno, e.paciente.apellidoMaterno]
          .filter(Boolean)
          .join(" "),
        edad: calcularEdad(e.paciente.fechaNacimiento),
        causa: e.causaQuemadura,
        grado: e.gradoQuemadura,
        superficie: e.superficieCorporal,
        zonas: e.zonasAfectadas,
        gravedad: e.nivelGravedad,
        prioridad: e.prioridad,
        estado: e.estado,
        fecha: e.fechaReporte.toISOString(),
        reportadoPor: e.parentescoReportante || e.reportadoPor,
        hospital: e.hospital ? acortarNombre(e.hospital.nombre) : null,
      })),
      origen: "rds",
    };
  } catch (e) {
    return {
      datos: EMERGENCIAS_RESPALDO,
      origen: "respaldo",
      error: motivoPublicable(e, "emergencias"),
    };
  }
}

/* ============================================================
   PACIENTES
   ============================================================ */

export interface PacienteVista {
  id: string;
  nombreCompleto: string;
  edad: number;
  genero: string;
  curp: string | null;
  telefono: string | null;
  contactoEmergencia: string | null;
  parentescoContacto: string | null;
  estado: string | null;
  municipio: string | null;
  tipoSangre: string | null;
  alergias: string | null;
  totalEmergencias: number;
}

const PACIENTES_RESPALDO: PacienteVista[] = [
  {
    id: "respaldo-1",
    nombreCompleto: "María García López",
    edad: 4,
    genero: "FEMENINO",
    curp: "GALM220315MDFRRR01",
    telefono: "55 1234 5678",
    contactoEmergencia: "Lucía López Hernández",
    parentescoContacto: "Madre",
    estado: "Ciudad de México",
    municipio: "Cuauhtémoc",
    tipoSangre: "O+",
    alergias: "Ninguna conocida",
    totalEmergencias: 1,
  },
  {
    id: "respaldo-2",
    nombreCompleto: "Carlos Ramírez Soto",
    edad: 7,
    genero: "MASCULINO",
    curp: "RASC190722HDFRML05",
    telefono: "55 2345 6789",
    contactoEmergencia: "Pedro Ramírez Torres",
    parentescoContacto: "Padre",
    estado: "Ciudad de México",
    municipio: "Benito Juárez",
    tipoSangre: "A+",
    alergias: "Penicilina",
    totalEmergencias: 1,
  },
  {
    id: "respaldo-3",
    nombreCompleto: "Ana Lucía Torres Mendoza",
    edad: 12,
    genero: "FEMENINO",
    curp: "TOMA141108MDFRNL03",
    telefono: "33 3456 7890",
    contactoEmergencia: "Rosa Mendoza Cruz",
    parentescoContacto: "Madre",
    estado: "Jalisco",
    municipio: "Guadalajara",
    tipoSangre: "B+",
    alergias: null,
    totalEmergencias: 1,
  },
  {
    id: "respaldo-4",
    nombreCompleto: "Diego Martínez Reyes",
    edad: 9,
    genero: "MASCULINO",
    curp: "MARD170530HMCRGY09",
    telefono: "55 4567 8901",
    contactoEmergencia: "Laura Reyes Vázquez",
    parentescoContacto: "Madre",
    estado: "Estado de México",
    municipio: "Naucalpan",
    tipoSangre: "O-",
    alergias: "Sulfamidas",
    totalEmergencias: 0,
  },
];

export async function obtenerPacientes(): Promise<Resultado<PacienteVista[]>> {
  const prisma = obtenerPrisma();
  if (!prisma) {
    return { datos: PACIENTES_RESPALDO, origen: "respaldo", error: "Sin configuración de base de datos" };
  }

  try {
    const filas = await prisma.paciente.findMany({
      include: { _count: { select: { emergencias: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    if (filas.length === 0) {
      return { datos: [], origen: "rds" };
    }

    return {
      datos: filas.map((p) => ({
        id: p.id,
        nombreCompleto: [p.nombre, p.apellidoPaterno, p.apellidoMaterno].filter(Boolean).join(" "),
        edad: calcularEdad(p.fechaNacimiento),
        genero: p.genero,
        curp: p.curp,
        telefono: p.telefono,
        contactoEmergencia: p.nombreContactoEmergencia,
        parentescoContacto: p.parentescoContacto,
        estado: p.estado,
        municipio: p.municipio,
        tipoSangre: p.tipoSangre,
        alergias: p.alergias,
        totalEmergencias: p._count.emergencias,
      })),
      origen: "rds",
    };
  } catch (e) {
    return {
      datos: PACIENTES_RESPALDO,
      origen: "respaldo",
      error: motivoPublicable(e, "pacientes"),
    };
  }
}

/* ============================================================
   ESTADÍSTICAS AGREGADAS
   ============================================================ */

export interface EstadisticasVista {
  pacientesTotales: number;
  emergenciasActivas: number;
  hospitalesActivos: number;
  hospitalesConCamas: number;
  camasDisponibles: number;
  porGravedad: { nivel: string; cantidad: number }[];
}

const ESTADISTICAS_RESPALDO: EstadisticasVista = {
  pacientesTotales: 4,
  emergenciasActivas: 3,
  hospitalesActivos: 4,
  hospitalesConCamas: 4,
  camasDisponibles: 14,
  porGravedad: [
    { nivel: "CRITICO", cantidad: 1 },
    { nivel: "GRAVE", cantidad: 1 },
    { nivel: "MODERADO", cantidad: 1 },
    { nivel: "LEVE", cantidad: 0 },
  ],
};

export async function obtenerEstadisticas(): Promise<Resultado<EstadisticasVista>> {
  const prisma = obtenerPrisma();
  if (!prisma) {
    return { datos: ESTADISTICAS_RESPALDO, origen: "respaldo", error: "Sin configuración de base de datos" };
  }

  try {
    // Las consultas van en paralelo: son independientes y así el tiempo total
    // es el de la más lenta, no la suma de todas.
    const [pacientesTotales, emergenciasActivas, hospitales, gravedades] = await Promise.all([
      prisma.paciente.count(),
      prisma.emergencia.count({ where: { estado: { notIn: ["CERRADA"] } } }),
      prisma.hospital.findMany({
        where: { activo: true },
        select: { camasDisponibles: true },
      }),
      prisma.emergencia.groupBy({
        by: ["nivelGravedad"],
        _count: { nivelGravedad: true },
      }),
    ]);

    const conteoPorNivel = new Map(
      gravedades.map((g) => [g.nivelGravedad as string, g._count.nivelGravedad])
    );

    return {
      datos: {
        pacientesTotales,
        emergenciasActivas,
        hospitalesActivos: hospitales.length,
        hospitalesConCamas: hospitales.filter((h) => h.camasDisponibles > 0).length,
        camasDisponibles: hospitales.reduce((sum, h) => sum + h.camasDisponibles, 0),
        porGravedad: ["CRITICO", "GRAVE", "MODERADO", "LEVE"].map((nivel) => ({
          nivel,
          cantidad: conteoPorNivel.get(nivel) ?? 0,
        })),
      },
      origen: "rds",
    };
  } catch (e) {
    return {
      datos: ESTADISTICAS_RESPALDO,
      origen: "respaldo",
      error: motivoPublicable(e, "estadísticas"),
    };
  }
}
