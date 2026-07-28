# WomenCiso y MenCiso Foundation — Sistema de Atencion Integral a Quemados

<p align="center">
  <img src="public/logo-womenciso-menciso.png" alt="Logo WomenCiso y MenCiso Foundation" width="280" />
</p>

Sistema web para la atencion de personas con quemaduras en Mexico — ninos, ninas, adolescentes, adultos y adultos mayores. Cubre el ciclo completo: **triage rapido** de la emergencia, **canalizacion** a la red hospitalaria correcta segun gravedad, y **acompanamiento integral** hasta la reinsercion a la vida productiva (expedientes, psicologia, financiamiento de cirugias y traslados, rehabilitacion laboral y defensa legal).

**URL desplegada:** https://main.d1sjnmmlrw08mc.amplifyapp.com
**Repositorio:** https://github.com/wnivia-v/WomenCiso-MenCiso-Foundation

---

## Problema que resuelve

En Mexico, las quemaduras son la segunda causa de muerte accidental en ninos menores de 5 anos, y afectan a personas de toda edad: accidentes domesticos, laborales y electricos alcanzan por igual a adultos y adultos mayores. Cuando ocurre una emergencia:

- Las familias no saben a que hospital acudir segun la gravedad
- Los coordinadores no tienen herramientas digitales para clasificar y canalizar rapidamente
- No existe un sistema unificado que conecte triage, hospitales, seguimiento psicologico y rehabilitacion laboral

Esta plataforma digitaliza todo ese flujo en una sola aplicacion, disenada para funcionar bajo estres y en dispositivos moviles.

---

## Servicios de AWS utilizados (8)

| Servicio | Funcion | Donde se usa |
|----------|---------|--------------|
| **AWS Amplify** | Hosting SSR con deploy automatico desde GitHub, HTTPS gratuito | Toda la app |
| **Amazon RDS PostgreSQL** | Base de datos relacional en la nube con migraciones Prisma y datos reales | Dashboard, Emergencias, Hospitales, Pacientes |
| **Amazon Textract** | OCR universal — lee documentos de cualquier pais (CURP, pasaportes MRZ, cedulas, licencias, DNI) | `/api/ocr` |
| **Amazon Rekognition** | Deteccion facial en documentos, estimacion de edad, identificacion visual de pacientes NN | `/api/ocr` |
| **Amazon Polly** | Voz neural humana (Lupe es-MX, Ruth en-US) para lectura accesible de pantallas | `/api/voz` |
| **Amazon S3** | Fotos de la quemadura enviadas al hospital antes de que llegue el paciente | `/api/fotos` |
| **Amazon SNS** | SMS al familiar con hospital, direccion y nivel de gravedad al canalizar | `/api/notificar` |
| **Amazon Translate** | Traduccion de expedientes a 13 idiomas con deteccion automatica de origen | `/api/traducir` |

---

## Uso de Kiro

Desarrollado integramente con **Kiro** como entorno de desarrollo con IA.

### Agentes personalizados (`.kiro/agents/`)

| Agente | Funcion |
|--------|---------|
| `descubrimiento` | Cuestiona features antes de construirlas |
| `arquitecto` | Planea logica compleja antes de implementar |
| `disenador` | Audita legibilidad y contraste |
| `revisor-codigo` | Caza bugs que pasan el build |
| `depurador` | Debugging sistematico por causa raiz |
| `seguridad` | Auditoria OWASP/STRIDE para datos medicos sensibles |
| `lanzador` | Checklist de verificacion antes de entregar |
| `memoria` | Registro de decisiones en steering |
| `womenciso-menciso` | Contexto general del proyecto |
| `credenciales-demo` | Referencia de credenciales de prueba |

### Skills instalados (`.agents/skills/`)

9 skills de Prisma (CLI, Client API, Compute, Database Setup, Driver Adapter, MongoDB Upgrade, Postgres, Postgres Setup, Upgrade v7) que proporcionan documentacion tecnica actualizada al agente.

### Steering (`.kiro/steering/`)

Archivo de contexto persistente con stack, convenciones, estructura y reglas de negocio del proyecto.

---

## Funcionalidades principales

