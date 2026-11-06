---
version: 1.2.0
ratified: pending
last_amended: 2026-11-05
status: proposed
source_of_truth: .specify/memory/constitution.md
mirror: ./constitution.md
methodology: SDD
---
# Constitución de UniHome Móvil · Arquitectura base del cliente y gobierno SDD

**ID:** UNI-MOV-CONST  
**Versión:** 1.2.0  
**Fecha:** 2026-10-29 · **Última enmienda de alcance:** 2026-11-05  
**Estado:** baseline documental propuesto; enmienda de alcance solicitada por el titular; aprobación académica y del equipo pendiente.  
**Ámbito:** todos los archivos de este paquete SDD del **proyecto móvil** y sus agentes.  
**Paquete hermano:** el SDD de backend (`UniHome_SDD`, v1.0.0, 2026-10-26) es una referencia externa a este paquete; su constitución no se copia aquí (ver CM-14).

## Preámbulo

Esta constitución define principios **no negociables** para preparar, revisar y posteriormente evolucionar la arquitectura base del **cliente móvil** de UniHome. En esta etapa **solo autoriza documentación**. Ningún archivo del paquete equivale a autorización para generar código, instalar dependencias, compilar, publicar, modificar infraestructura ni ejecutar tareas.

Los términos **DEBE**, **NO DEBE**, **DEBERÍA** y **PUEDE** expresan obligatoriedad en este conjunto documental.

**Convención de identificadores:** el sufijo **M** distingue este paquete del de backend (`C-`, `ARQ-`, `F-`, `T-`, `R-`): normas `CM-XX`, requisitos `ARM-XXX`, fases `FM-XX`, tareas `TM-XXX`, riesgos `RM-XX`, decisiones del plan `DM-XX`, registros de memoria `MM-XXX`.

## Artículos

### CM-01 · Prioridad normativa y una sola fuente de verdad

La jerarquía documental **DEBE** ser: `constitution.md` → `spec.md` → `plan.md` → `task.md`. `AGENTS.md`, `memoria.md`, subagentes y skills **DEBEN** remitir a esta constitución y **NO DEBEN** modificar sus normas. Una contradicción **DEBE** bloquear el avance y registrarse para revisión humana.

### CM-02 · Separación de alcance por fases

La **fase de arquitectura base** (`FT-00` y su desglose detallado `ARQM-001`…`ARQM-006`) **DEBE** limitarse a capas, fronteras, capacidades transversales de plataforma, atributos de calidad, seguridad, entrega y verificación. **NO DEBE** incluir pantallas, flujos de usuario, reglas de negocio, endpoints ni modelos de dominio; esos artefactos viven en las features funcionales autorizadas.

**Fase funcional e infraestructura autorizada (enmiendas 1.1.0, 1.2.0 y unificación 1.3.0, 2026-11-05):** se autoriza e integra la documentación de:
1. **Arquitectura base detallada:** `specs/FT-00-arquitectura-base-movil/` y `specs/01-arquitectura-base/ARQM-001` a `ARQM-006` (incluyendo `ARQM-002-seguridad-cliente/spec.md` restaurado).
2. **Funcionalidades prioritarias:** **registro de usuario** (`FT-01` / `F01-registro-usuario`), **login y sesión** (`FT-02` / `F02-inicio-sesion`), **sistema de diseño basado en Figma** (`FT-05`) y **pantallas posteriores al primer ingreso** (`FT-06`). Las funcionalidades `F03` en adelante no están redactadas a detalle y todo el paquete permanece en estado `Propuesto / Borrador` con `0` tareas ejecutadas.
3. **Infraestructura CI/CD y Google Play:** `FT-03` (`specs/03-infraestructura/INFM-001` a `INFM-003` e `INFM-005`) y `FT-04` (`INFM-004-despliegue-google-play`), más las especificaciones de prueba en `tests/` y los ADRs en `docs/adr/`.

**Aclaración:** la autorización es **documental**. Sigue prohibido generar código, instalar dependencias, compilar, probar, firmar, publicar o desplegar sin la autorización de CM-03. Por decisión confirmada del 2026-11-05, el cliente se construirá con **React (React Native)** consumiendo los endpoints ya implementados y el despliegue se mantendrá **LOCAL** por ahora (sin publicar todavía en tienda).

### CM-03 · Planeación antes que ejecución

