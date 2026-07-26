# Guion del Video de Presentacion (5 minutos)

## Notas para grabar

- Habla con calma, como explicandole a alguien que no conoce el tema
- Muestra la app en pantalla mientras hablas
- No digas "como pueden ver" — solo muestra y explica
- Si te equivocas, sigue. La naturalidad es mas creible que la perfeccion

---

## INTRO (0:00 - 0:30)

**[Pantalla: la app en la pagina de login]**

"Hola. Mi nombre es Wladimir Nivia, soy ingeniero informatico, y quiero presentarles un sistema que puede salvar vidas.

En Mexico y Latinoamerica, las quemaduras son la segunda causa de muerte accidental en ninos menores de 5 anos. Cuando un nino se quema, la familia entra en panico. No sabe a que hospital ir, no sabe si la quemadura es grave, y pierde minutos valiosos que determinan si ese nino va a recuperarse o no.

Este sistema resuelve ese problema."

---

## EL SISTEMA (0:30 - 0:45)

**[Pantalla: hacer login como admin, mostrar el dashboard]**

"Lo que ven aqui es el Panel de Control. Los datos que aparecen no son ficticios para la demo — vienen de una base de datos real en Amazon RDS. Ese indicador verde que dice 'Amazon RDS' lo confirma.

El sistema conecta a tres actores: la familia que reporta la emergencia, el coordinador que clasifica y canaliza, y el hospital que recibe al paciente."

---

## TRIAGE RAPIDO (0:45 - 2:15)

**[Pantalla: clic en Triage Rapido en el sidebar]**

"El corazon del sistema es el triage rapido. Son 5 pasos. Veamos:

**Paso 1** — Quien reporta. Nombre, telefono, parentesco. Lo basico para contactar despues."

**[Llenar y dar Siguiente]**

"**Paso 2** — Datos del paciente. Aqui hay algo importante: si el paramedico tiene el documento del nino, puede tomar una foto o adjuntar un archivo..."

**[Clic en 'Tomar foto' o 'Adjuntar', mostrar la foto del documento]**

"...y Amazon Textract lee el documento automaticamente. Extrae el nombre, los apellidos, la fecha de nacimiento, el genero. Ahorra tiempo en una emergencia donde cada segundo cuenta.

Si el paciente no tiene documento — esta inconsciente, o es un nino abandonado — el sistema le asigna un identificador temporal: 'NN' con fecha y hora. Despues se coteja cuando aparece la identidad."

**[Mostrar boton NN si quieres, luego Siguiente]**

"**Paso 3** — La quemadura. Causa, grado, porcentaje de superficie corporal quemada, y las zonas afectadas. Tambien se pueden tomar fotos de la quemadura para que el hospital las vea antes de que llegue el paciente."

**[Seleccionar algunas opciones, dar Siguiente]**

"**Paso 4** — Ubicacion. El sistema captura las coordenadas GPS automaticamente para que la ambulancia sepa exactamente donde ir."

**[Mostrar que se capturo GPS, dar 'Calcular Triage']**

"Y aqui viene el resultado. El sistema clasifica automaticamente usando los criterios de la American Burn Association adaptados a pediatria. En este caso: GRAVE, prioridad ALTA. Y recomienda el hospital correcto segun la gravedad."

**[Mostrar resultado con el hospital recomendado]**

"Desde aqui puedo hacer tres cosas: navegar al hospital con Google Maps o Waze, exportar un PDF del reporte para que el hospital lo imprima, o notificar a la familia por SMS."

---

## MAPA Y HOSPITALES (2:15 - 2:50)

**[Ir a la pagina de Hospitales]**

"El mapa usa mi ubicacion GPS real y muestra hospitales de mi zona — no solo los de Mexico, sino de cualquier parte del mundo. Los busca automaticamente en un radio de 200 kilometros usando datos de OpenStreetMap.

Cada hospital muestra la distancia, el tiempo estimado de llegada, y botones para navegar directo con Google Maps o Waze. En una emergencia, un boton es la diferencia entre llegar en 8 minutos o en 25."

---

## CAMBIO DE ROL (2:50 - 3:20)

**[Cerrar sesion, entrar como 'familia']**

"El sistema tiene 4 roles. Si entro como familiar del paciente, la vista es completamente distinta. Veo 'Mi Expediente': el diagnostico, la proxima cita, la linea de atencion de la fundacion. No veo lo que no me corresponde.

Si entro como hospital, solo veo las emergencias que me fueron canalizadas."

---

## ACCESIBILIDAD (3:20 - 3:45)

**[Activar modo oscuro, cambiar idioma, activar voz]**

"El sistema es accesible. Tiene modo oscuro para condiciones de poca luz, cambio de idioma entre espanol e ingles, y un lector de voz con Amazon Polly — que es una voz neural, suena como una persona real, no como un robot. Lee cada pantalla automaticamente para personas con discapacidad visual."

---

## TECNOLOGIA (3:45 - 4:15)

**[Puedes mostrar la pantalla que quieras o el README en GitHub]**

"A nivel tecnico, el sistema usa 8 servicios de Amazon Web Services:

- Amplify para el hosting
- Textract para leer documentos
- Rekognition para detectar el rostro en la foto del documento
- RDS para la base de datos
- Polly para la voz
- S3 para almacenar fotos
- SNS para enviar SMS a la familia
- Y Translate para traducir expedientes a cualquier idioma

Todo fue desarrollado con Kiro, usando 9 agentes de inteligencia artificial personalizados que ayudaron en arquitectura, seguridad, diseno y debugging.

El proyecto tiene auditoria de seguridad completa, paginas legales, consentimiento de cookies, y esta preparado para cumplir la normativa mexicana de proteccion de datos de menores."

---

## CIERRE (4:15 - 5:00)

**[Volver a la pantalla de login o al dashboard]**

"Este no es solo un prototipo. La base de datos esta conectada, el OCR funciona con documentos reales de cualquier pais, el mapa muestra hospitales reales de mi ubicacion, y esta desplegado en AWS listo para usarse.

El objetivo es que una fundacion, un hospital o una secretaria de salud pueda tomar este sistema y desplegarlo manana mismo para empezar a salvar vidas.

Porque en una quemadura, el tiempo entre el accidente y la atencion correcta determina si un nino se recupera completamente o queda con secuelas de por vida. Y este sistema reduce ese tiempo.

Gracias."

---

## Tips finales

- Si la demo falla en algun punto, di: "como toda tecnologia, a veces la red no coopera, pero el sistema esta disenado para seguir funcionando incluso offline"
- No te disculpes por nada. Muestra seguridad.
- El video no tiene que ser perfecto. Tiene que ser honesto y mostrar algo real.
