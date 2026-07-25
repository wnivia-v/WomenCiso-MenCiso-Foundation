# Agentes de WomenCiso y MenCiso Foundation

Este roster de agentes está inspirado en [gstack](https://github.com/garrytan/gstack) de Garry Tan (23 especialistas + power tools para Claude Code), adaptado y reducido a lo que realmente aporta valor a este proyecto: una app Next.js de triage médico, sin infraestructura de browser automation, generación de imágenes, GBrain/Supabase, ni pipeline de iOS.

De ~29 herramientas del original, se seleccionaron y adaptaron 9 agentes. El resto (diseño con IA generativa de imágenes, pruebas en navegador real, control de iPhone por USB, memoria multi-máquina con Supabase, segunda opinión de otro modelo, etc.) requieren infraestructura que este proyecto no usa — se descartaron en vez de simularlos a medias.

## Cómo se usan

En Kiro, cambia de agente desde el selector de agentes en el chat. Cada archivo `.md` en esta carpeta aparece ahí automáticamente al guardarse.

## El roster

| Agente | Basado en (gstack) | Cuándo usarlo |
|---|---|---|
| `womenciso-menciso` | — (agente general) | Por defecto, para tareas normales de código en este proyecto. |
| `descubrimiento` | `/office-hours` | Antes de construir una funcionalidad nueva — cuestiona el pedido para encontrar el problema real. |
| `arquitecto` | `/plan-eng-review` | Antes de implementar lógica con varios pasos o estados (ej. triage, canalización) — traza flujo de datos, estados y casos borde. |
| `disenador` | `/plan-design-review` + `/design-review` | Después de un cambio visual — audita contraste, legibilidad y accesibilidad (crítico: esta app se usa en emergencias reales). |
| `revisor-codigo` | `/review` | Después de implementar, antes de dar por terminado — caza bugs que pasan el build pero fallan en uso real. |
| `depurador` | `/investigate` | Cuando algo no funciona y no se sabe por qué — debugging por causa raíz, nunca por prueba y error. |
| `seguridad` | `/cso` | Antes de manejar datos reales de pacientes, o periódicamente — auditoría OWASP/STRIDE. Este proyecto maneja datos médicos de menores, así que este agente es más estricto de lo normal. |
| `lanzador` | `/ship` | Al terminar una tarea — checklist de build + verificación real antes de reportar "listo". |
| `memoria` | `/learn` | Para consultar o actualizar `.kiro/steering/proyecto-womenciso-menciso.md` — el registro de decisiones y errores ya cometidos. |

## Qué se descartó y por qué

| Del original | Por qué no aplica aquí |
|---|---|
| `/browse`, `/qa`, `/design-review` (visual live), `/canary`, `/benchmark` | Requieren un daemon de Chromium/Playwright controlando un navegador real. No está instalado ni es necesario para el tamaño de este proyecto. |
| `/design-shotgun`, `/design-html`, `/design-consultation` | Generan imágenes con GPT Image API y sistemas de diseño desde cero. Este proyecto ya tiene su identidad visual definida (navy/gold, logo real de la fundación) — no se necesita generar una nueva. |
| `/setup-gbrain`, `/sync-gbrain` | Memoria persistente vía Supabase/PGLite entre máquinas. Reemplazado por el steering file de Kiro (`memoria` + `.kiro/steering/`), que cumple la misma función sin infraestructura externa. |
| `/codex` | Segunda opinión de OpenAI Codex CLI en paralelo. No aplica al flujo de un solo agente en Kiro. |
| `/ios-*` | Todo el pipeline de QA en iPhone real por USB. Este es un proyecto web, no una app iOS. |
| `/pair-agent` | Coordinación entre múltiples agentes de IA distintos compartiendo un navegador. Fuera de alcance. |
| `/careful`, `/freeze`, `/guard` | Guardarraíles que en gstack se implementan como PreToolUse hooks de Claude Code. En Kiro el equivalente son los hooks nativos (`.kiro/hooks/`) — si se necesitan, se crean como hooks, no como agentes. |
| `/retro`, `/document-release`, `/document-generate` | Útiles en equipos con historial largo de commits o documentación extensa. Este proyecto es de un desarrollador y aún no tiene ese volumen — se puede añadir más adelante si crece. |

## Mantenimiento

Cuando se cometa un error que no debería repetirse, o se tome una decisión de diseño/arquitectura importante, usa el agente `memoria` para registrarlo en `.kiro/steering/proyecto-womenciso-menciso.md`. Eso es lo que hace que estos agentes mejoren con el tiempo en vez de repetir los mismos errores en cada sesión.
