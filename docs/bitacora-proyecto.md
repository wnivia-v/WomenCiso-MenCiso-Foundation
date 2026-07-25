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
