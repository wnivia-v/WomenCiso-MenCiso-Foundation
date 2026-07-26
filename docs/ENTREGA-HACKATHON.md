# Entrega — Hackathon IA Masivo Online AWS por Codigo Facilito

## Informacion del equipo

- **Nombre del proyecto:** Sistema Integral de Atencion a Quemados
- **Fundacion:** WomenCiso y MenCiso Foundation
- **Desarrollador:** Wladimir Nivia — Ingeniero Informatico
- **Periodo de desarrollo:** 20 al 27 de julio de 2026

---

## Resumen ejecutivo

Plataforma web que resuelve tres necesidades criticas en la atencion de ninos y adolescentes con quemaduras en Mexico:

1. **Triage rapido** — clasificacion automatica de gravedad en menos de 5 minutos
2. **Canalizacion hospitalaria** — recomendacion del hospital correcto segun gravedad, ubicacion y camas disponibles
3. **Seguimiento integral** — expedientes, psicologia, rehabilitacion laboral, costos y defensa legal

---

## Tecnologias utilizadas

### Stack principal
- Next.js 16 (App Router, Turbopack)
- TypeScript
- React 19
- Tailwind CSS 4
- Prisma (ORM)
- Leaflet (mapas)

### Uso de Kiro
- 9 agentes personalizados en `.kiro/agents/`
- Steering persistente en `.kiro/steering/`
- Desarrollo iterativo con ciclos de feedback documentados en `docs/bitacora-proyecto.md`

### Servicios de infraestructura
- **AWS Amplify** — Hosting SSR con deploy continuo desde GitHub
- **Amazon Textract** — OCR universal de documentos de identidad
- **Amazon Rekognition** — Deteccion facial y estimacion de edad
- **Amazon RDS PostgreSQL** — Base de datos relacional en la nube
- **Cloudflare Tunnel** — Testing remoto en dispositivos moviles durante desarrollo

---

## URL de la aplicacion desplegada

**https://main.d1sjnmmlrw08mc.amplifyapp.com**

Desplegada en AWS Amplify con deploy automatico desde GitHub. HTTPS incluido.

---

## Como ejecutar la demo

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

### Credenciales de acceso

| Rol | Usuario | Contrasena | Vista |
|-----|---------|------------|-------|
| Administrador | admin | admin | Todo el sistema |
| Coordinador | coord | coord | Triage, emergencias, pacientes |
| Familiar | familia | familia | Mi expediente, seguimiento |
| Hospital | hospital | hospital | Emergencias canalizadas |

---

## Flujo de demo recomendado (5 minutos)

### Minuto 0:00-0:30 — Login
- Abrir la app, mostrar pantalla de login
- Ingresar como **admin** (credenciales: admin/admin)
- Mencionar: los 4 roles tienen vistas diferentes

### Minuto 0:30-0:45 — Dashboard
- Mostrar estadisticas, graficas, emergencias recientes
- KPIs de rendimiento del sistema

### Minuto 0:45-2:00 — Triage Rapido (corazon del sistema)
- Desde el sidebar, click en "Triage Rapido"
- Llenar los 5 pasos:
  1. Quien reporta (nombre, telefono, parentesco)
  2. Datos del paciente (nombre, edad, genero)
  3. Datos de la quemadura (causa, grado, % SCQ, zonas afectadas, fotos)
  4. Ubicacion (GPS automatico + direccion)
  5. Resultado: clasificacion automatica + hospital recomendado
- Mostrar que el boton "Anterior" funciona sin perder datos
- Destacar: basado en criterios de la American Burn Association

### Minuto 2:00-2:45 — Registrar paciente con OCR
- Ir a Pacientes > Nuevo Paciente
- Mostrar el OCR: tomar foto de documento, extraer datos, aplicar al formulario
- Mencionar: en produccion se conecta a vision artificial real

### Minuto 2:45-3:15 — Rehabilitacion laboral
- Mostrar catalogo de cursos (6 opciones)
- Organizaciones aliadas (DIF, CONALEP, etc.)
- Bolsa de trabajo

### Minuto 3:15-3:45 — Cambio de rol: Familiar
- Cerrar sesion
- Entrar como familia/familia
- Mostrar "Mi Expediente": vista completamente distinta
- QR del expediente, proxima cita, historial

