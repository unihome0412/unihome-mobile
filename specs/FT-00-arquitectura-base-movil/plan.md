# Plan — FT-00 arquitectura-base-movil

**ID:** PLAN-MOV-ARQ-000  
**Versión:** 1.0.0  
**Estado:** planificación documentada, **no ejecutada**  
**Rector:** `../../.specify/memory/constitution.md` (CM-01)  
**Base de requisitos:** `spec.md`.

> Derivado de `spec.md`. Sin código, sin generación de proyectos y sin ejecución. Las tareas viven en `task.md`.

## 1. Diseño

Describir una arquitectura **lógica mínima** del cliente, registrar decisiones y riesgos, planear verificaciones documentales y dejar preparado el proceso de validación humana y la alineación con el backend.

```text
                 [Persona usuaria]
                        |
  +---------------------v-----------------------------+
  |  CLIENTE MÓVIL  (entorno NO confiable: CM-05)     |
  |                                                   |
  |   [Presentación]                                  |
  |        |                                          |
  |   [Estado y datos]---[Caché local no sensible]    |
  |        |                                          |
  |   [Acceso a API]  <- única salida de red          |
  |                                                   |
  |   [Servicios de plataforma]  (almacenamiento      |
  |     seguro, permisos, notificaciones, diagnóstico)|
  |   [Puntos de extensión ML / IA generativa]        |
  +---------------------|-----------------------------+
                        |  Canal cifrado + contrato versionado
                        v
                 [Servicio / API]  -- ver SDD de backend
                        |
                        v
                 [MongoDB Atlas]   (nunca accesible desde el cliente)
```

**Fronteras:** el cliente es no confiable; la API es el punto de aplicación de controles; el cliente no conoce credenciales de persistencia. Los servicios de moderación, ML e IA se consumen **a través del backend**, nunca directamente con credenciales en la app (ARM-001, ARM-002, ARM-012). La vista no compromete biblioteca, repositorio ni funcionalidad.

**Capas y responsabilidades:**

| Capa lógica | Responsabilidad arquitectónica | Prohibición o límite | Requisitos |
| --- | --- | --- | --- |
| Presentación | Mostrar estado y capturar interacción; aplicar estados uniformes (carga, vacío, error…) | No accede a red, almacenamiento ni permisos directamente; sin reglas de negocio autoritativas | ARM-005, ARM-013 |
| Estado y datos | Coordinar datos del servidor, caché del cliente y estado de interfaz | No conoce el transporte; no persiste datos sensibles fuera de la política | ARM-005, ARM-007 |
| Acceso a API | Única capa que habla con el backend; aplica el contrato, errores uniformes y credenciales de sesión | No contiene lógica de interfaz ni de negocio; no se salta el contrato | ARM-003, ARM-004 |
| Servicios de plataforma | Encapsular capacidades del sistema: almacenamiento seguro, permisos, notificaciones, diagnóstico | Se usan **solo mediante interfaces propias**; no se acoplan a la presentación | ARM-005, ARM-006, ARM-008, ARM-011 |
| Puntos de extensión ML/IA | Aislar capacidades inteligentes consumidas vía backend | Sin credenciales de proveedores en la app; sin definir funcionalidad ahora | ARM-012 |
| Configuración por entorno | Proveer parámetros públicos por entorno | Sin secretos; sin valores de ejemplo que parezcan reales | ARM-002 |

**Reglas de dependencia (verificables por inspección):** (1) las dependencias apuntan **hacia abajo**: Presentación → Estado y datos → Acceso a API; (2) Presentación y Estado usan Servicios de plataforma solo a través de interfaces; (3) ninguna capa superior importa detalles de transporte, de almacenamiento o de una biblioteca concreta; (4) toda biblioteca de terceros queda detrás de una interfaz propia o se justifica según CM-09.

## 2. UI y navegación

**No aplica en esta etapa.** No se definen pantallas, rutas, flujos ni diseño visual (CM-02). Solo se registra la obligación arquitectónica de que la presentación consuma estado y no acceda a red, almacenamiento ni permisos directamente (ARM-005, ARM-013).

