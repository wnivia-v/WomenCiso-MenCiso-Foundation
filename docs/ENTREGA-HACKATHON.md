# Entrega — Hackathon Kiro AI, Powered by AWS (Codigo Facilito)

## Informacion del equipo

- **Nombre del proyecto:** Sistema Integral de Atencion a Quemados
- **Fundacion:** WomenCiso y MenCiso Foundation
- **Desarrollador:** Wladimir Nivia — Ingeniero Informatico
- **Periodo de desarrollo:** 24 al 26 de julio de 2026 (viernes a domingo) — 3 dias
- **Entrega:** 27 de julio de 2026

---

## Resumen ejecutivo

Plataforma web que acompana a una persona quemada desde el minuto del accidente hasta su
reincorporacion a la vida productiva. **No esta limitada a un grupo de edad:** atiende a ninos,
ninas, adolescentes, adultos y adultos mayores, porque los accidentes domesticos, laborales
y electricos alcanzan a todos.

El ciclo completo que cubre el sistema:

1. **Accidente** — triage guiado de 5 pasos con clasificacion automatica de gravedad en menos de 5 minutos
2. **Canalizacion** — hospital correcto segun gravedad, distancia GPS y camas disponibles; fotos y SMS enviados antes de que llegue el paciente
3. **Tratamiento y posoperatorio** — expediente medico, cirugias, curaciones, seguimiento de evolucion
4. **Financiamiento** — desglose de cirugias, traslados, hospedaje y medicamentos, con registro de quien cubre cada gasto, ligado al modulo de donaciones
5. **Recuperacion integral** — terapia psicologica, rehabilitacion fisica y acompanamiento legal gratuito
6. **Reinsercion laboral** — 12 cursos con 11 organizaciones aliadas y bolsa de trabajo presencial y remota

---

## Tecnologias utilizadas

### Stack principal
- Next.js 16.2.11 (App Router, Turbopack, SSR)
- TypeScript 5
- React 19.2.4
- Tailwind CSS 4
- Prisma 7.9.0 (ORM con driver adapter `@prisma/adapter-pg`)
- Leaflet + React-Leaflet (mapas)
- AWS SDK v3

### Uso de Kiro
- **10 agentes personalizados** en `.kiro/agents/` (arquitecto, seguridad, revisor-codigo, depurador, disenador, descubrimiento, memoria, lanzador, womenciso-menciso, credenciales-demo)
- **Steering persistente** en `.kiro/steering/` con stack, convenciones y errores ya cometidos para no repetirlos
- **9 skills de Prisma** en `.agents/skills/` con documentacion tecnica actualizada
- Desarrollo iterativo con ciclos de feedback documentados dia por dia en `docs/bitacora-proyecto.md`

---

## Servicios de AWS utilizados (8)

| # | Servicio | Funcion | Donde verificarlo en la app |
|---|----------|---------|------------------------------|
| 1 | **AWS Amplify** | Hosting SSR con deploy continuo desde GitHub, HTTPS | URL publica activa |
| 2 | **Amazon RDS PostgreSQL** | Base de datos relacional real con migraciones y datos | Badge verde "Amazon RDS" en Dashboard, Emergencias, Hospitales, Pacientes |
| 3 | **Amazon Textract** | OCR universal de documentos de cualquier pais (CURP, pasaportes MRZ, cedulas, licencias, DNI) | Boton de camara en Paso 2 del Triage y en Nuevo Paciente |
| 4 | **Amazon Rekognition** | Deteccion facial y estimacion de edad para pacientes sin identificacion | Foto del titular extraida del documento |
| 5 | **Amazon Polly** | Voz neural humana (Lupe es-MX, Ruth en-US) para lectura accesible | Boton de voz en cualquier pantalla |
| 6 | **Amazon S3** | Fotos de la quemadura enviadas al hospital antes de que llegue el paciente | Paso 3 del Triage |
| 7 | **Amazon SNS** | SMS al familiar con hospital, direccion y gravedad al canalizar | Resultado del Triage |
| 8 | **Amazon Translate** | Traduccion de expedientes a 13 idiomas con deteccion automatica | Boton de traduccion en expedientes |

Cada integracion resuelve una necesidad concreta del flujo de emergencia, justificada en
comentarios dentro del codigo de cada API route.

---

## URL de la aplicacion desplegada

**https://main.d1sjnmmlrw08mc.amplifyapp.com**

Desplegada en AWS Amplify con deploy automatico desde GitHub. HTTPS incluido.

**Repositorio:** https://github.com/wnivia-v/WomenCiso-MenCiso-Foundation

---

## Como ejecutar la demo en local

```bash
# 1. Instalar dependencias
npm install

# 2. Build de produccion
npm run build

# 3. Iniciar servidor
npm run start

# 4. Abrir en navegador
# http://localhost:3000
```

La app arranca y funciona sin base de datos conectada: cada consulta detecta la ausencia de
`DATABASE_URL` y cae a datos de respaldo mostrando un indicador ambar en pantalla.

### Credenciales de acceso