Los documentos **PUEDEN** proponer estructura, secuencia y criterios de aceptación, pero las tareas **DEBEN** permanecer en `[ ]` y estado **Pendiente**. **NO SE AUTORIZA** ejecutar tareas, comandos, instalaciones, creación de proyectos, compilaciones, pruebas, despliegues, publicaciones ni commits por el mero hecho de leer este paquete. Cualquier activación posterior **REQUIERE** autorización humana explícita y actualización del estado documental y de los permisos del agente.

### CM-04 · Decisiones trazables y sin suposiciones

Cada decisión técnica **DEBE** etiquetarse como **Confirmada**, **Propuesta** o **Por definir**, con fundamento y responsable de validación. Una propuesta **NO DEBE** presentarse como tecnología aprobada. El registro de estado se mantiene en `memoria.md`; la justificación de decisiones arquitectónicas se especifica en `plan.md` hasta que proceda formalizar ADR.

### CM-05 · Fronteras del cliente y dispositivo no confiable

El dispositivo y el paquete de la aplicación **DEBEN** tratarse como entorno **no confiable**: todo lo que se distribuye en la app puede ser inspeccionado. El cliente **NO DEBE** contener credenciales privilegiadas, secretos de servidor ni conexión directa a la persistencia. Toda decisión de confianza, autorización y acceso a datos **DEBE** resolverse del lado servidor. Las validaciones del cliente son de **experiencia de uso**, no de seguridad.

### CM-06 · Contrato único con el backend y desacoplamiento

La comunicación del cliente con el servicio **DEBE** pasar por un **límite contractual único** y una capa de acceso centralizada, de modo que presentación y estado no dependan del transporte ni de detalles internos del servidor. El contrato **DEBE** ser la fuente de verdad compartida con el backend (CM-14); el cliente **NO DEBE** ser la autoridad de reglas de negocio ni inferir el contrato a partir de la interfaz. Las tecnologías sustituibles **DEBEN** quedar tras interfaces propias.

### CM-07 · Seguridad y privacidad desde el diseño en el dispositivo

La propuesta **DEBE** contemplar: almacenamiento seguro de credenciales de sesión, mínimo de datos persistidos localmente, clasificación de datos, mínimo privilegio en permisos del dispositivo (solicitados en contexto y con explicación), comunicación cifrada en tránsito, ausencia de datos sensibles en registros y capturas de diagnóstico, y prohibición de secretos en documentos o repositorios. **DEBE** además reservar puntos de arquitectura para: aviso de privacidad accesible, eliminación de cuenta, cierre de sesión coordinado con el servidor y verificación previa de contenido generado por usuarios en el servidor antes de aceptarlo. Los riesgos **DEBEN** registrarse antes de aprobar decisiones que los afecten.

### CM-08 · Calidad verificable

Toda obligación arquitectónica **DEBE** tener un criterio de aceptación **comprobable por revisión documental** en esta fase. La estrategia futura de pruebas (unitarias, de integración y de seguridad, según la actividad) **DEBE** enunciarse sin fingir resultados. **NO DEBE** afirmarse que hubo compilaciones, pruebas, auditorías, publicaciones o despliegues si no se ejecutaron.

### CM-09 · Simplicidad y evolución moderada

Las decisiones **DEBEN** favorecer cohesión, bajo acoplamiento y claridad operativa, evitando bibliotecas, capas y herramientas sin necesidad justificada. Cada dependencia de terceros **DEBE** poder justificarse (qué problema resuelve, alternativa y costo de mantenimiento). La arquitectura **NO DEBE** obligar prematuramente a una biblioteca o plataforma no confirmada.

### CM-10 · Trazabilidad bidireccional

Cada requisito en `spec.md` **DEBE** vincularse con decisiones o actividades en `plan.md` y con una o más tareas identificadas en `task.md`; cada tarea **DEBE** justificar qué requisito atiende. Los IDs **DEBEN** mantenerse estables. Las inconsistencias **DEBEN** señalarse como hallazgos, no ocultarse.

### CM-11 · Agentes con permisos limitados

Los agentes y skills **DEBEN** operar en modo documental de lectura y revisión durante esta fase. **NO DEBEN** ejecutar comandos ni alterar archivos automáticamente. La configuración de OpenCode **DEBE** usar restricciones efectivas de edición y shell; las instrucciones en lenguaje natural, por sí solas, **NO SON** controles técnicos suficientes. Los subagentes **NO DEBEN** delegar trabajo de ejecución. Los agentes **NO DEBEN** leer archivos de variables de entorno ni credenciales.

