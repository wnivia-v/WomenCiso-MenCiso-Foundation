# Bitácora del proyecto — WomenCiso y MenCiso Foundation

Registro de lo construido y corregido, para usar como guion del video de presentación (5 minutos).

## Qué es el proyecto

Sistema web presentado por **WomenCiso y MenCiso Foundation** para la atención de niños y adolescentes con quemaduras en México. La app resuelve tres necesidades: **triage rápido** de emergencias, **canalización** a la red de hospitales correcta según gravedad, y **seguimiento** de pacientes (expedientes, psicología, costos).

La plataforma está diseñada para reutilizarse por distintas fundaciones. WomenCiso y MenCiso Foundation aporta el respaldo de ciberseguridad y la difusión para su despliegue.

Desarrollo: Wladimir Nivia — Ing. Informático.

Stack: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS.

## Flujo de demo sugerido para el video

1. **Pantalla de acceso** (`/`) — acceso directo sin login, con 4 accesos: Sistema, Triage Rápido, Hospitales, Pacientes. Mencionar por qué: en una emergencia real no hay tiempo de recordar contraseñas.
2. **Triage Rápido** (`/emergencias/nueva`) — el corazón del sistema. 5 pasos: quién reporta → datos del paciente → datos de la quemadura (con selector visual de zonas corporales) → ubicación → resultado con clasificación automática de gravedad (CRÍTICO/GRAVE/MODERADO/LEVE) y hospital recomendado según la regla de la American Burn Association adaptada a pediatría.
3. **Dashboard** (`/dashboard`) — panorama general: emergencias activas, estadísticas.
4. **Hospitales** (`/hospitales`) — red de hospitales con camas disponibles, especialidad, nivel de atención.
5. **Sidebar** — mencionar el diseño de alto contraste (fondo blanco, texto oscuro) diseñado específicamente para legibilidad en situaciones de estrés/emergencia, con el botón de Triage Rápido siempre visible y destacado en rojo.

## Decisiones de diseño y por qué

- **Sin login con credenciales**: la app es de acceso directo. En una emergencia real, pedir usuario/contraseña es una barrera. (Nota para producción real: si se maneja información real de pacientes, esto necesita reconsiderarse — ver sección de seguridad abajo.)
- **Sidebar blanco de alto contraste**: la primera versión tenía fondo azul oscuro, difícil de leer. Se corrigió a fondo blanco con texto navy oscuro porque la app se usa en momentos de estrés.
- **Navegación con `<Link>` de Next.js en vez de `router.push()`**: decisión técnica para que la navegación funcione de forma confiable incluso en condiciones de red variables.
- **Imágenes reales de la fundación**: logo y banner oficiales, no genéricos ni generados por IA.
- **Triage con persistencia local**: el progreso del formulario de triage se guarda en el navegador mientras se completa, para no perder información si la página se recarga a mitad del proceso.

## Problemas encontrados y cómo se resolvieron

Esta sección documenta el proceso real de debugging — útil para mostrar el "cómo" en el video, no solo el resultado.

### 1. Botones que no navegaban a ninguna parte
**Síntoma reportado:** "pongo triage rápido y nada".
**Causa:** los botones usaban `router.push()` de Next.js dentro de componentes que dependen de JavaScript del cliente cargado correctamente.
**Fix inicial:** cambiar a `<Link href="...">`, que funciona como un enlace HTML normal.

### 2. El botón "Anterior" del triage volvía todo al inicio, y el menú (☰) no respondía
**Síntoma reportado:** "al ingresar a triage y contestar la primera parte no puedo volver atrás... vuelve al inicio", "veo 3 líneas arriba, le doy pero no hacen nada".
**Investigación:** ambos síntomas parecían bugs distintos, pero al revisar los logs del túnel de Cloudflare se encontró la causa real: el servidor de desarrollo (`next dev`) expone un WebSocket de Hot Module Replacement (HMR) que, a través del túnel gratuito, fallaba en bucle con error "Unauthorized" — cientos de intentos fallidos por minuto. Cuando ese canal falla repetidamente, Next.js fuerza recargas completas de la página en el navegador. Eso explica ambos síntomas a la vez: una recarga a mitad del triage borra el estado de React (vuelve al paso 1), y una recarga justo al hacer clic en el menú hace que el clic "no haga nada".
**Fix real:** dejar de servir la app en modo desarrollo a través del túnel. Se compila en modo producción (`next build` + `next start`) antes de compartir — en producción no existe ese WebSocket de HMR, así que no hay bucle de fallos ni recargas forzadas.
**Defensa adicional:** se agregó persistencia del formulario de triage en `sessionStorage`, para que aunque hubiera una recarga por cualquier otra razón, el progreso no se pierda.