La navegación y el gestor de estado de interfaz siguen **por definir** (MM-201); no se elige biblioteca en este documento.

## 3. DI / composición de dependencias

No se elige biblioteca de inyección de dependencias. La regla es:

- composición centralizada de dependencias cuando se autorice la etapa funcional;
- tecnologías sustituibles detrás de interfaces propias (CM-06, CM-09);
- ninguna decisión de biblioteca se presenta como aprobada mientras siga como **Propuesta** o **Por definir** en `memoria.md`.

React Native está confirmado; Expo y TypeScript permanecen como propuestas (MM-101, MM-102, DM-06, DM-07).

## 4. Gates

**Gates documentales presentes (esta etapa):**

| Gate | Condición | Estado |
| --- | --- | --- |
| G-M01 · Alcance | Ninguna funcionalidad, pantalla, módulo ni spec funcional | Preparada para revisión |
| G-M02 · Coherencia | Requisitos, plan y tareas rastreables a CM-01…CM-15 | Preparada para revisión |
| G-M03 · Decisiones | Confirmadas ≠ propuestas ≠ por definir | Preparada para revisión |
| G-M04 · No ejecución | Ninguna tarea marcada ni comando ejecutado | Cumple al entregar |
| G-M05 · Alineación backend | Sin conflictos abiertos con el SDD de backend | Pendiente (RC-01, RC-02) |
| G-M06 · Autorización | Validación docente y del equipo antes de implementación | Pendiente |

**Gates técnicos futuros (no configurados, no ejecutados):** lint, typecheck, pruebas unitarias/integración/seguridad, análisis estático, CI/CD y compilación. Su selección depende de MM-204 y de la autorización de la etapa funcional.

## 5. Capacidades transversales de plataforma (políticas, no funcionalidad)

| Capacidad | Política arquitectónica | Origen | Requisitos | Estado |
| --- | --- | --- | --- | --- |
| Sesión | Credenciales de sesión en almacenamiento seguro del sistema; sesión viva hasta cierre explícito; cierre de sesión **coordinado con el servidor** y limpieza de datos locales | Lineamientos 10 y 16; CM-07, CM-13 | ARM-006 | Política propuesta |
| Datos locales y caché | Clasificar datos (sección 6); caché con vigencia e invalidación; borrado al cerrar sesión o eliminar cuenta; sin modo offline | Lineamiento 9; CM-13 | ARM-007 | Política propuesta |
| Permisos del dispositivo | Mínimo privilegio; pedir en contexto con explicación; no solicitar permisos «por si acaso»; declaración transparente | Lineamiento 16; CM-07 | ARM-008 | Política propuesta |
| Privacidad | El aviso de privacidad y manejo de datos debe ser accesible desde la app y vinculado a la página pública del proyecto; punto de arquitectura reservado | Lineamiento 16; CM-07 | ARM-009 | Punto reservado |
| Eliminación de cuenta | Capacidad reservada con confirmación fuerte y limpieza local posterior; el borrado real es del servidor | Lineamiento 16; CM-07 | ARM-009 | Punto reservado |
| Verificación de contenido | Todo texto, imagen o video de personas usuarias se verifica **en el servidor antes de aceptarse**; el cliente maneja el rechazo de forma uniforme | Lineamiento 16; CM-07 | ARM-010 | Punto reservado |
| Notificaciones push | Registro y baja del dispositivo ligados a la sesión; carga útil **sin datos sensibles**; el cliente no define la lógica de envío | Lineamiento 16; CM-07 | ARM-011 | Punto reservado |
| ML e IA generativa | Capacidades consumidas vía backend tras interfaces; límites de datos enviados; indicar al usuario cuándo interactúa con IA; sin definir funciones | Lineamiento 16; CM-05, CM-09 | ARM-012 | Punto reservado |
| Estados y errores | Un vocabulario único de estados (carga, vacío, error, sin conexión, no autorizado, límite de uso) y mensajes sin detalles internos | CM-13 | ARM-013 | Política propuesta |
| Diagnóstico del cliente | Eventos técnicos y errores sin datos sensibles; proveedor por definir | CM-07, CM-08 | ARM-013 | Por definir |