### CM-12 · Gobierno de cambios

Los cambios **DEBEN** documentar causa, impacto, archivos afectados, fecha y aceptación humana. Si cambia esta constitución, **DEBEN** revisarse `AGENTS.md`, `memoria.md`, `spec.md`, `plan.md`, `task.md`, agentes y skills antes de continuar. El esquema de versión **DEBE** usar `MAJOR.MINOR.PATCH`: MAJOR para cambio de principios, MINOR para nuevas reglas compatibles y PATCH para aclaraciones.

### CM-13 · Experiencia y robustez en el dispositivo

La arquitectura **DEBE** tratar como atributos de diseño: estados uniformes de carga, vacío, error, sin conexión y no autorizado; rendimiento percibido y consumo moderado de recursos; accesibilidad; idioma y formatos regionales (español de México); tolerancia a la variedad de dispositivos y versiones de Android; y una política explícita de caché del lado del cliente. La aplicación **NO tendrá modo offline** (decisión del equipo, `memoria.md`); la caché es solo para velocidad y no sustituye la fuente de verdad del servidor. La sesión **deberá** (**DEBE**) mantenerse siempre activa hasta que el usuario realice un cierre de sesión explícito (logout), conforme al lineamiento 16 del profesor.

### CM-14 · Alineación con el SDD de backend

Este paquete **DEBE** mantenerse coherente con el SDD de backend. Un conflicto entre ambos paquetes **DEBE** registrarse como hallazgo `Bloqueante` y resolverse por decisión humana documentada en **ambos** paquetes; ningún agente **PUEDE** resolverlo editando uno de ellos. Las decisiones que afecten al contrato, la autenticación, la moderación, las notificaciones o la privacidad **DEBEN** registrarse en la tabla de alineación del plan.

### CM-15 · Entrega y ciclo de vida del artefacto móvil

El artefacto de distribución es una aplicación Android publicable en **Google Play** (confirmado por la actividad). La entrega **DEBE** contemplar: configuración por entorno sin secretos versionados, **matriz de versionamiento** definida antes de desarrollar y aplicada en cada despliegue, integración y entrega continuas, firma controlada fuera del repositorio y compatibilidad del contrato con versiones de la app ya instaladas. La publicación y el cumplimiento de las políticas de la tienda **DEBEN** revisarse con la información vigente al momento de ejecutar, no con supuestos.

### CM-16 · Fidelidad de diseño y fuente Figma

El diseño visual de referencia **DEBE** ser el archivo Figma versionado del proyecto. Su URL se registra en `FT-05` y puede permanecer pendiente hasta que el equipo la publique. Toda pantalla funcional **DEBE** derivarse de tokens (color, tipografía, espaciado, radios, elevación, iconografía) y componentes definidos en Figma, con correspondencia explícita a componentes de React Native. **NO DEBE** inventarse estilo, medida o activo visual fuera del sistema. El cambio de diseño **DEBE** registrarse con versión o fecha de congelamiento, impacto y aprobación humana, y verificarse con comparación visual antes de aceptar una pantalla. Los tokens e imágenes **NO** son secretos; las credenciales de acceso a Figma **SÍ** y nunca se versionan.

## Enmienda de alcance 1.1.0 (2026-11-04)

Registrada conforme a CM-12.

| Campo | Contenido |
| --- | --- |
| Causa | El equipo solicitó especificaciones funcionales de registro y login, mayor detalle de arquitectura base, infraestructura CI/CD, despliegue en Google Play y fidelidad al diseño de Figma. |
| Impacto | Se amplía CM-02 a una fase funcional documental; se agregan `FT-01`…`FT-05`; se actualizan `AGENTS.md`, `memoria.md`, `README.md`, `specs/README.md`, `CHECKLIST_PR.md`, subagentes, skills y `opencode.jsonc`. |
| Archivos afectados | Constitución canónica y espejo, gobierno documental, índice de specs, nuevas features y perfiles de agentes. |
| Aprobación humana | Solicitud del titular del paquete del 2026-11-04. Ratificación docente/equipo pendiente. |
| Límite | La enmienda autoriza documentación; no autoriza ejecución (CM-03). |