### 3. Aparecía un logo distinto al real en algunas pantallas
**Síntoma reportado:** "esta el logo anterior que creaste, deshazte de él".
**Causa:** al construir la interfaz inicialmente se había dibujado un SVG genérico (un ángel estilizado) como placeholder en dos lugares: el encabezado móvil (`header.tsx`) y un componente `Logo` sin usar (`components/ui/logo.tsx`). El logo real ya estaba correctamente instalado en la portada, pero estos dos lugares no se habían actualizado.
**Fix:** se eliminó el componente placeholder por completo y se reemplazó el SVG dibujado a mano en el header por la imagen real del logo en todas las pantallas. Tras el rebranding, esa imagen es `/logo-womenciso-menciso-icon.png`.

## Agentes de desarrollo personalizados

Se creó un roster de 9 agentes especializados en `.kiro/agents/`, inspirado en el proyecto [gstack](https://github.com/garrytan/gstack) de Garry Tan, adaptado a las necesidades reales de este proyecto (sin las partes que requieren infraestructura de browser automation, generación de imágenes IA, o pipelines de iOS que no aplican aquí):

- `descubrimiento` — cuestiona pedidos de features antes de construirlas.
- `arquitecto` — planea lógica compleja antes de implementarla.
- `disenador` — audita legibilidad y contraste (crítico por el contexto de emergencias).
- `revisor-codigo` — caza bugs que pasan el build pero fallan en uso real.
- `depurador` — debugging sistemático por causa raíz (el que se usó para encontrar el problema del HMR/túnel).
- `seguridad` — auditoría OWASP/STRIDE, con atención especial por tratarse de datos de menores.
- `lanzador` — checklist de verificación antes de dar una tarea por terminada.
- `memoria` — mantiene el registro de decisiones en `.kiro/steering/`.

## Pendiente / notas para producción real

- El acceso sin credenciales es aceptable para demo. Si el sistema pasa a manejar datos reales de pacientes menores de edad, se necesita autenticación real antes de ese paso — señalado explícitamente por el agente `seguridad`.
- No hay base de datos ni backend todavía — los datos que se ven en las listas (hospitales, pacientes, emergencias) son datos de ejemplo fijos en el código, no persistidos.


---

## Funcionalidades agregadas (sesión 2)

### Sistema de roles con login (FASE 1)

4 tipos de usuario con vistas diferenciadas:

| Rol | Login | Vista |
|-----|-------|-------|
| Administrador | admin / admin | Acceso completo a todos los módulos |
| Coordinador | coord / coord | Triage, Emergencias, Pacientes, Hospitales, Seguimiento, Rehabilitación |
| Familiar/Paciente | familia / familia | Mi Expediente, Seguimiento, Cursos de rehabilitación |
| Hospital | hospital / hospital | Emergencias canalizadas, Pacientes, Camas |

- El sidebar se adapta al rol: solo muestra las opciones que corresponden
- Badge de color indica el tipo de usuario activo
- El Triage Rápido sigue accesible sin login (botón rojo en la pantalla de login) para emergencias reales
- Sesión en sessionStorage — se pierde al cerrar el navegador (comportamiento intencional para demo)

### OCR de documento (FASE 2)

En la página de registrar nuevo paciente (`/pacientes/nuevo`):
- Sección "Llenado rápido con foto de documento" al inicio del formulario
- El usuario toma foto de CURP, acta de nacimiento o credencial
- Se muestra preview de la imagen tomada
- Botón "Extraer datos" procesa la imagen (con animación de carga de ~2 segundos)
- Los datos extraídos se muestran para confirmación (nombre, CURP, fecha, género, estado)
- Botón "Aplicar al formulario" llena automáticamente los campos correspondientes
- En la demo los datos son simulados (3 perfiles aleatorios); en producción se conectaría a GPT-4o Vision, Google Cloud Vision, o similar

### Rehabilitación laboral (FASE 3)

Nuevo módulo `/rehabilitacion` con:
- **Catálogo de 6 cursos** de capacitación (Computación, Panadería, Costura, Barbería, Marketing Digital, Mecánica)
- **Organizaciones aliadas** (DIF, CONALEP, INADEM, CANACO, Google.org, CECATI)
- **Bolsa de trabajo** con ofertas de empresas reales (Grupo Bimbo, La Esperanza, etc.)
- **Estadísticas**: cursos disponibles, organizaciones, ofertas laborales, graduados
- Cada curso muestra: duración, modalidad, cupo, estado (disponible/próximo/en curso)
- Visible para Admin, Coordinador y Familiar — para que el paciente o su familia puedan inscribirse

### Vista "Mi Expediente" (para rol Familiar)

Página dedicada `/mi-expediente` para cuando el paciente o su familia accede:
- Resumen del paciente (diagnóstico, hospital, médico tratante, estado)
- Próxima cita destacada visualmente
- Línea de atención 24/7 de la fundación
- Historial completo de atención (emergencia → cirugía → alta → controles → psicología)

## Flujo sugerido de demo actualizado (para video de 5 minutos)

1. **Login como admin** (0:00-0:30) — mostrar login con credenciales, acceso completo
2. **Dashboard** (0:30-0:45) — panorama general
3. **Triage Rápido** (0:45-2:00) — llenar los 5 pasos, mostrar fotos y GPS, resultado con hospital recomendado, botón "Anterior" para corregir
4. **Registrar paciente con OCR** (2:00-2:45) — tomar foto de documento, extraer datos, aplicar al formulario
5. **Rehabilitación laboral** (2:45-3:15) — mostrar cursos, bolsa de trabajo, organizaciones
6. **Cambiar de rol: Familiar** (3:15-3:45) — cerrar sesión, entrar como familia/familia, ver Mi Expediente, mostrar cómo la vista es completamente distinta
7. **Cambiar de rol: Hospital** (3:45-4:15) — entrar como hospital/hospital, mostrar vista reducida
8. **Triage sin login** (4:15-4:45) — desde el login, botón rojo de emergencia, demostrar que no se necesita cuenta
9. **Cierre** (4:45-5:00) — mencionar agentes de IA, arquitectura, impacto social

## Pendiente / notas para producción real

- El OCR es simulado — para producción real se conectaría a una API de visión artificial
- Las credenciales están en el código fuente — en producción se usaría autenticación real
- No hay base de datos — todo son datos de ejemplo en el código
- Los cursos y la bolsa de trabajo son ficticios pero basados en organizaciones reales que trabajan con quemados en México


---

## Sesion 3 — Sabado 25 de julio (dia 6 del hackathon)

### Bug corregido: Mapa se sobreponia al resto de la interfaz

**Sintoma:** Al abrir la pagina de Hospitales (mapa), navegar a otra seccion (chat, defensa legal, etc.) dejaba el mapa renderizado por encima de todo. Los tiles de Leaflet tapaban el contenido.

**Causa raiz:** Leaflet asigna z-index muy altos (200, 400, 650) a sus paneles internos (.leaflet-tile-pane, .leaflet-marker-pane, etc.). Estos valores escapaban del contenedor del mapa y competian con elementos flotantes como el chat (z-50).

**Fix aplicado:**
1. Se agrego `relative z-0 isolate` al div contenedor del mapa en `mapa-hospitales.tsx`. La propiedad CSS `isolation: isolate` crea un nuevo stacking context que encapsula todos los z-index internos.
2. Se agregaron reglas CSS globales en `globals.css` que sobreescriben los z-index de Leaflet a valores bajos (0-6), contenidos dentro del contexto del mapa.

**Resultado:** El mapa funciona correctamente (marcadores, popups, controles) pero ya no se sobrepone a nada al navegar a otras secciones.

### Preparacion de entrega

- README.md reescrito con documentacion completa del proyecto
- Documento de entrega creado: `docs/ENTREGA-HACKATHON.md`
- .gitignore actualizado para excluir logs de desarrollo
- Build verificado: 22/22 paginas, 0 errores TypeScript, exit code 0


---

## Sesion 4 — Sabado 25 de julio (dia 6 del hackathon, sesion continua)

### Servicios AWS integrados

| Servicio | Funcion | Evidencia |
|----------|---------|-----------|
| **AWS Amplify** | Hosting SSR con deploy automatico desde GitHub | URL publica: `main.d1sjnmmlrw08mc.amplifyapp.com` |
| **Amazon Textract** | OCR universal de documentos (CURP, pasaportes, cedulas, licencias de cualquier pais) | API route `/api/ocr` con `AnalyzeDocument` y fallback a `DetectDocumentText` |
| **Amazon Rekognition** | Deteccion facial en documentos para identificacion de pacientes NN | `DetectFaces` con estimacion de edad y genero |
| **Amazon RDS PostgreSQL** | Base de datos relacional en la nube con datos reales | Instancia `womenciso-db.***.us-east-1.rds.amazonaws.com`, schema migrado, datos seed insertados |

### Funcionalidades agregadas

- **OCR en Triage (Paso 2):** el paramedico toma foto del documento del paciente y los datos se llenan automaticamente sin confirmacion intermedia (cada clic en una emergencia son segundos). Si el documento es de un adulto (>18 anos), no aplica la edad.
- **Sistema NN (No Name):** boton visible para pacientes sin identificacion. Asigna ID temporal tipo `NN-20260725-1430` con fecha y hora. Se coteja despues con documentos o biometria.
- **Modo oscuro y claro:** toggle de tema con persistencia en localStorage. Colores de acento (rojo triage, naranja gravedad) se preservan intactos.
- **Selector de idioma (ES/EN):** dropdown con banderas. Traducciones para navegacion, login, triage, dashboard, gravedad, OCR.
- **Consentimiento de cookies:** banner granular con 3 categorias. Rechazar tiene el mismo peso visual que aceptar. Versionado (re-pregunta si cambia la politica).
- **Paginas legales:** privacidad (LFPDPPP con 9 secciones), cookies (inventario completo de 5 claves), terminos (descargo medico, propiedad intelectual, jurisdiccion mexicana).
- **Base de datos real:** Dashboard, Emergencias, Hospitales y Pacientes leen de Amazon RDS. Indicador verde "Amazon RDS" o ambar "Datos de respaldo" visible en cada pantalla.
- **Banner de hackathon:** barra superior con degradado navy que identifica el concurso, Codigo Facilito, Kiro y AWS.
- **Creditos actualizados:** derechos reservados Wladimir Nivia en toda la app.

### Mejoras de seguridad (segunda auditoria)

| Mejora | Detalle |
|--------|---------|
| Rate limiting en `/api/ocr` | 10 peticiones/minuto por IP. Devuelve 429 con `Retry-After`. |
| Validacion de contenido | Verifica firma de archivo (magic bytes) antes de enviar a Textract. Rechaza con 415 si no es JPEG/PNG/TIFF. |
| Validacion de tamano pre-parseo | Verifica `Content-Length` ANTES de leer el body. Un payload enorme no llega a consumir memoria. |
| Redaccion de errores | Los mensajes de AWS y PostgreSQL nunca llegan al navegador. Solo va un motivo categorizado. Los detalles quedan en CloudWatch. |
| Pool de conexiones configurado | Max 5 por instancia, idle timeout 30s, connection timeout 10s. Evita agotar la instancia db.t4g.micro. |
| Timeout de AWS | 15s request + 5s connection. Evita que peticiones colgadas bloqueen la instancia de computo. |
| CSP actualizada | Agrega `frame-ancestors 'none'` y `upgrade-insecure-requests`. |
| Cache desactivada en API | `Cache-Control: no-store` para que respuestas con datos personales no queden en proxies ni caches de navegador. |
| Credenciales verificadas | `.env` no rastreado por git. La contrasena y el endpoint RDS no aparecen en ningun commit del historial. |

### Bugs corregidos

- Mapa de Leaflet se sobreponia al chat y otras secciones (z-index containment)
- OCR mostraba datos ficticios sin indicarlo (ahora dice explicitamente "Datos de relleno" con aviso ambar)
- Edad calculada incorrectamente cuando el documento era de un adulto (ahora solo aplica si 0-18)
- Boton NN invisible en la pantalla de triage (ahora siempre visible con contraste fuerte)
- Texto de recomendaciones/911 invisible en modo oscuro (clases dark: explicitas)
- Triage Rapido casi invisible en modo oscuro en la pantalla de login (clase CSS propia con superficie solida)
- Banner superior tapaba el sidebar al abrirse en movil (z-index corregido a z-30)

### Estado final del proyecto

- **27 rutas** (22 estaticas + 5 dinamicas incluyendo `/api/ocr`)
- **Build limpio:** 0 errores TypeScript, exit code 0
- **4 servicios de AWS** conectados
- **Base de datos real** con migracion y seed
- **Auditoria de seguridad** con pruebas automatizadas verificadas
- **Documentacion legal** completa (privacidad, cookies, terminos)
- **Accesibilidad:** lector de voz, skip links, focus visible, reduced motion, alto contraste, ARIA labels


---

## Sesion 5 — Domingo 26 de julio (dia 7 del hackathon, ultimo dia)

### Servicios AWS agregados

| Servicio | Funcion | Free Tier |
|----------|---------|-----------|
| **Amazon Polly** | Voz neural humana (Lupe es-MX, Ruth en-US) para lectura accesible | 1M caracteres/mes |
| **Amazon S3** | Almacenamiento de fotos del triage en la nube | 5 GB |
| **Amazon SNS** | SMS al familiar cuando se canaliza al paciente | 100 SMS/mes |
| **Amazon Translate** | Traduccion de expedientes a cualquier idioma | 2M caracteres/mes |

### Total de servicios AWS: 8

1. Amplify (hosting)
2. Textract (OCR documentos)
3. Rekognition (deteccion facial)
4. RDS PostgreSQL (base de datos)
5. Polly (voz neural)
6. S3 (almacenamiento de fotos)
7. SNS (notificaciones SMS)
8. Translate (traduccion multilingue)

### Funcionalidades agregadas

- **Amazon Polly integrado al lector de voz:** reemplaza la voz robotica del navegador por voces neurales de AWS. Lupe (espanol mexicano) y Ruth (ingles). Con fallback automatico a la voz del navegador si Polly no responde.
- **API /api/fotos:** sube las fotos del triage a S3 para que el hospital las vea desde cualquier dispositivo antes de que llegue el paciente.
- **API /api/notificar:** envia SMS al familiar con datos de canalizacion (hospital, direccion, gravedad). Formato E.164, normaliza numeros mexicanos. Tipo "Transactional" para entregas prioritaria en emergencias.
- **API /api/traducir:** traduce texto a 13 idiomas. Detecta idioma origen automaticamente. Caso de uso: expediente traducido para seguros internacionales o pacientes extranjeros.
- **Exportar PDF del triage:** boton "Exportar PDF" en el resultado del triage. Genera documento profesional con gravedad, datos del paciente, hospital, GPS, descargo legal. Funciona sin servidor (window.print con HTML formateado).
- **Boton "Como Llegar":** despues del resultado del triage, seccion con botones para Google Maps y Waze. Abre la app de navegacion con la ruta al hospital recomendado.
- **PWA preparada pero desactivada:** el manifest.json existe con shortcuts a Triage Rapido y Emergencia Extrema. El service worker fue implementado y luego removido por decision de proteccion de propiedad intelectual. El script actual desregistra cualquier SW viejo y bloquea el prompt de instalacion. La funcion queda documentada y lista para activar en produccion cuando se firme un acuerdo de uso.

### Decisiones de proteccion de propiedad intelectual

- **Service worker eliminado:** aunque estaba implementado con estrategia Network First y pre-cache del shell, se removio porque permite que alguien que visite la demo conserve una copia funcional offline del frontend. En una demo publica eso es un riesgo de apropiacion.
- **Prompt de instalacion bloqueado:** el evento `beforeinstallprompt` se cancela explicitamente.
- **Manifest en display: "browser":** impide que el navegador ofrezca instalar la app como standalone.
- **Desregistro de SW viejos:** si alguien visitó la app cuando el SW estaba activo, el script actual lo desregistra al volver a cargar.

### Nota para produccion

La funcionalidad PWA offline es critica para el uso real: un paramedico en una zona rural puede no tener senal. Para activarla:
1. Restaurar `public/sw.js` desde el historial de git (commit 3f5b4a1)
2. Cambiar `display: "browser"` a `display: "standalone"` en manifest.json
3. Reemplazar el script de desregistro por el de registro en layout.tsx
4. Firmar acuerdo de licencia con la organizacion que despliega

Estos tres archivos son los unicos que cambian. El resto de la app ya esta preparada.


---

## Verificacion final — Domingo 26 de julio

### Estado de produccion confirmado

- **URL:** https://main.d1sjnmmlrw08mc.amplifyapp.com — ACTIVA
- **Amazon RDS:** Conectada y mostrando datos reales (badge verde visible)
- **Build:** 26 paginas (22 estaticas + 6 dinamicas incluyendo 4 API routes)
- **Commits:** 31 en total
- **Implementacion exitosa** en Amplify tras resolver:
  1. Error de TypeScript por `prisma/seed.ts` incluido en el build (solucion: excluirlo del tsconfig)
  2. `DATABASE_URL` no disponible en runtime SSR de Amplify (solucion: pasar via `next.config.ts env`)
  3. Caracter `!` en la contrasena causaba problemas de escape (solucion: contrasena alfanumerica)

### Problema resuelto: conexion RDS desde Amplify

El error "Sin configuracion de base de datos" ocurria porque Amplify expone las variables de entorno durante la fase de build pero no las pasa automaticamente al runtime del servidor SSR. La solucion fue declarar `env: { DATABASE_URL: process.env.DATABASE_URL }` en `next.config.ts`, que instruye a Next.js a incorporar el valor en el bundle del servidor durante la compilacion.

### Resumen del proyecto entregado

| Metrica | Valor |
|---------|-------|
| Servicios AWS | 8 (Amplify, Textract, Rekognition, RDS, Polly, S3, SNS, Translate) |
| Rutas de la app | 27 (22 estaticas + 5 dinamicas) |
| API routes | 4 (/api/ocr, /api/voz, /api/fotos, /api/notificar, /api/traducir) |
| Modelos de base de datos | 10 tablas + 15 enums |
| Agentes Kiro | 10 personalizados |
| Skills Prisma | 9 |
| Paginas legales | 3 (privacidad, cookies, terminos) |
| Commits | 31 |
| Auditorias de seguridad | 2 (con pruebas automatizadas) |
| Headers de seguridad | 7 configurados |
| Accesibilidad | Lector de voz, skip links, ARIA, reduced motion, high contrast |
| Idiomas | 2 (espanol/ingles con selector) |
| Temas | 2 (claro/oscuro) |


---

## Ultimas mejoras — Domingo 27 de julio (dia de entrega)

### OCR mejorado para documentos internacionales

- Reconoce etiqueta **"APELLIDOS:"** (plural) de cédulas colombianas y pasaportes, y separa en apellido 1 + apellido 2
- Reconoce **"NOMBRES:"** como campo independiente de apellidos
- Detecta fechas con mes en texto: "12 - ABRIL - 1996", "21 - SEP - 1946"
- Detecta género con formato corto: "SEXO: M" / "SEXO: F"
- Filtra palabras institucionales que Textract captura del encabezado (ESTADOS, UNIDOS, MEXICANOS, DEPARTAMENTO, etc.)
- Usa la CURP para validar el orden de apellido/nombre cuando el texto viene junto
- Post-procesamiento final que separa nombre de apellidos si todo quedó en un solo campo

### Formulario de pacientes actualizado

- **"Apellido Paterno/Materno"** cambiado a **"Apellido 1 / Apellido 2"** (mas universal, funciona para cualquier pais)
- Nuevo campo **"Tipo de documento"** con opciones: CURP, INE/IFE, Cédula, Pasaporte, DNI, NIE, Licencia, Acta de nacimiento, Otro
- Campo **"Número de identificación"** genérico (reemplaza el campo fijo de CURP)
- El OCR auto-detecta el tipo de documento y selecciona la opción correcta

### OCR en Triage con doble opcion de entrada

- Botón **"Tomar foto"** (cámara directa — para paramédicos en campo)
- Botón **"Adjuntar"** (galería / archivos / PDF — para documentos digitales)

### Creditos AWS ganados

| Actividad | Creditos |
|-----------|----------|
| Crear base de datos RDS | $20 |
| Configurar AWS Budgets | $20 |
| Lanzar instancia EC2 | $20 |
| Free Tier | $100 |
| **Total** | **$160 USD** |

### Estado final para la entrega

| Metrica | Valor |
|---------|-------|
| URL en produccion | https://main.d1sjnmmlrw08mc.amplifyapp.com |
| Servicios AWS | 8 |
| Commits totales | 43 |
| Paginas/rutas | 27 (estáticas + dinámicas) |
| API routes | 6 (/api/ocr, /api/voz, /api/fotos, /api/notificar, /api/traducir, /api/hospitales-cercanos) |
| Base de datos | Amazon RDS PostgreSQL conectada (badge verde) |
| Build | 0 errores TypeScript |
| Documentacion | README, bitacora, entrega, auditoria, legales |
| Seguridad | CSP, HSTS, rate limiting, validacion, headers completos |
| Accesibilidad | Voz neural, modo oscuro, idiomas, ARIA, skip links |


---

## Revision final pre-entrega — Lunes 27 de julio

### Auditoria de seguridad pre-push

| Verificacion | Resultado |
|--------------|-----------|
| `.gitignore` excluye `.env*`, `node_modules/`, `.next/`, `/build` | OK |
| No hay claves AWS (AKIA*), tokens, ni API keys en el codigo | OK |
| No hay `NEXT_PUBLIC_` que filtre datos sensibles al cliente | OK |
| `next.config.ts` solo pasa `DATABASE_URL` al runtime del servidor | OK |
| Endpoint de RDS redactado en documentacion (no publicar identificador de instancia) | OK |
| No existe `amplify.yml` en el repo (configuracion en consola de AWS) | OK |
| Schema de Prisma sin `url` hardcodeado (usa variable de entorno) | OK |
| ARNs mencionados solo en comentarios explicativos, no como credenciales reales | OK |
| Archivo `.env` no rastreado en git — confirmado ausente del historial | OK |
| Contrasenas de demo (admin/admin, coord/coord) son intencionales y documentadas | OK |

### Servicios AWS confirmados en produccion (8 total)

| # | Servicio | Funcion | Evidencia en la app |
|---|----------|---------|---------------------|
| 1 | AWS Amplify | Hosting SSR + deploy continuo desde GitHub | URL publica activa con HTTPS |
| 2 | Amazon RDS PostgreSQL | Base de datos relacional | Badge verde "Amazon RDS" en Dashboard, Emergencias, Hospitales, Pacientes |
| 3 | Amazon Textract | OCR de documentos de identidad | Boton de camara en Paso 2 del Triage |
| 4 | Amazon Rekognition | Deteccion facial + estimacion de edad | Foto del titular extraida del documento |
| 5 | Amazon Polly | Voz neural (Lupe es-MX, Ruth en-US) | Lector de voz en toda la app |
| 6 | Amazon S3 | Almacenamiento de fotos del triage | Fotos subidas a la nube para el hospital |
| 7 | Amazon SNS | SMS al familiar del paciente | Notificacion automatica al canalizar |
| 8 | Amazon Translate | Traduccion multilingue de expedientes | 13 idiomas soportados |

### Estado de produccion

- **URL:** https://main.d1sjnmmlrw08mc.amplifyapp.com
- **Commits:** 45
- **Build:** 0 errores TypeScript
- **Base de datos:** Amazon RDS PostgreSQL conectada (instancia db.t4g.micro, us-east-1)
- **Seguridad:** Auditoria completa, credenciales protegidas, headers de seguridad activos
- **Proteccion IP:** Service worker removido, prompt de instalacion bloqueado, display: browser

### Proyecto listo para entrega

El repositorio esta limpio de credenciales y listo para push publico a GitHub.
AWS Amplify hace deploy automatico al recibir el push en la rama `main`.
Los jueces pueden acceder a la URL de produccion y verificar las 8 integraciones de AWS funcionando.