| Modulo | Descripcion |
|--------|-------------|
| **Triage Rapido** | 5 pasos con clasificacion automatica de gravedad segun criterios de la American Burn Association, aplicable a cualquier edad |
| **Emergencia Extrema** | Formulario ultra-rapido de una sola pantalla |
| **Fotos al hospital (S3)** | Las imagenes de la quemadura llegan al hospital antes que el paciente |
| **Aviso por SMS (SNS)** | El familiar recibe hospital, direccion y gravedad en cualquier celular |
| **OCR con Textract** | Foto del documento → nombre, edad, genero automaticamente |
| **Deteccion facial** | Rekognition detecta rostro, estima edad, guarda referencia visual |
| **Sistema NN** | ID temporal para pacientes sin identificacion |
| **Red Hospitalaria** | Mapa interactivo + camas disponibles desde RDS |
| **Como Llegar** | Ruta al hospital recomendado en Google Maps o Waze |
| **Exportar PDF** | Documento profesional del triage con gravedad, GPS y descargo legal |
| **Traduccion (Translate)** | Expedientes a 13 idiomas para pacientes extranjeros o seguros internacionales |
| **Sistema de Roles** | 4 perfiles (Admin, Coordinador, Familiar, Hospital) |
| **Rehabilitacion Laboral** | 12 cursos, 11 organizaciones aliadas, bolsa de trabajo presencial y remota |
| **Defensa Legal** | Asesoria juridica con universidades voluntarias |
| **Psicologia** | Sesiones de apoyo y seguimiento emocional |
| **Costos** | Desglose de cirugias, traslados, hospedaje y medicamentos por paciente, con registro de quien cubre cada gasto |
| **Chat de Emergencia** | Comunicacion en tiempo real |
| **Mi Expediente** | Vista del paciente/familiar con QR |
| **Prevencion** | Material educativo |
| **Donaciones** | Canales de apoyo |
| **Testimonios** | Historias de recuperacion |
| **Modo Oscuro/Claro** | Toggle con persistencia |
| **Idioma ES/EN** | Selector con dropdown y banderas |
| **Lector de Voz (Polly)** | Voz neural que describe cada pantalla, con fallback a la voz del navegador |
| **Consentimiento de Cookies** | Granular, con inventario completo |
| **Paginas Legales** | Privacidad, Cookies, Terminos de Uso |

---

## Stack tecnologico

| Tecnologia | Version | Uso |
|-----------|---------|-----|
| **Next.js** | 16.2.11 | Framework (App Router, Turbopack, SSR) |
| **TypeScript** | 5.x | Tipado estatico |
| **React** | 19.2.4 | UI |
| **Tailwind CSS** | 4.x | Estilos utilitarios |
| **Prisma** | 7.9.0 | ORM con driver adapter `@prisma/adapter-pg` |
| **Leaflet + React-Leaflet** | 1.9/5.0 | Mapa interactivo |
| **AWS SDK v3** | 3.1095 | Textract, Rekognition, Polly, S3, SNS, Translate |
| **Lucide React** | 1.26 | Iconografia |
| **date-fns** | 4.4 | Fechas |

---

## Seguridad

### Headers HTTP
- Content-Security-Policy (con frame-ancestors, upgrade-insecure-requests)
- Strict-Transport-Security (HSTS 1 ano)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (bloquea microphone, usb, payment)
- X-Powered-By: oculto

### Protecciones en las API Routes
- Rate limiting por IP en todas las rutas: OCR 10/min, voz 20/min, fotos y traduccion 15/min, SMS 5/min
- Validacion de contenido real (magic bytes JPEG/PNG/TIFF), no por extension declarada
- Validacion de tamano pre-parseo (rechaza antes de leer el body)
- Timeout de AWS en cada cliente (10–15s request)
- Mensajes de error redactados (nunca se filtra ARN, endpoint ni credenciales)
- Cache desactivada (no-store) para datos personales
- Degradacion controlada: si un servicio de AWS no responde, la ruta devuelve un modo alterno en lugar de romper el flujo de emergencia

### Base de datos
- Credenciales en variables de entorno, nunca en codigo
- Pool limitado a 5 conexiones por instancia
- Conexion SSL cifrada
- Errores de PostgreSQL redactados antes de llegar al navegador

### Auditoria
- Documentada en `docs/AUDITORIA-SEGURIDAD.md`
- Pruebas automatizadas de penetracion verificadas
- Sin XSS, sin injection, sin datos expuestos en historial git

---

## Como ejecutar el proyecto

### Prerrequisitos
- Node.js 18+
- npm

### Instalacion y desarrollo