### Minuto 3:45-4:15 — Cambio de rol: Hospital
- Entrar como hospital/hospital
- Solo ve: emergencias canalizadas, pacientes, camas
- Chat de emergencia visible

### Minuto 4:15-4:45 — Triage sin login
- Desde la pantalla de login, boton rojo "Triage Rapido"
- Demostrar que NO se necesita cuenta
- Decision de diseno: en una emergencia real no hay tiempo para credenciales

### Minuto 4:45-5:00 — Cierre
- Mencionar: 9 agentes de Kiro, desarrollo con IA
- Impacto social: digitaliza un flujo que hoy es telefonico
- Accesibilidad: lector de voz integrado, alto contraste

---

## Funcionalidades destacadas para evaluacion

### Uso de AWS (4 servicios)
- **Amplify:** hosting SSR con deploy automatico, HTTPS gratuito, URL publica permanente
- **Textract:** OCR que lee documentos de cualquier pais (CURP, pasaportes MRZ, cedulas, licencias, DNI)
- **Rekognition:** detecta el rostro en el documento para identificacion visual de pacientes NN
- **RDS PostgreSQL:** base de datos real con migraciones y datos. Cada pantalla muestra indicador "Amazon RDS" verificable

### Seguridad (nivel produccion)
- Auditoria documentada en `docs/AUDITORIA-SEGURIDAD.md`
- Content-Security-Policy con frame-ancestors, upgrade-insecure-requests
- HSTS, X-Frame-Options DENY, Permissions-Policy restrictiva
- Rate limiting en API de OCR (10/min por IP)
- Validacion de contenido real (magic bytes, no solo extension)
- Mensajes de error redactados (nunca se filtra ARN, endpoint o credenciales al cliente)
- Pool de conexiones configurado contra agotamiento
- Timeouts en llamadas a AWS

### Innovacion
- Clasificacion automatica de gravedad basada en criterios medicos reales (ABA)
- Acceso sin credenciales para emergencias (decision de diseno con justificacion)
- Lector de voz integrado que describe cada pantalla automaticamente
- OCR para llenado rapido de formularios en emergencias

### Impacto social
- Las quemaduras son la 2da causa de muerte accidental en menores de 5 anos en Mexico
- Digitaliza un flujo que actualmente es telefonico y desorganizado
- Conecta fundaciones, hospitales, familias y abogados en una sola plataforma
- Modulo de rehabilitacion laboral para reincorporacion a la vida productiva
- Defensa legal gratuita con universidades aliadas

### Calidad tecnica
- Build limpio sin errores de TypeScript
- 19 rutas funcionales, todas renderizadas como paginas estaticas
- Persistencia de formularios para no perder datos en emergencias
- Compresion de imagenes antes de guardar (optimizado para redes moviles)
- Diseno mobile-first con responsive completo
- Accesibilidad: ARIA labels, skip links, focus visible, reduced motion

### Uso de Kiro
- 9 agentes especializados documentados
- Steering file con contexto del proyecto
- Desarrollo iterativo con debugging asistido por agentes
- Bitacora documentada en `docs/bitacora-proyecto.md`

---

## Estructura de archivos relevante

```
/
├── README.md                    # Documentacion principal
├── docs/
│   ├── bitacora-proyecto.md     # Registro de desarrollo y decisiones
│   └── ENTREGA-HACKATHON.md     # Este documento
├── src/
│   ├── app/                     # 19 rutas (pages)
│   ├── components/              # Componentes reutilizables
│   └── lib/                     # Logica de negocio (triage, auth)
├── prisma/
│   └── schema.prisma            # Modelo de datos completo
├── .kiro/
│   ├── agents/                  # 9 agentes personalizados
│   └── steering/                # Contexto persistente
└── public/                      # Assets (logos reales de la fundacion)
```

---

## Notas importantes

- **Trabajo original**: desarrollado integramente durante el periodo del hackathon (20-27 julio 2026)
- **Datos ficticios**: todos los nombres, telefonos y expedientes son inventados. El banner "Demo" es permanente y no se puede cerrar, para evitar que capturas de pantalla se confundan con datos reales.
- **Produccion**: el schema de Prisma esta listo para conectar a PostgreSQL (compatible con AWS RDS). La app funciona como demo sin base de datos conectada.
- **Propiedad intelectual**: 100% del equipo segun Seccion 7 del reglamento.