| Rol | Usuario | Contrasena | Vista |
|-----|---------|------------|-------|
| Administrador | admin | admin | Todo el sistema |
| Coordinador | coord | coord | Triage, emergencias, pacientes |
| Familiar | familia | familia | Mi expediente, seguimiento |
| Hospital | hospital | hospital | Emergencias canalizadas |

El **Triage Rapido es accesible sin credenciales** por diseno: en una emergencia real una
pantalla de login cuesta segundos criticos.

---

## Recorrido sugerido para evaluacion (5 minutos)

### 0:00–0:30 — Acceso
- Pantalla de acceso directo, sin campos de correo ni contrasena
- Ingresar como **admin**
- Mencionar: 4 roles con vistas distintas, y el boton rojo de Triage accesible sin cuenta

### 0:30–1:00 — Dashboard
- Estadisticas y emergencias recientes leidas de **Amazon RDS** (badge verde verificable)
- KPIs del sistema

### 1:00–2:30 — Triage Rapido (corazon del sistema)
- Sidebar → "Triage Rapido"
- Los 5 pasos:
  1. Quien reporta (nombre, telefono, parentesco)
  2. Datos del paciente — **OCR con Amazon Textract**: foto del documento y los campos se llenan solos. Boton NN para pacientes sin identificacion
  3. Datos de la quemadura (causa, grado, % SCQ, zonas afectadas) + **fotos que suben a Amazon S3**
  4. Ubicacion — GPS del dispositivo, con direccion escrita como respaldo si se niega el permiso
  5. Resultado — gravedad calculada con criterios de la American Burn Association y hospital recomendado
- Mostrar que el boton "Anterior" no pierde datos (persistencia en `sessionStorage`)
- Mostrar **"Como Llegar"** (Google Maps / Waze) y **"Exportar PDF"**

### 2:30–3:00 — Accesibilidad con Amazon Polly
- Activar el lector de voz en cualquier pantalla
- Destacar: voz neural Lupe (es-MX), no la voz robotica del navegador
- Mencionar SMS con Amazon SNS al familiar y traduccion con Amazon Translate

### 3:00–3:40 — Ciclo completo: del accidente a la vida productiva
- **Costos**: desglose real por paciente (cirugia de injerto, traslado aereo, hospedaje familiar, presoterapia) con registro de quien cubre cada gasto y que sigue pendiente
- **Donaciones**: como se canaliza la ayuda hacia un caso concreto
- **Rehabilitacion**: 12 cursos con 11 organizaciones aliadas (DIF, CONALEP, CECATI, Google.org, Microsoft, Platzi, UNAM) y bolsa de trabajo. Destacar que muchos cursos son remotos a proposito: alguien con secuelas visibles o movilidad limitada puede generar ingresos desde casa
- **Psicologia** y **Defensa Legal**: acompanamiento emocional y juridico

### 3:40–4:20 — Cambio de rol
- Entrar como **familia** → "Mi Expediente" con QR, proxima cita, historial
- Entrar como **hospital** → solo emergencias canalizadas, pacientes y camas

### 4:20–5:00 — Cierre
- 8 servicios de AWS integrados, cada uno con justificacion clinica
- 10 agentes de Kiro y steering persistente
- 3 dias de desarrollo, un solo desarrollador
- Impacto: digitaliza un flujo que hoy es telefonico y termina en abandono despues del alta

---

## Funcionalidades destacadas para evaluacion

### Uso de AWS (8 servicios)
Ver la tabla completa mas arriba. Ninguno esta puesto para cumplir un requisito:
- **Textract** existe porque en una emergencia nadie teclea una CURP
- **S3** existe porque el hospital necesita ver la quemadura antes de que llegue el paciente
- **SNS** existe porque un SMS llega a un celular basico sin datos ni smartphone
- **Polly** existe porque una persona ciega tambien reporta emergencias
- **Translate** existe porque un turista extranjero quemado necesita su expediente en su idioma
- **Rekognition** existe porque hay pacientes que llegan sin nombre
- **RDS** y **Amplify** sostienen todo lo anterior en produccion real

### Seguridad (nivel produccion)
- Auditoria documentada en `docs/AUDITORIA-SEGURIDAD.md`
- Content-Security-Policy con `frame-ancestors 'none'` y `upgrade-insecure-requests`
- HSTS 1 ano, X-Frame-Options DENY, Permissions-Policy restrictiva, X-Powered-By oculto
- Rate limiting por IP en las 6 API routes (OCR 10/min, voz 20/min, fotos y traduccion 15/min, SMS 5/min)
- Validacion de contenido real por magic bytes, no por extension declarada
- Mensajes de error redactados: nunca se filtra ARN, endpoint ni credenciales al cliente
- Pool de conexiones acotado a 5 por instancia contra agotamiento de la db.t4g.micro
- Timeouts en todas las llamadas a AWS
- Cero credenciales en el repositorio, verificado en el historial completo de git

