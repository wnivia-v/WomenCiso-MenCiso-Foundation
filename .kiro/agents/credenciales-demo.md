---
description: Documento de referencia con los usuarios, contraseñas y roles del sistema. Consultar cuando necesites recordar cómo ingresar con cada tipo de usuario.
model: auto
tools:
  - read
---

# Credenciales de Demo — WomenCiso y MenCiso Foundation

## Usuarios y contraseñas

| Usuario | Contraseña | Rol | Qué ve |
|---------|-----------|-----|--------|
| `admin` | `admin` | Administrador | Todo el sistema completo: Dashboard, Emergencias, Pacientes, Hospitales, Expedientes, Seguimiento, Psicología, Rehabilitación, Costos |
| `coord` | `coord` | Coordinador | Dashboard, Emergencias, Pacientes, Hospitales, Seguimiento, Rehabilitación + botón Triage Rápido |
| `familia` | `familia` | Familiar/Paciente | Mi Expediente (datos del paciente, historial, próxima cita), Seguimiento, Rehabilitación (cursos) |
| `hospital` | `hospital` | Hospital | Emergencias (canalizadas a ellos), Pacientes Canalizados, Camas disponibles |

## Acceso de emergencia (sin login)

El botón rojo **"🚨 Triage Rápido sin login"** en la pantalla de login lleva directamente a `/emergencias/nueva` sin necesidad de autenticarse — diseñado para que cualquiera pueda reportar una emergencia sin perder tiempo buscando credenciales.

## Cómo funciona

- Las credenciales se almacenan en `src/lib/auth.tsx`
- La sesión se guarda en `sessionStorage` (se pierde al cerrar el navegador)
- El sidebar se adapta automáticamente al rol: solo muestra las secciones que ese rol puede ver
- Cada rol tiene un badge de color en el sidebar indicando su tipo
- El botón de cerrar sesión (icono de salida en la esquina inferior del sidebar) regresa al login

## Para el video

Demostrar en este orden para máximo impacto:
1. Ingresar como **admin** → mostrar todo el sistema
2. Cerrar sesión → ingresar como **familia** → mostrar Mi Expediente (vista completamente diferente)
3. Cerrar sesión → ingresar como **hospital** → mostrar que solo ven emergencias y camas
4. Desde el login sin sesión → clic en **Triage Rápido sin login** → demostrar que funciona sin cuenta

## Notas de seguridad

Esto es SOLO para demo/hackathon. En un sistema de producción real:
- Las credenciales no se guardan en el código fuente
- Se usa autenticación real (OAuth, JWT, etc.)
- Los roles se verifican en el servidor, no solo en el cliente
- Se agregan permisos granulares por acción, no solo por pantalla visible
