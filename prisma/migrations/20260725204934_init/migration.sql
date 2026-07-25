-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoHospital" AS ENUM ('PUBLICO', 'PRIVADO', 'MILITAR', 'UNIVERSITARIO');

-- CreateEnum
CREATE TYPE "NivelAtencion" AS ENUM ('PRIMER_NIVEL', 'SEGUNDO_NIVEL', 'TERCER_NIVEL', 'CENTRO_REFERENCIA');

-- CreateEnum
CREATE TYPE "CausaQuemadura" AS ENUM ('LIQUIDO_CALIENTE', 'FUEGO_DIRECTO', 'ELECTRICA', 'QUIMICA', 'RADIACION', 'FRICCION', 'CONGELAMIENTO', 'OTRA');

-- CreateEnum
CREATE TYPE "GradoQuemadura" AS ENUM ('PRIMER_GRADO', 'SEGUNDO_GRADO_SUPERFICIAL', 'SEGUNDO_GRADO_PROFUNDO', 'TERCER_GRADO', 'CUARTO_GRADO');

-- CreateEnum
CREATE TYPE "NivelGravedad" AS ENUM ('LEVE', 'MODERADO', 'GRAVE', 'CRITICO');

-- CreateEnum
CREATE TYPE "Prioridad" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "EstadoEmergencia" AS ENUM ('REPORTADA', 'EN_TRIAGE', 'CANALIZADA', 'EN_TRANSITO', 'RECIBIDA_EN_HOSPITAL', 'EN_TRATAMIENTO', 'CERRADA');

-- CreateEnum
CREATE TYPE "EstadoCanalizacion" AS ENUM ('PENDIENTE', 'NOTIFICADA', 'ACEPTADA', 'RECHAZADA', 'PACIENTE_EN_CAMINO', 'PACIENTE_RECIBIDO', 'CANCELADA');

