# Auditoria de Seguridad — WomenCiso y MenCiso Foundation

**Fecha:** 25 de julio de 2026
**Auditor:** Asistido por agente de seguridad Kiro
**Alcance:** Codigo fuente completo del frontend (Next.js 16, TypeScript, React 19)
**Metodologia:** Revision estatica de codigo + analisis de dependencias + verificacion de headers HTTP

---

## Resumen Ejecutivo

| Categoria | Riesgo | Estado |
|-----------|--------|--------|
| XSS (Cross-Site Scripting) | Bajo | Sin vectores encontrados |
| Inyeccion de codigo | Nulo | No hay eval, innerHTML ni dangerouslySetInnerHTML |
| Exposicion de datos | Bajo | Solo credenciales demo (intencional) |
| Clickjacking | Mitigado | X-Frame-Options: DENY aplicado |
| Headers de seguridad | Completo | CSP, HSTS, X-Content-Type-Options, Permissions-Policy |
| Dependencias vulnerables | Medio | 16 CVEs en dependencias transitivas (no explotables en runtime) |
| Autenticacion | Aceptable para demo | Client-side only, sin backend |
| Subida de archivos | Bajo | Solo procesamiento local, sin servidor receptor |

**Veredicto general:** La aplicacion es segura para su uso como demo. No se encontraron vulnerabilidades explotables en el contexto actual (sin backend, sin datos reales). Se aplicaron medidas preventivas (CSP, HSTS, anti-clickjacking) para cuando se despliegue en produccion.

---

## Hallazgos Detallados

### 1. Autenticacion y Control de Acceso

**Severidad:** Media (para produccion) / Aceptable (para demo)

**Hallazgos:**
- Credenciales hardcodeadas en el bundle del cliente (admin/admin, coord/coord, etc.)
- Sesion almacenada en sessionStorage como JSON plano — manipulable desde DevTools
- Sin proteccion de rutas en servidor — todas las paginas son estaticas y accesibles directamente por URL
- Sin rate limiting en intentos de login

**Mitigacion actual:**
- Las credenciales son de demo, documentadas intencionalmente
- sessionStorage se borra al cerrar la pestana (no persiste)
- No hay datos reales que proteger en esta version

**Recomendacion para produccion:**
- Implementar autenticacion con AWS Cognito o similar
- Agregar middleware.ts de Next.js para proteger rutas en servidor
- Implementar JWT con refresh tokens
- Rate limiting con AWS WAF

---

### 2. XSS (Cross-Site Scripting)

**Severidad:** Baja

**Hallazgos:**
- No se encontro ningun uso de `dangerouslySetInnerHTML`
- No hay `eval()` ni `new Function()`
- No hay asignaciones a `.innerHTML`
- Todo el renderizado usa JSX de React (auto-escapado)
- JSON.parse de sessionStorage esta envuelto en try/catch
- Los divIcon de Leaflet usan HTML statico (sin datos de usuario)
- Los enlaces `tel:` son el unico href dinamico — protocolo seguro manejado por el navegador

**Estado:** Sin vectores de XSS identificados.

---

### 3. Configuracion de Next.js y Headers HTTP

**Severidad:** Baja (tras correccion)

**Headers aplicados (next.config.ts):**

| Header | Valor | Proteccion |
|--------|-------|------------|
| X-Frame-Options | DENY | Anti-clickjacking |
| Strict-Transport-Security | max-age=31536000; includeSubDomains | Fuerza HTTPS |
| Content-Security-Policy | Restrictiva (ver detalle) | Anti-XSS, anti-inyeccion |
| X-Content-Type-Options | nosniff | Anti-MIME sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Control de referrer |
| Permissions-Policy | camera=(self), microphone=(), usb=(), payment=() | Bloquea APIs no usadas |
| X-Robots-Tag | noindex, nofollow | Anti-indexacion |
| poweredByHeader | false | Oculta fingerprint de Next.js |

**CSP detallada:**
- `default-src 'self'` — solo recursos del mismo origen
- `script-src 'self' 'unsafe-inline' 'unsafe-eval'` — necesario para Next.js/React
- `img-src 'self' data: https://*.tile.openstreetmap.org blob:` — tiles del mapa + data URIs de fotos
- `frame-src 'none'` — ningun iframe permitido
- `object-src 'none'` — bloquea Flash/Java/plugins
- `base-uri 'self'` — previene inyeccion de base tag
- `form-action 'self'` — formularios solo envian al mismo origen

---

### 4. Dependencias (npm audit)

**Severidad:** Media (teorica) / Baja (practica)

**16 vulnerabilidades reportadas:**