## 6. Clasificación de datos locales y política de caché

| Clase | Ejemplos genéricos | Almacenamiento permitido | Política |
| --- | --- | --- | --- |
| Secreto de sesión | Credenciales de sesión | **Solo** almacenamiento seguro del sistema | Nunca en caché simple, registros ni respaldos; se elimina al cerrar sesión |
| Datos del servidor en caché | Respuestas de consulta reutilizables | Caché del cliente con expiración | No sensible; se invalida por tiempo o por evento; se borra al cerrar sesión o eliminar cuenta |
| Preferencias no sensibles | Ajustes de la aplicación | Almacenamiento local simple | Sin datos personales identificables |
| Datos sensibles de dominio | Cualquier dato personal o documental | **No se persisten localmente** salvo necesidad aprobada y protegida | Excepción documentada conforme a CM-12 |
| Contenido en tránsito | Archivos preparados para subir | Memoria o temporal acotado | Se elimina tras subir o cancelar |

No hay modo offline: ninguna clase se usa para operar sin red (MM-008). El almacenamiento local relacional no se adopta (el lineamiento 16 lo pide solo si el proyecto lo requiere).

## 7. Configuración y límites de confianza

- **Entornos conceptuales:** desarrollo, validación y producción; su infraestructura concreta está por definir (MM-203, MM-204).
- **Clases de configuración del cliente:** parámetros **públicos** por entorno (por ejemplo, dirección base de la API), identificadores públicos de servicios y claves **públicas restringidas** por identificador de aplicación. Todo valor distribuido en la app se considera público (CM-05).
- **Secretos de construcción y firma:** fuera del repositorio, en el gestor de secretos de la herramienta de CI/CD (por definir). No se incluyen valores de ejemplo realistas.
- **Camino de confianza:** cliente → API es no confiable hasta validación de servidor; las validaciones del cliente solo mejoran la experiencia.
- **Contratos:** definir un criterio general de compatibilidad y versionado; los recursos, esquemas y endpoints se reservan para la fase funcional (ARM-004, ARM-020).

**Política general de contrato y compatibilidad (sin endpoints):** (a) el contrato es único y compartido con el backend; (b) los cambios compatibles se agregan sin romper versiones instaladas; (c) un cambio incompatible requiere versión nueva del contrato y un periodo de convivencia documentado; (d) el backend puede indicar versiones del cliente no soportadas y el cliente debe responder de forma uniforme; (e) el cliente tolera campos desconocidos.

## 8. Alineación con el SDD de backend (CM-14)

| Tema | Postura del cliente | Acuerdo requerido con el backend | Estado |
| --- | --- | --- | --- |
| Frontera y persistencia | El cliente nunca accede a Atlas | Backend: ARQ-001, ARQ-002, ARQ-003 | **Alineada** |
| Contrato y versionado | Capa única de acceso; tolerancia a cambios compatibles | Backend: ARQ-008 (política general); contrato por definir | Pendiente |
| Autenticación y ciclo de sesión | Credenciales en almacenamiento seguro; cierre coordinado | Backend: C-07 deja detalle a fase posterior | Pendiente |
| Verificación de contenido | Cliente maneja el rechazo uniformemente | Backend decide proveedor y política | Pendiente |
| Notificaciones push | Registro/baja ligados a sesión | Backend define emisión y datos permitidos | Pendiente |
| Privacidad y eliminación de cuenta | Puntos reservados en el cliente | Backend define retención y borrado | Pendiente |
| ML / IA generativa | Interfaces de extensión; sin claves en la app | Backend integra proveedores | Pendiente |
| Observabilidad | Diagnóstico sin datos sensibles | Backend: ARQ-009 (conceptual) | Alineada conceptualmente |
| Errores y límites de uso | Vocabulario uniforme de estados | Backend define convención de errores y límites | Pendiente |
| Framework del cliente | React Native (MM-006) | Backend registra M-201 como Por definir | **Ajuste registrado (RC-01)** |
| Entornos y CI/CD | Entrega a Google Play | Backend: M-204 por definir | Pendiente |

