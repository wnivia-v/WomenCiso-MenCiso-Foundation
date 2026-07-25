/**
 * Seed — datos ficticios de demostración para la base de datos.
 *
 * Ejecutar: npx prisma db seed
 *
 * Todos los nombres, diagnósticos y direcciones son inventados.
 * Los hospitales están basados en instituciones reales de México
 * pero con datos de contacto ficticios.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Insertando datos de demostración...");

  // ===== HOSPITALES =====
  const hospitales = await Promise.all([
    prisma.hospital.create({
      data: {
        nombre: "Centro Nacional de Investigación y Atención de Quemados (CENIAQ)",
        tipo: "PUBLICO",
        especialidad: ["Quemaduras", "Cirugía reconstructiva", "Pediatría"],
        direccion: "Av. México-Xochimilco 289, Arenal de Guadalupe",
        estado: "Ciudad de México",
        municipio: "Tlalpan",
        codigoPostal: "14389",
        telefono: "55 5999-1000",
        telefonoUrgencias: "55 5999-1001",
        email: "urgencias@ceniaq.gob.mx",
        latitud: 19.2866,
        longitud: -99.1621,
        camasDisponibles: 3,
        camasTotales: 40,
        tieneUCI: true,
        tieneQuirofano: true,
        nivelAtencion: "CENTRO_REFERENCIA",
        contactoNombre: "Dr. Roberto Méndez",
        contactoCargo: "Director de Urgencias",
        activo: true,
      },
    }),
    prisma.hospital.create({
      data: {
        nombre: "Hospital de Traumatología Victorio de la Fuente Narváez",
        tipo: "PUBLICO",
        especialidad: ["Quemaduras", "Traumatología"],
        direccion: "Av. Colector 15, Magdalena de las Salinas",
        estado: "Ciudad de México",
        municipio: "Gustavo A. Madero",
        codigoPostal: "07760",
        telefono: "55 5747-3500",
        email: "contacto@imss.gob.mx",
        latitud: 19.4823,
        longitud: -99.1187,
        camasDisponibles: 5,
        camasTotales: 30,
        tieneUCI: true,
        tieneQuirofano: true,
        nivelAtencion: "TERCER_NIVEL",
        activo: true,
      },
    }),
    prisma.hospital.create({
      data: {
        nombre: "Hospital Pediátrico de Tacubaya",
        tipo: "PUBLICO",
        especialidad: ["Pediatría", "Quemaduras pediátricas"],
        direccion: "Calle Dr. Márquez 162, Tacubaya",
        estado: "Ciudad de México",
        municipio: "Miguel Hidalgo",
        codigoPostal: "11870",
        telefono: "55 5515-1133",
        email: "pediatrico.tacubaya@salud.gob.mx",
        latitud: 19.4002,
        longitud: -99.1893,
        camasDisponibles: 2,
        camasTotales: 15,
        tieneUCI: false,
        tieneQuirofano: true,
        nivelAtencion: "SEGUNDO_NIVEL",
        activo: true,
      },
    }),
    prisma.hospital.create({
      data: {
        nombre: "Hospital Civil de Guadalajara Fray Antonio Alcalde",
        tipo: "PUBLICO",
        especialidad: ["Quemaduras", "Cirugía plástica"],
        direccion: "Calle Hospital 278, Centro",
        estado: "Jalisco",
        municipio: "Guadalajara",
        codigoPostal: "44280",
        telefono: "33 3942-4400",
        email: "urgencias@hcg.gob.mx",
        latitud: 20.6803,
        longitud: -103.3474,
        camasDisponibles: 4,
        camasTotales: 25,
        tieneUCI: true,
        tieneQuirofano: true,
        nivelAtencion: "TERCER_NIVEL",
        activo: true,
      },
    }),
  ]);

  // ===== PACIENTES =====
  const pacientes = await Promise.all([
    prisma.paciente.create({
      data: {
        nombre: "María",
        apellidoPaterno: "García",
        apellidoMaterno: "López",
        fechaNacimiento: new Date("2022-03-15"),
        genero: "FEMENINO",
        curp: "GALM220315MDFRRR01",
        telefono: "55 1234 5678",
        telefonoEmergencia: "55 8765 4321",
        nombreContactoEmergencia: "Lucía López Hernández",
        parentescoContacto: "Madre",
        direccion: "Calle Reforma 45, Col. Centro",
        estado: "Ciudad de México",
        municipio: "Cuauhtémoc",
        codigoPostal: "06000",
        tipoSangre: "O+",
        alergias: "Ninguna conocida",
      },
    }),
    prisma.paciente.create({
      data: {
        nombre: "Carlos",
        apellidoPaterno: "Ramírez",
        apellidoMaterno: "Soto",
        fechaNacimiento: new Date("2019-07-22"),
        genero: "MASCULINO",
        curp: "RASC190722HDFRML05",
        telefono: "55 2345 6789",
        telefonoEmergencia: "55 9876 5432",
        nombreContactoEmergencia: "Pedro Ramírez Torres",
        parentescoContacto: "Padre",
        direccion: "Av. Insurgentes 1200, Col. Del Valle",
        estado: "Ciudad de México",
        municipio: "Benito Juárez",
        codigoPostal: "03100",
        tipoSangre: "A+",
        alergias: "Penicilina",
      },
    }),
    prisma.paciente.create({
      data: {
        nombre: "Ana Lucía",
        apellidoPaterno: "Torres",
        apellidoMaterno: "Mendoza",
        fechaNacimiento: new Date("2014-11-08"),
        genero: "FEMENINO",
        curp: "TOMA141108MDFRNL03",
        telefono: "33 3456 7890",
        telefonoEmergencia: "33 0987 6543",
        nombreContactoEmergencia: "Rosa Mendoza Cruz",
        parentescoContacto: "Madre",
        direccion: "Calle Hidalgo 89, Col. Americana",
        estado: "Jalisco",
        municipio: "Guadalajara",
        codigoPostal: "44160",
        tipoSangre: "B+",
      },
    }),
    prisma.paciente.create({
      data: {
        nombre: "Diego",
        apellidoPaterno: "Martínez",
        apellidoMaterno: "Reyes",
        fechaNacimiento: new Date("2017-05-30"),
        genero: "MASCULINO",
        curp: "MARD170530HMCRGY09",
        telefono: "55 4567 8901",
        telefonoEmergencia: "55 1098 7654",
        nombreContactoEmergencia: "Laura Reyes Vázquez",
        parentescoContacto: "Madre",
        direccion: "Calle Morelos 234, Col. Industrial",
        estado: "Estado de México",
        municipio: "Naucalpan",
        codigoPostal: "53370",
        tipoSangre: "O-",
        alergias: "Sulfamidas",
      },
    }),
  ]);

  // ===== EMERGENCIAS =====
  await Promise.all([
    prisma.emergencia.create({
      data: {
        pacienteId: pacientes[0].id,
        reportadoPor: "Lucía López Hernández",
        parentescoReportante: "Madre",
        telefonoReportante: "55 8765 4321",
        ubicacionIncidente: "Cocina del domicilio, Calle Reforma 45",
        latitudIncidente: 19.4326,
        longitudIncidente: -99.1332,
        causaQuemadura: "LIQUIDO_CALIENTE",
        gradoQuemadura: "SEGUNDO_GRADO_PROFUNDO",
        superficieCorporal: 15,
        zonasAfectadas: ["brazo_derecho", "torso_anterior"],
        tiempoTranscurrido: "20 minutos",
        primerAuxilio: "Agua fría durante 10 minutos",
        nivelGravedad: "GRAVE",
        prioridad: "ALTA",
        estado: "EN_TRIAGE",
        hospitalId: hospitales[0].id,
        observaciones: "Paciente consciente, llorando, quejándose de dolor intenso",
      },
    }),
    prisma.emergencia.create({
      data: {
        pacienteId: pacientes[1].id,
        reportadoPor: "Pedro Ramírez Torres",
        parentescoReportante: "Padre",
        telefonoReportante: "55 9876 5432",
        ubicacionIncidente: "Vía pública, afuera de la casa",
        latitudIncidente: 19.3910,
        longitudIncidente: -99.1600,
        causaQuemadura: "FUEGO_DIRECTO",
        gradoQuemadura: "SEGUNDO_GRADO_SUPERFICIAL",
        superficieCorporal: 8,
        zonasAfectadas: ["mano_izquierda", "brazo_izquierdo"],
        tiempoTranscurrido: "45 minutos",
        primerAuxilio: "Ninguno",
        nivelGravedad: "MODERADO",
        prioridad: "MEDIA",
        estado: "CANALIZADA",
        hospitalId: hospitales[1].id,
        observaciones: "Quemadura por pirotecnia. Padre aplicó mantequilla (se indicó no hacerlo).",
      },
    }),
    prisma.emergencia.create({
      data: {
        pacienteId: pacientes[2].id,
        reportadoPor: "Vecina del domicilio",
        parentescoReportante: "Vecino",
        telefonoReportante: "33 0987 6543",
        ubicacionIncidente: "Baño del domicilio",
        latitudIncidente: 20.6803,
        longitudIncidente: -103.3474,
        causaQuemadura: "QUIMICA",
        gradoQuemadura: "TERCER_GRADO",
        superficieCorporal: 25,
        zonasAfectadas: ["cara", "cuello", "vias_respiratorias"],
        tiempoTranscurrido: "15 minutos",
        primerAuxilio: "Se lavó con agua",
        nivelGravedad: "CRITICO",
        prioridad: "CRITICA",
        estado: "EN_TRANSITO",
        hospitalId: hospitales[0].id,
        observaciones: "Producto de limpieza con ácido. Dificultad para respirar. URGENTE.",
      },
    }),
  ]);

  // ===== USUARIOS DEL SISTEMA =====
  await Promise.all([
    prisma.usuario.create({
      data: {
        email: "admin@womenciso-menciso.org",
        nombre: "Carlos Pérez",
        rol: "ADMIN",
      },
    }),
    prisma.usuario.create({
      data: {
        email: "coord@womenciso-menciso.org",
        nombre: "María López",
        rol: "COORDINADOR",
      },
    }),
    prisma.usuario.create({
      data: {
        email: "dr.ramirez@ceniaq.gob.mx",
        nombre: "Dr. Roberto Méndez",
        rol: "MEDICO",
      },
    }),
    prisma.usuario.create({
      data: {
        email: "psicologa@womenciso-menciso.org",
        nombre: "Dra. Patricia Solís",
        rol: "PSICOLOGO",
      },
    }),
  ]);

  console.log("✓ Datos de demostración insertados correctamente");
  console.log(`  - ${hospitales.length} hospitales`);
  console.log(`  - ${pacientes.length} pacientes`);
  console.log("  - 3 emergencias");
  console.log("  - 4 usuarios del sistema");
}

main()
  .catch((e) => {
    console.error("Error al insertar datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
