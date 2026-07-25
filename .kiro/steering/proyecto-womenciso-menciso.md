# Proyecto WomenCiso y MenCiso Foundation — Reglas y Contexto

## Idioma
- SIEMPRE responder en español.

## Marca
- El nombre de la plataforma es **WomenCiso y MenCiso Foundation**.
- Toda referencia a la marca anterior ("Fundación Uriel") quedó revocada. No reintroducirla.
- La fundación es la organización de ciberseguridad que presenta y protege el sistema.
  El dominio funcional de la app sigue siendo la atención a pacientes con quemaduras.
- Créditos de desarrollo: Wladimir Nivia — Ing. Informático.

## Imágenes
- Logo solo ícono (para header, sidebar y usos pequeños): `public/logo-womenciso-menciso-icon.png` — 512x512, fondo transparente.
- Logo lockup completo con el texto de la marca: `public/logo-womenciso-menciso.png` — 960x800, fondo transparente.
- El banner correcto es: `public/bg-banner.jpg` — copiado desde la carpeta `img de prueba/`.
- NUNCA crear logos SVG inline o generar imágenes propias. Siempre usar los archivos de `public/`.
- Si el logo o banner se pierden, regenerarlos desde `img de prueba/LOGO-WOMENCISO-MENCISO.jpeg`.
- Para usar el logo: `<Image src="/logo-womenciso-menciso-icon.png" alt="WomenCiso y MenCiso Foundation" ... />`
- Para usar el banner: `<Image src="/bg-banner.jpg" alt="" ... />`
- El archivo fuente original es un JPEG con fondo crema y marco oscuro en los bordes.
  Las versiones de `public/` ya tienen ese fondo recortado a transparencia — usar esas, no el JPEG.

## Datos sensibles de demostración
Distinguir dos categorías. La regla NO es la misma para ambas.

**Datos de la fundación — SIEMPRE enmascarados.** Son inventados porque la marca es nueva:
- Cuentas bancarias y CLABE de `donaciones/`: terminan en `XXXXX` a propósito.
- RFC de la fundación: `WMF-XXXXXXXXXX`.
- Línea telefónica de la fundación (`boton-sos.tsx`, contacto de donaciones): `800 000 XXXX`, `55 0000 XXXXX`.
- No sustituirlos por datos que parezcan reales.

**Datos de hospitales y urgencias — REALES.** Son información pública de utilidad,
y en una emergencia un número equivocado causa daño:
- Teléfonos de hospitales en `hospitales/page.tsx` y `mapa-hospitales.tsx`: números
  públicos reales de cada institución.
- Líneas de emergencia nacionales (911, etc.): reales.
- NUNCA enmascarar estos números. Si no se conoce el número real de una institución,
  verificarlo en la fuente oficial antes de escribirlo. No inventar ni aproximar.
- Verificados en fuente oficial: Hospital General de México `55 2789-2000`
  (hgm.salud.gob.mx), Hospital Civil de Guadalajara `33 3942-4400` (portal.hcg.gob.mx).
- Pendientes de verificar (siguen enmascarados hasta confirmarlos): CENIAQ/INR,
  H. Traumatología IMSS Victorio de la Fuente Narváez, H. Pediátrico Tacubaya.

## Login (src/app/page.tsx)
- NO debe tener campos de correo/contraseña.
- Es acceso directo con botones/links grandes.
- Usar `<Link href="...">` de Next.js, NO `router.push()` (el túnel cloudflare no carga bien el JS del cliente).
- El componente de login NO debe ser "use client" — debe ser un Server Component con `<Link>`.

## Sidebar (src/components/layout/sidebar.tsx)
- Fondo BLANCO (`bg-white`), NO azul oscuro.
- Texto oscuro de alto contraste para legibilidad en emergencias.
- Debe tener un botón rojo prominente de "Triage Rápido" visible arriba del menú.
- Links activos: fondo navy oscuro con texto blanco.
- Links inactivos: texto navy oscuro sobre fondo blanco.