## 9. Matriz conceptual de calidad

| Atributo | Enfoque de arquitectura | Verificación en esta fase | Posterior, solo con autorización |
| --- | --- | --- | --- |
| Seguridad | Dispositivo no confiable, sin secretos en la app, almacenamiento seguro, mínimo privilegio | Revisar diagramas y políticas | Análisis estático, de dependencias y de secretos; pruebas de seguridad móvil |
| Mantenibilidad | Capas cohesivas, interfaces propias, pocas dependencias justificadas | Revisar reglas de dependencia | Pruebas y análisis estático |
| Rendimiento percibido | Caché del cliente y estados de carga uniformes | Revisar política de caché | Medición en dispositivos representativos |
| Consumo de recursos | Evitar trabajo innecesario en segundo plano y datos sobredimensionados | Anotar decisiones pendientes | Perfilado en dispositivos |
| Accesibilidad | Atributo de diseño transversal | Verificar que figura como requisito | Revisión con herramientas de accesibilidad |
| Idioma y región | Español de México; formatos regionales | Verificar que figura como requisito | Revisión de contenido |
| Compatibilidad | Versión mínima de Android por definir | Registrar decisión pendiente (MM-202) | Pruebas en dispositivos objetivo |
| Fiabilidad | Manejo uniforme de fallos y de límite de uso | Revisar política de estados | Pruebas de resiliencia |
| Observabilidad | Eventos y errores sin datos sensibles | Revisar responsabilidades | Instrumentación y validaciones |

No hay objetivos numéricos aprobados ni resultados técnicos que reportar (ARM-013, ARM-014, ARM-015).

## 10. Decisiones y asuntos pendientes

| Decisión | Selección actual | Estado | Referencia |
| --- | --- | --- | --- |
| DM-01 · Canales lógicos | Cliente ↔ API ↔ persistencia | Confirmada como contexto | MM-002 / ARM-001 |
| DM-02 · Persistencia solo desde servidor | MongoDB Atlas, sin acceso del cliente | Confirmada | MM-003 / ARM-001 |
| DM-03 · Framework del cliente | React Native | Confirmada (declaración del equipo) | MM-006 / ARM-018 |
| DM-04 · Plataforma objetivo | Android / Google Play | Confirmada | MM-007 / ARM-016 |
| DM-05 · Modo offline | No habrá | Confirmada | MM-008 / ARM-007 |
| DM-06 · Herramienta de construcción | Expo | **Propuesta** | MM-101 |
| DM-07 · Lenguaje | TypeScript | **Propuesta** | MM-102 |
| DM-08 · Organización interna | Capas con límite contractual | **Propuesta** | MM-107 / ARM-005 |
| DM-09 · Datos del servidor y caché | Biblioteca de consultas + caché local no sensible | **Propuesta** | MM-103 / ARM-007 |
| DM-10 · Almacenamiento seguro | Keystore vía biblioteca por definir | **Propuesta** | MM-104 / ARM-006 |
| DM-11 · Cliente de API | Generado desde contrato compartido | **Propuesta** | MM-105 / ARM-004 |
| DM-12 · Push | Servicio de Expo sobre FCM | **Propuesta** | MM-106 / ARM-011 |
| DM-13 · Pruebas | Jest + RN Testing Library; e2e por definir | **Propuesta** | MM-108 / ARM-015 |
| DM-14 · Navegación y estado de interfaz | Sin selección | **Por definir** | MM-201 |
| DM-15 · Versión mínima de Android | Sin selección | **Por definir** | MM-202 |
| DM-16 · Repositorios, CI/CD y firma | Sin selección | **Por definir** | MM-203, MM-204 |
| DM-17 · Proveedores de moderación, ML e IA | Sin selección (vía backend) | **Por definir** | MM-205 |
| DM-18 · Diagnóstico de fallos | Sin selección | **Por definir** | MM-206 |
| DM-19 · Matriz de versionamiento | Sin definir; obligatoria antes de desarrollar | **Por definir** | MM-207 / ARM-016 |