### Innovacion
- Clasificacion de gravedad con criterios medicos reales de la American Burn Association, usable por alguien que no es medico
- Acceso sin credenciales para emergencias, como decision de diseno razonada
- Fotos que llegan al hospital antes que el paciente
- Voz neural que hace la app usable sin ver la pantalla
- Cursos remotos como estrategia de reinsercion para personas con secuelas visibles
- Degradacion controlada: si un servicio de AWS falla, la ruta responde en modo alterno en lugar de romper el flujo de emergencia

### Impacto social
- Las quemaduras son la 2da causa de muerte accidental en menores de 5 anos en Mexico, y afectan tambien a adultos en accidentes domesticos, laborales y electricos
- Digitaliza un flujo que hoy es telefonico y desorganizado
- Conecta fundaciones, hospitales, familias, psicologos, abogados y empleadores en una sola plataforma
- Atiende el tramo que nadie cubre: lo que pasa despues del alta medica

### Calidad tecnica
- Build limpio: 0 errores de TypeScript, exit code 0
- 29 rutas (19 estaticas + 10 dinamicas, incluidas 6 API routes)
- 11 modelos y 16 enums en el schema de Prisma, con migraciones aplicadas en RDS
- 21 componentes reutilizables
- Persistencia de formularios en `sessionStorage` para no perder datos ante una recarga
- Compresion de imagenes antes de subirlas (optimizado para redes moviles)
- Diseno mobile-first con responsive completo
- Accesibilidad: voz neural, ARIA labels, skip links, focus visible, reduced motion, alto contraste, modo oscuro

### Funcionamiento offline
La capacidad offline esta **implementada y probada** (service worker con estrategia Network First
y pre-cache del shell), pensada para paramedicos en zonas rurales sin senal.

Esta **desactivada en la demo publica a proposito**, por proteccion de propiedad intelectual:
un service worker activo permite que cualquier visitante conserve una copia funcional del
frontend. El `manifest.json` esta en `display: "browser"`, el evento `beforeinstallprompt`
se cancela, y cualquier service worker previo se desregistra al cargar.

Para reactivarla en un despliegue con acuerdo de licencia solo cambian tres archivos,
documentados en `docs/bitacora-proyecto.md`.

### Uso de Kiro
- 10 agentes especializados documentados en `.kiro/agents/`
- Steering persistente que evito repetir errores ya cometidos
- Bitacora con cada sesion, decision tecnica y bug resuelto
- Debugging asistido por agentes (el agente `depurador` encontro la causa raiz del problema de HMR por tunel que rompia la interactividad de forma intermitente)

---

## Estructura de archivos relevante

```
/
├── README.md                        # Documentacion principal
├── docs/
│   ├── bitacora-proyecto.md         # Registro de desarrollo y decisiones
│   ├── ENTREGA-HACKATHON.md         # Este documento
│   └── AUDITORIA-SEGURIDAD.md       # Reporte de seguridad
├── src/
│   ├── app/
│   │   ├── (dashboard)/             # 17 rutas con sidebar
│   │   ├── api/                     # 6 API routes (ocr, voz, fotos, notificar, traducir, hospitales-cercanos)
│   │   ├── legal/                   # Privacidad, Cookies, Terminos
│   │   └── page.tsx                 # Acceso directo
│   ├── components/                  # 21 componentes reutilizables
│   └── lib/                         # Logica de negocio (triage, auth, prisma, i18n, theme, rate limit)
├── prisma/
│   ├── schema.prisma                # 11 modelos, 16 enums
│   ├── migrations/                  # SQL aplicado en RDS
│   └── seed.ts                      # Datos de demo
├── .kiro/
│   ├── agents/                      # 10 agentes personalizados
│   └── steering/                    # Contexto persistente
├── .agents/skills/                  # 9 skills de Prisma
└── public/                          # Assets (logos reales de la fundacion)
```

---

## Notas importantes

- **Trabajo original**: desarrollado integramente durante el hackathon, del viernes 24 al domingo 26 de julio de 2026, a partir de un prompt que describia la problematica de la atencion a quemados en Mexico y como resolverla.

- **Datos de pacientes**: todos los nombres, telefonos y expedientes de pacientes son ficticios. El banner "Demo" es permanente y no se puede cerrar, para que ninguna captura de pantalla se confunda con datos reales.

- **Telefonos de hospitales y emergencias**: son numeros publicos **reales**, verificados en fuente oficial (Hospital General de Mexico, Hospital Civil de Guadalajara, linea 911). En una emergencia un numero equivocado causa dano, asi que no se enmascaran. Los que no se pudieron verificar en fuente oficial siguen enmascarados hasta confirmarlos.

- **Datos de la fundacion**: cuentas bancarias, CLABE, RFC y linea telefonica de la fundacion estan enmascarados a proposito (terminan en `XXXXX`), porque la marca es nueva y no deben parecer datos reales.

- **Produccion**: la app esta desplegada en AWS Amplify y conectada a Amazon RDS PostgreSQL con schema migrado y datos insertados. El indicador de origen de datos es visible en pantalla y verificable por el jurado.

- **Propiedad intelectual**: 100% propio. Todos los derechos reservados, Wladimir Nivia, 2026.