## Triage Rápido
- Ruta: `/emergencias/nueva`
- Es un formulario de 5 pasos: Reportante → Paciente → Quemadura → Ubicación → Resultado.
- Usa la función `calcularGravedad()` de `src/lib/utils.ts`.
- Niveles: CRITICO, GRAVE, MODERADO, LEVE.
- **Fotos de la quemadura (paso 3, opcional)**: hasta `MAX_FOTOS` (6) imágenes, capturadas con la cámara del dispositivo (`capture="environment"`) o desde galería. Se comprimen a máx. 900px de ancho / calidad 0.6 JPEG antes de guardarse como data URL en el estado del formulario — así no saturan `sessionStorage` ni la red al compartirlas. Se muestran en el resultado final (paso 5) para que el hospital vea qué esperar antes de que llegue el paciente.
- **Ubicación GPS exacta (paso 4, opcional)**: usa `navigator.geolocation.getCurrentPosition()`. Si el usuario no da permiso o el dispositivo no soporta geolocalización, se degrada sin bloquear — la dirección escrita sigue siendo obligatoria como respaldo. Nunca hacer que el GPS sea un requisito para avanzar.
- Todo el formulario (incluidas fotos y GPS) se persiste en `sessionStorage` bajo la clave `triage-rapido-borrador` para no perder el progreso ante una recarga.

## Arquitectura
- Framework: Next.js 16 con App Router y Turbopack.
- Estilos: Tailwind CSS con colores custom (navy-*, gold-*).
- Componentes UI: `src/components/ui/` (button, input, select, textarea, card, badge). NO existe `logo.tsx` — se eliminó porque contenía un SVG inline falso. El logo siempre es la imagen real vía `<Image src="/logo-womenciso-menciso-icon.png">`.
- Layout dashboard: `src/app/(dashboard)/layout.tsx` con Sidebar + Header.
- Header móvil: `src/components/layout/header.tsx` — usa `<Image>` con el logo real, NUNCA SVG inline.
- Las páginas dentro de `(dashboard)/` se renderizan con el sidebar y header.

## Desarrollo — IMPORTANTE, causa raíz de bugs de interactividad
- **NUNCA compartir el servidor de desarrollo (`next dev`) a través del túnel cloudflare.** El WebSocket de Hot Module Replacement (HMR) falla en bucle con error "Unauthorized" a través del túnel gratuito de trycloudflare.com. Cuando ese WebSocket falla repetidamente, Next.js fuerza recargas completas de la página en el cliente — esto se manifestaba como: botones que "no hacían nada" (la página se recargaba bajo el usuario) y el triage rápido "volvía al inicio" al usar el botón Anterior (el componente se remontaba y perdía el estado de React).
- **Solución correcta**: compilar y servir en modo PRODUCCIÓN antes de compartir por túnel:
  ```
  npx next build
  npx next start -p 3000
  npx cloudflared tunnel --url http://localhost:3000
  ```
  En producción no hay WebSocket de HMR, así que no hay bucle de fallos ni recargas forzadas.
- Si se necesita editar código mientras se comparte el túnel: parar `next start`, hacer los cambios, correr `next build` de nuevo, y volver a arrancar `next start`. No usar `next dev` con el túnel activo.
- El túnel cambia de URL cada vez que se reinicia `cloudflared` (plan gratuito, sin dominio fijo).

## Errores Comunes (NO repetir)
1. NO crear logos SVG inline — usar el archivo de public/. (Se eliminó `src/components/ui/logo.tsx` por esto — no volver a crear un componente Logo con SVG dibujado a mano.)
2. NO usar `"use client"` + `router.push()` para navegación simple — usar `<Link>`.
3. NO usar fondo oscuro en el sidebar — debe ser blanco y legible.
4. NO poner campos de login — es acceso directo sin credenciales.
5. NO compartir `next dev` a través del túnel cloudflare — causa recargas forzadas por fallos de WebSocket HMR, lo que rompe cualquier botón o formulario multi-paso de forma intermitente y confusa. Siempre usar `next build` + `next start` para compartir por túnel.
6. El triage rápido (`emergencias/nueva`) guarda su progreso en `sessionStorage` (clave `triage-rapido-borrador`) como defensa extra contra recargas inesperadas — si se reescribe ese archivo, mantener esa persistencia.