Las decisiones relevantes podrán formalizarse como ADR más adelante; **no se crea** por ahora carpeta de ADR ni infraestructura ejecutable (ARM-018).

## 11. Fases propuestas (todas pendientes)

| Fase | Trabajo futuro, no ejecutado | Requisitos | Evidencia esperada |
| --- | --- | --- | --- |
| FM-01 · Gobernanza y alineación | Revisar constitución, memoria, permisos de agentes y reconciliación con el backend | ARM-004, ARM-017, ARM-018, ARM-019, ARM-020 | Aceptación humana futura |
| FM-02 · Modelo lógico y capas | Validar fronteras, capas, reglas de dependencia y principios de contrato | ARM-001, ARM-003, ARM-004, ARM-005 | Diagrama aprobado y reglas claras |
| FM-03 · Seguridad y capacidades transversales | Revisar configuración, sesión, datos locales, permisos, privacidad, verificación de contenido, push, ML/IA y riesgos | ARM-001, ARM-002, ARM-006 a ARM-012 | Matrices revisadas y lista de riesgos aceptada |
| FM-04 · Calidad y entrega | Revisar estados, calidad, estrategia de pruebas y estrategia de entrega | ARM-013, ARM-014, ARM-015, ARM-016 | Matriz de calidad, estrategia de verificación y de entrega aprobadas |
| FM-05 · Verificación documental | Auditar trazabilidad y ausencia de funcionalidad | ARM-017, ARM-020 | Informe de consistencia documental |
| FM-06 · Cierre de etapa | Resolver decisiones abiertas y solicitar aprobación | ARM-018, ARM-019, ARM-020 | Decisión de avanzar o corregir |

Estas fases son **plan de trabajo**, no evidencia de ejecución. Sus tareas aparecen en `task.md` sin marcar.

## 12. Política de pruebas y de cambio de etapa

**Ahora, permitido solo como planeación:** definir criterios de inspección de coherencia, trazabilidad, permisos de agentes, alineación con el backend y ausencia de funcionalidad.

**Más adelante, solo con autorización:** diseñar pruebas reales según las tecnologías confirmadas.

| Tipo de verificación futura | Propósito | Estado |
| --- | --- | --- |
| Unitarias | Lógica del cliente aislada de la interfaz | No ejecutada |
| Integración | Capas del cliente entre sí y contra un contrato simulado o entorno de validación | No ejecutada |
| Seguridad | Dependencias, secretos, almacenamiento, tráfico y configuración | No ejecutada |
| Extremo a extremo | Recorridos clave en dispositivo o emulador | No ejecutada |

**Bloqueos:** cualquier conflicto con CM-01…CM-15; selección tecnológica sin respaldo; funcionalidad agregada; casilla marcada; decisión pendiente presentada como aprobada; conflicto abierto con el backend.

## 13. Convención reservada para especificaciones funcionales futuras

Cuando se autorice la fase funcional, cada módulo tendrá su propia carpeta `specs/FT-0X-<nombre>/` con `spec.md`, `plan.md`, `task.md` y `checklists/checklist.md`, bajo la misma jerarquía y con IDs propios. **Esta convención está reservada y NO se crea ahora**; no existen módulos definidos (ARM-020).

## 14. Puerta de aprobación

Antes de permitir trabajo ejecutable se necesita **aprobación humana explícita**, revisión del estado de decisiones, resolución de la reconciliación con el backend y modificación deliberada de `AGENTS.md`, `opencode.jsonc` y planes conforme a CM-03, CM-11 y CM-12. **Estado actual: NO AUTORIZADO.**

## Aprobación

| Estado | Revisor | Fecha | Evidencia |
|---|---|---|---|
| Borrador | — | — | Pendiente de revisión docente/equipo (puerta G-M06) |