-- CreateEnum
CREATE TYPE "EstadoPaciente" AS ENUM ('ACTIVO', 'EN_RECUPERACION', 'ALTA_MEDICA', 'SEGUIMIENTO', 'CERRADO');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('FOTO_INICIAL', 'FOTO_EVOLUCION', 'ESTUDIO_LABORATORIO', 'ESTUDIO_IMAGEN', 'RECETA', 'NOTA_MEDICA', 'REFERENCIA', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoSeguimiento" AS ENUM ('CURACION', 'REVISION_MEDICA', 'REHABILITACION', 'TERAPIA_FISICA', 'CONTROL', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoSesion" AS ENUM ('EVALUACION_INICIAL', 'TERAPIA_INDIVIDUAL', 'TERAPIA_FAMILIAR', 'GRUPO_APOYO', 'CRISIS', 'SEGUIMIENTO');

-- CreateEnum
CREATE TYPE "CategoriaCosto" AS ENUM ('CIRUGIA', 'MEDICAMENTOS', 'HOSPITALIZACION', 'ESTUDIOS', 'TRASLADO', 'REHABILITACION', 'PSICOLOGIA', 'MATERIAL_CURACION', 'OTRO');

-- CreateEnum
CREATE TYPE "EstatusPago" AS ENUM ('PENDIENTE', 'APROBADO', 'PAGADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'COORDINADOR', 'MEDICO', 'PSICOLOGO', 'VOLUNTARIO');

-- CreateTable
CREATE TABLE "pacientes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidoPaterno" TEXT NOT NULL,
    "apellidoMaterno" TEXT,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "genero" "Genero" NOT NULL,
    "curp" TEXT,
    "telefono" TEXT,
    "telefonoEmergencia" TEXT,
    "nombreContactoEmergencia" TEXT,
    "parentescoContacto" TEXT,
    "direccion" TEXT,
    "estado" TEXT,
    "municipio" TEXT,
    "codigoPostal" TEXT,
    "tipoSangre" TEXT,
    "alergias" TEXT,
    "antecedentes" TEXT,
    "seguroMedico" TEXT,
    "numeroSeguro" TEXT,
    "fotografiaUrl" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospitales" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoHospital" NOT NULL,
    "especialidad" TEXT[],
    "direccion" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "codigoPostal" TEXT,
    "telefono" TEXT NOT NULL,
    "telefonoUrgencias" TEXT,
    "email" TEXT,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "camasDisponibles" INTEGER NOT NULL DEFAULT 0,
    "camasTotales" INTEGER NOT NULL DEFAULT 0,
    "tieneUCI" BOOLEAN NOT NULL DEFAULT false,
    "tieneQuirofano" BOOLEAN NOT NULL DEFAULT false,
    "nivelAtencion" "NivelAtencion" NOT NULL,
    "contactoNombre" TEXT,
    "contactoCargo" TEXT,
    "contactoTelefono" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hospitales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergencias" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "fechaReporte" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportadoPor" TEXT NOT NULL,
    "parentescoReportante" TEXT,
    "telefonoReportante" TEXT NOT NULL,
    "ubicacionIncidente" TEXT NOT NULL,
    "latitudIncidente" DOUBLE PRECISION,
    "longitudIncidente" DOUBLE PRECISION,
    "causaQuemadura" "CausaQuemadura" NOT NULL,
    "gradoQuemadura" "GradoQuemadura" NOT NULL,
    "superficieCorporal" DOUBLE PRECISION NOT NULL,
    "zonasAfectadas" TEXT[],
    "tiempoTranscurrido" TEXT,
    "primerAuxilio" TEXT,
    "nivelGravedad" "NivelGravedad" NOT NULL,
    "prioridad" "Prioridad" NOT NULL,
    "estado" "EstadoEmergencia" NOT NULL DEFAULT 'REPORTADA',
    "hospitalId" TEXT,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canalizaciones" (
    "id" TEXT NOT NULL,
    "emergenciaId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "distanciaKm" DOUBLE PRECISION,
    "tiempoEstimado" TEXT,
    "hospitalNotificado" BOOLEAN NOT NULL DEFAULT false,
    "fechaNotificacion" TIMESTAMP(3),
    "hospitalAcepto" BOOLEAN,
    "fechaAceptacion" TIMESTAMP(3),
    "estado" "EstadoCanalizacion" NOT NULL DEFAULT 'PENDIENTE',
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "canalizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expedientes" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "diagnostico" TEXT,
    "pronostico" TEXT,
    "tratamientoActual" TEXT,
    "medicamentos" TEXT,
    "estadoPaciente" "EstadoPaciente" NOT NULL DEFAULT 'ACTIVO',
    "fechaAlta" TIMESTAMP(3),
    "motivoAlta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expedientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cirugias" (
    "id" TEXT NOT NULL,
    "expedienteId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hospitalDonde" TEXT NOT NULL,
    "cirujano" TEXT,
    "resultado" TEXT,
    "complicaciones" TEXT,
    "costoEstimado" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cirugias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "expedienteId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoDocumento" NOT NULL,
    "url" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguimientos" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoSeguimiento" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "evolucion" TEXT,
    "proximaCita" TIMESTAMP(3),
    "responsable" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seguimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones_psicologia" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "psicologo" TEXT NOT NULL,
    "tipo" "TipoSesion" NOT NULL,
    "objetivo" TEXT,
    "observaciones" TEXT,
    "estadoEmocional" TEXT,
    "avance" TEXT,
    "proximaSesion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sesiones_psicologia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "costos" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "categoria" "CategoriaCosto" NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'MXN',
    "fecha" TIMESTAMP(3) NOT NULL,
    "cubiertoPor" TEXT,
    "estatusPago" "EstatusPago" NOT NULL DEFAULT 'PENDIENTE',
    "comprobante" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "costos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_curp_key" ON "pacientes"("curp");

-- CreateIndex
CREATE UNIQUE INDEX "canalizaciones_emergenciaId_key" ON "canalizaciones"("emergenciaId");

-- CreateIndex
CREATE UNIQUE INDEX "expedientes_pacienteId_key" ON "expedientes"("pacienteId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "emergencias" ADD CONSTRAINT "emergencias_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergencias" ADD CONSTRAINT "emergencias_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canalizaciones" ADD CONSTRAINT "canalizaciones_emergenciaId_fkey" FOREIGN KEY ("emergenciaId") REFERENCES "emergencias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canalizaciones" ADD CONSTRAINT "canalizaciones_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expedientes" ADD CONSTRAINT "expedientes_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cirugias" ADD CONSTRAINT "cirugias_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "expedientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "expedientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_psicologia" ADD CONSTRAINT "sesiones_psicologia_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "costos" ADD CONSTRAINT "costos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