## Enmienda de alcance 1.2.0 (2026-11-05)

Registrada conforme a CM-12.

| Campo | Contenido |
| --- | --- |
| Causa | La maqueta cambió y la revisión de móvil pide pantallas posteriores al primer ingreso, no cubiertas por `FT-01`…`FT-05`. |
| Impacto | Se agrega `FT-06`; se redactan `FT-01`, `FT-02`, `FT-05` y `FT-06`; se actualizan gobierno, memoria e índice. `FT-03` y `FT-04` siguen sin redactar. |
| Archivos afectados | Constitución canónica y espejo, `AGENTS.md`, `memoria.md`, `README.md`, `specs/README.md`, `CHECKLIST_PR.md`, subagentes, skills y carpetas de esas features. |
| Aprobación humana | Solicitud de la integrante Citlali del 2026-11-05. Ratificación docente/equipo pendiente. |
| Límite | La enmienda autoriza documentación; no autoriza ejecución (CM-03). |

## Puertas de control

| Puerta | Condición obligatoria | Estado inicial |
| --- | --- | --- |
| G-M01 · Alcance | Arquitectura base sin funcionalidad; specs funcionales solo en `FT-01`…`FT-06` con trazabilidad propia | Preparada para revisión |
| G-M02 · Coherencia | Requisitos, plan y tareas rastreables a CM-01…CM-16 | Preparada para revisión |
| G-M03 · Decisiones | Confirmadas ≠ propuestas ≠ por definir | Preparada para revisión |
| G-M04 · No ejecución | Ninguna tarea marcada ni comando ejecutado | Cumple al entregar |
| G-M05 · Alineación con backend | Sin conflictos abiertos con el SDD de backend | Pendiente (hay un ajuste registrado) |
| G-M06 · Autorización | Validación docente y del equipo antes de implementación | Pendiente |
| G-M07 · Diseño | Tokens, componentes y pantallas de `FT-01`/`FT-02`/`FT-06` trazables al Figma versionado (CM-16) | Pendiente |
| G-M08 · Entrega | Matriz de versionamiento, firma, CI/CD y requisitos vigentes de Google Play documentados | Pendiente |

## Procedimiento de excepción

Las excepciones **NO** pueden aprobarlas agentes. El equipo **DEBE** documentar: (1) regla afectada, (2) razón, (3) riesgo, (4) alternativa, (5) aprobación humana y (6) ajustes de trazabilidad. Una excepción no autoriza automáticamente ejecución.

## Fuentes de aplicación

- `AGENTS.md`: instrucciones operativas subordinadas.
- `memoria.md`: registro de decisiones y dudas, no normativa adicional.
- `.specify/templates/`: plantillas canónicas de `spec`, `plan`, `task` y checklist.
- `specs/FT-00-arquitectura-base-movil/spec.md`: requisitos de arquitectura del cliente.
- `specs/FT-00-arquitectura-base-movil/plan.md`: propuesta de diseño y fases.
- `specs/FT-00-arquitectura-base-movil/task.md`: tareas futuras, **sin ejecutar**.
- `specs/FT-01-registro-usuario/` y `specs/02-funcionalidades/F01-registro-usuario/`: especificación funcional de registro y confirmación de correo.
- `specs/FT-02-login-sesion/` y `specs/02-funcionalidades/F02-inicio-sesion/`: especificación funcional de login, refresh y logout.
- `specs/FT-03-infraestructura-cicd-devsecops/` y `specs/03-infraestructura/INFM-001..003,005`: CI/CD, DevSecOps y ambientes del cliente (redactadas en Borrador; despliegue actual mantenido en LOCAL).
- `specs/FT-04-despliegue-google-play/` y `specs/03-infraestructura/INFM-004-despliegue-google-play/`: firma, versionado y configuración de Google Play (redactadas en Borrador; publicación diferida mientras se opera en LOCAL).
- `specs/FT-05-diseno-figma-ui/`: maqueta vigente, inventario y sistema de diseño.
- `specs/FT-06-primer-ingreso/`: pantallas posteriores al primer ingreso.
- `specs/01-arquitectura-base/ARQM-001..006`, `docs/` y `tests/`: especificaciones detalladas de arquitectura base, seguridad (`ARQM-002`), ADRs, decisiones y casos de prueba diseñados (0 ejecutados).