| Paquete | Severidad | Via | Explotable en runtime? |
|---------|-----------|-----|----------------------|
| brace-expansion | Alta | eslint | No — solo desarrollo |
| find-my-way | Alta | prisma dev server | No — prisma inactivo |
| postcss | Alta | next (build) | No — solo build-time |
| sharp | Alta | next (imagenes) | Posible si se usa Image Optimization |
| valibot | Moderada | prisma | No — prisma inactivo |

**Evaluacion:** Ninguna es explotable en la app desplegada actualmente. Las de eslint y prisma son herramientas de desarrollo que no llegan al bundle de produccion. PostCSS solo corre durante `npm run build`. Sharp es el unico potencialmente relevante si se activa la optimizacion de imagenes de Next.js con archivos maliciosos.

**Recomendacion:** Monitorear actualizaciones de Next.js y Prisma. Cuando Next.js 16.3+ se libere con los parches, actualizar.

---

### 5. Exposicion de Datos

**Severidad:** Baja

**Hallazgos:**
- `.env` con DATABASE_URL — correctamente en .gitignore, NO esta en el repositorio
- No hay claves AWS, tokens ni secretos en el codigo
- No se exponen source maps en produccion
- No hay variables NEXT_PUBLIC_ que filtren datos al cliente
- Las credenciales de demo son intencionales y documentadas

---

### 6. Subida de Archivos

**Severidad:** Baja

**Hallazgos:**
- Las fotos del triage se procesan 100% en el cliente (Canvas API)
- Se comprimen a JPEG 60% calidad, max 900px ancho
- Se almacenan como data URLs en sessionStorage
- No hay endpoint de servidor que reciba archivos
- El atributo `accept="image/*"` es solo validacion de UI (no de seguridad)

**Riesgo residual:** Un archivo de imagen malicioso podria explotar un bug del navegador al renderizarse — riesgo extremadamente bajo con navegadores modernos.

---

### 7. CSRF y Formularios

**Severidad:** Nula (actualmente)

- No hay API routes ni backend — no hay acciones servidor que proteger
- Todos los formularios operan en estado local de React
- `form-action 'self'` en CSP previene envio a dominios externos

---

## Acciones Realizadas en esta Auditoria

1. Agregado `X-Frame-Options: DENY` (anti-clickjacking)
2. Agregado `Strict-Transport-Security` (fuerza HTTPS)
3. Agregado `Content-Security-Policy` completa
4. Agregado `Permissions-Policy` (bloquea APIs innecesarias)
5. Desactivado header `X-Powered-By` (oculta tecnologia)
6. Mejorado `Referrer-Policy` de `no-referrer` a `strict-origin-when-cross-origin`

---

## Recomendaciones para Produccion (Roadmap de Seguridad)

### Prioridad Alta (antes de manejar datos reales de pacientes)
1. **Autenticacion real** — AWS Cognito con MFA para roles admin/coordinador
2. **Proteccion de rutas en servidor** — middleware.ts que valide tokens antes de servir paginas
3. **Base de datos cifrada** — RDS con encryption at rest + SSL en transito
4. **Cifrado de expedientes** — datos de pacientes cifrados a nivel de campo (AES-256)
5. **Logs de auditoria** — CloudTrail para todo acceso a datos sensibles

### Prioridad Media (hardening)
6. **WAF (Web Application Firewall)** — AWS WAF con reglas para SQL injection, XSS, rate limiting
7. **Validacion server-side** — toda entrada debe validarse en el backend (Zod + API routes)
8. **Subida segura de archivos** — S3 con Content-Type validation, virus scan (ClamAV), tamano maximo
9. **CORS restrictivo** — solo dominios propios
10. **Monitoreo** — CloudWatch alarms para patrones de ataque

### Prioridad Baja (mejora continua)
11. Penetration testing externo antes de lanzamiento
12. Programa de reporte de vulnerabilidades (responsible disclosure)
13. Revision trimestral de dependencias
14. Backup automatico de la base de datos con RDS snapshots

---

## Cumplimiento Normativo (Mexico)

Si el sistema maneja datos reales de pacientes menores de edad:
- **Ley General de Proteccion de Datos Personales** (LGPDPPSO) — requiere consentimiento informado, medidas de seguridad, y aviso de privacidad
- **NOM-004-SSA3-2012** — norma del expediente clinico electronico
- **Ley General de los Derechos de Ninas, Ninos y Adolescentes** — proteccion especial de datos de menores

---

## Conclusion

La aplicacion esta **segura para su uso como demo** en el hackathon. No se encontraron vulnerabilidades explotables. Se aplicaron headers de seguridad preventivos que la protegen contra clickjacking, inyeccion de contenido y ataques MIME.

Para una transicion a produccion con datos reales, el roadmap de seguridad describe los pasos necesarios en orden de prioridad.

---

*Reporte generado como parte del Hackathon IA Masivo Online AWS — Codigo Facilito, julio 2026.*