```bash
git clone https://github.com/wnivia-v/WomenCiso-MenCiso-Foundation.git
cd WomenCiso-MenCiso-Foundation
npm install
npm run dev
```

### Build de produccion

```bash
npm run build
npm run start
```

### Base de datos (opcional — funciona sin ella)

```bash
# Configurar variable de entorno
# DATABASE_URL="postgresql://usuario:contrasena@host:5432/nombre_db?sslmode=require&uselibpqcompat=true"

npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

### Credenciales de demo

| Rol | Usuario | Contrasena |
|-----|---------|------------|
| Administrador | admin | admin |
| Coordinador | coord | coord |
| Familiar | familia | familia |
| Hospital | hospital | hospital |

---

## Estructura del proyecto

```
/
├── src/
│   ├── app/
│   │   ├── (dashboard)/     # 17 rutas protegidas con sidebar
│   │   ├── api/             # 6 API Routes (ocr, voz, fotos, notificar, traducir, hospitales-cercanos)
│   │   ├── legal/           # Privacidad, Cookies, Terminos
│   │   └── page.tsx         # Login
│   ├── components/          # 21 componentes reutilizables
│   └── lib/                 # Logica de negocio (auth, datos, prisma, theme, i18n, utils)
├── prisma/
│   ├── schema.prisma        # 11 modelos, 16 enums
│   ├── migrations/          # SQL generado
│   └── seed.ts              # Datos ficticios de demo
├── .kiro/
│   ├── agents/              # 10 agentes personalizados
│   └── steering/            # Contexto del proyecto
├── .agents/skills/          # 9 skills de Prisma (documentacion tecnica)
├── docs/
│   ├── bitacora-proyecto.md # Registro completo de desarrollo
│   ├── ENTREGA-HACKATHON.md # Guia para el jurado
│   └── AUDITORIA-SEGURIDAD.md # Reporte de seguridad
└── public/                  # Assets (logos reales de la fundacion)
```

---

## Rutas de la aplicacion (29 total)

**Estaticas (19):** `/`, `/_not-found`, `/costos`, `/defensa-legal`, `/donaciones`, `/emergencias/extrema`, `/emergencias/nueva`, `/expedientes`, `/legal/cookies`, `/legal/privacidad`, `/legal/terminos`, `/mi-expediente`, `/pacientes/nuevo`, `/prevencion`, `/psicologia`, `/rehabilitacion`, `/robots.txt`, `/seguimiento`, `/testimonios`

**Dinamicas (10)** — SSR con datos de RDS: `/dashboard`, `/emergencias`, `/hospitales`, `/pacientes`
**API Routes:** `/api/ocr`, `/api/voz`, `/api/fotos`, `/api/notificar`, `/api/traducir`, `/api/hospitales-cercanos`

---

## Funcionamiento offline (implementado, desactivado a proposito)

La capacidad offline esta construida y probada: service worker con estrategia Network First
y pre-cache del shell de la aplicacion, pensada para paramedicos en zonas rurales sin senal.

Esta **desactivada en la demo publica** por proteccion de propiedad intelectual: un service
worker activo permite que cualquier visitante conserve una copia funcional del frontend.
El `manifest.json` esta en `display: "browser"`, el evento `beforeinstallprompt` se cancela,
y cualquier service worker previo se desregistra al cargar.

Para reactivarla en un despliegue con acuerdo de licencia solo cambian tres archivos,
documentados en `docs/bitacora-proyecto.md`.

---

## Accesibilidad

- Lector de voz con Amazon Polly (voz neural Lupe es-MX / Ruth en-US) y descripcion automatica por ruta
- Skip link al contenido principal
- Focus visible mejorado para navegacion con teclado
- Soporte para `prefers-reduced-motion`
- Soporte para `prefers-contrast: high`
- Atributos ARIA en todos los elementos interactivos
- Inputs con tamano minimo de 16px (evita zoom en iOS)

---

## Equipo

**Desarrollador:** Wladimir Nivia — Ingeniero Informatico
**Fundacion:** WomenCiso y MenCiso Foundation

---

## Licencia

Todos los derechos reservados. &copy; 2026 Wladimir Nivia.
Proyecto desarrollado para el Hackathon IA Masivo Online AWS por Codigo Facilito (julio 2026).
La ausencia de archivo de licencia implica reserva integra de derechos conforme a la legislacion de derechos de autor aplicable.
