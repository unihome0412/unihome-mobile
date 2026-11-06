# FT-00 arquitectura-base-movil — Arquitectura base del cliente móvil de UniHome

**ID:** SPEC-MOV-ARQ-000  
**Versión:** 1.0.0  
**Estado:** Borrador documental / pendiente de aprobación  
**Rector:** `../../.specify/memory/constitution.md` (CM-01)  
**Etapa:** solo especificación; ninguna tarea ejecutada.

> Contraparte del lado cliente de `SPEC-ARQ-000` del backend. Sin funcionalidad específica: no define módulos, pantallas, flujos, historias ni endpoints (CM-02).

## 1. Contexto y objetivo

Definir **qué** propiedades debe satisfacer la **arquitectura base del cliente móvil**, con independencia de la funcionalidad del producto. La implementación no forma parte de este documento.

**Incluye:** capas internas del cliente, frontera con la API, política de datos locales y caché, sesión como política, permisos del dispositivo, privacidad, puntos de extensión para moderación, notificaciones y capacidades de ML/IA, configuración por entorno, calidad, estrategia de pruebas, entrega a Google Play, gobierno documental y alineación con el backend.

**Excluye explícitamente:** módulos y pantallas, flujos de usuario, historias de usuario, reglas de negocio, contratos o endpoints concretos, modelos de dominio, especificaciones funcionales por módulo, diseño visual, código, scripts, creación de proyectos, pruebas ejecutadas, compilaciones y publicaciones.

**Línea base confirmada:** cliente móvil en **React Native** para **Android / Google Play**, backend/API propio, persistencia en MongoDB Atlas accesible solo desde el servidor y **sin modo offline** (`memoria.md`: MM-002, MM-003, MM-006, MM-007, MM-008).

**Propuesto, no aprobado:** Expo, TypeScript, biblioteca de consultas con caché, almacenamiento seguro, cliente generado desde contrato, push vía servicio de Expo y estrategia de pruebas (MM-101 a MM-109).

**Por definir:** navegación y estado de interfaz, versión mínima de Android, repositorios, CI/CD y firma, proveedores de moderación/ML/IA, diagnóstico de fallos y matriz de versionamiento (MM-201 a MM-208).

**Supuesto de modelado, no decisión de despliegue:** representar las capas del cliente como separadas aunque se alojen en un mismo proyecto.

## 2. Requisitos (funcionales o de arquitectura según la etapa)

Esta etapa **no tiene requisitos funcionales**. Los requisitos de arquitectura base son los siguientes y son verificables por inspección documental.

| ID | Requisito (DEBE) | Evidencia documental esperada | Norma |
| --- | --- | --- | --- |
| ARM-001 | Distinguir responsabilidades del **cliente móvil** frente a API y persistencia, y tratar el dispositivo y el paquete de la app como entorno no confiable | Vista conceptual y límites de confianza | CM-05 |
| ARM-002 | Excluir del cliente credenciales privilegiadas y secretos de servidor; separar configuración **pública** por entorno de los secretos de construcción | Matriz de configuración conceptual | CM-05, CM-07 |
| ARM-003 | Centralizar la comunicación con el backend en una **capa única de acceso a API** tras un límite contractual | Diagrama y regla de dependencias | CM-06 |
| ARM-004 | Definir una política general de **alineación, versionado y compatibilidad del contrato** con el backend, incluida la compatibilidad con versiones de la app ya instaladas, **sin definir endpoints** | Política general y tabla de alineación | CM-06, CM-14, CM-15 |
| ARM-005 | Organizar el cliente en **capas desacopladas** con reglas de dependencia explícitas y tecnologías sustituibles tras interfaces propias | Tabla de capas y reglas | CM-06, CM-09 |
| ARM-006 | Establecer la **política de sesión**: credenciales de sesión en almacenamiento seguro del sistema, sesión persistente hasta cierre explícito y cierre de sesión coordinado con el servidor (sin definir flujos) | Política de sesión | CM-07, CM-13 |
| ARM-007 | Clasificar los **datos locales** y fijar la política de **caché del cliente** (vigencia, invalidación, borrado al cerrar sesión o eliminar cuenta), sin modo offline | Tabla de clasificación y política de caché | CM-07, CM-13 |
| ARM-008 | Definir la política de **permisos del dispositivo**: mínimo privilegio, solicitud en contexto con explicación y declaración transparente | Política de permisos | CM-07 |
| ARM-009 | Reservar puntos de arquitectura para el **aviso de privacidad** accesible y la **eliminación de cuenta**, sin definir pantallas ni flujos | Matriz de capacidades transversales | CM-02, CM-07 |
| ARM-010 | Establecer que el **contenido generado por personas usuarias se verifica en el servidor antes de aceptarse** y que el cliente maneja el rechazo de forma uniforme | Política y punto de extensión | CM-07, CM-14 |
| ARM-011 | Definir el canal de **notificaciones push** como capacidad de plataforma: registro y baja del dispositivo asociados a la sesión y carga útil sin datos sensibles | Matriz de capacidades transversales | CM-07, CM-14 |
| ARM-012 | Reservar **puntos de extensión para capacidades de ML e IA generativa** consumidas a través del backend, con límites de datos y sin definir funcionalidad | Punto de extensión y límites | CM-05, CM-07, CM-09 |
| ARM-013 | Establecer el manejo uniforme de **estados y errores** (carga, vacío, error, sin conexión, no autorizado, límite de uso) y las necesidades de **diagnóstico** del cliente sin datos sensibles y sin elegir proveedor | Política de estados y vista operativa | CM-08, CM-13 |
| ARM-014 | Determinar los **atributos de calidad** a examinar: rendimiento percibido, consumo de recursos, accesibilidad, idioma/regional, compatibilidad de dispositivos, seguridad y mantenibilidad | Matriz de calidad con criterios de inspección | CM-08, CM-13 |
| ARM-015 | Definir una estrategia de **pruebas futuras** (unitarias, de integración, de seguridad y de extremo a extremo conceptual) sin afirmar ejecuciones | Matriz de verificaciones planeadas | CM-03, CM-08 |
| ARM-016 | Definir la estrategia de **entrega**: entornos, matriz de versionamiento previa al desarrollo, CI/CD, firma sin secretos versionados y artefacto publicable en Google Play | Vista de entrega conceptual | CM-12, CM-15 |
| ARM-017 | Establecer la estructura SDD y el uso de **agentes de IA con permisos limitados**, con trazabilidad entre artefactos | Estructura documental y permisos | CM-01, CM-10, CM-11 |
| ARM-018 | Distinguir decisiones **Confirmadas, Propuestas y Por definir** | Tabla de decisiones vinculada a memoria | CM-04 |
| ARM-019 | Mantener **alineación con el SDD de backend** y registrar los desacuerdos como hallazgos | Tabla de alineación y reconciliación | CM-14 |
| ARM-020 | Mantener fuera las **especificaciones funcionales** y exigir aprobación humana explícita para cambiar de etapa | Verificación de exclusiones y puerta de aprobación | CM-02, CM-03, CM-12 |

## 3. Requisitos no funcionales

- **Seguridad y privacidad:** el dispositivo es no confiable; sin secretos en la app; almacenamiento seguro para credenciales; mínimo privilegio; tráfico cifrado; registros sin datos sensibles (CM-05, CM-07).
- **Calidad verificable:** todo requisito tiene criterio de inspección documental; no se afirman pruebas, compilaciones ni auditorías no ejecutadas (CM-08).
- **Experiencia y robustez:** estados uniformes, accesibilidad, español de México, formatos regionales, tolerancia a dispositivos y política de caché sin modo offline (CM-13).
- **Entrega:** configuración por entorno sin secretos versionados, matriz de versionamiento previa al desarrollo y artefacto publicable en Google Play (CM-15).
- **Gobierno:** trazabilidad bidireccional, decisiones etiquetadas y agentes con permisos limitados (CM-10, CM-11).

No hay objetivos numéricos aprobados. Las metas de rendimiento, cobertura o disponibilidad se definirán cuando exista medición y autorización (CM-08).

## 4. Arquitectura y contratos internos

- **Capas lógicas:** presentación → estado y datos → acceso a API; servicios de plataforma y puntos de extensión ML/IA solo tras interfaces propias.
- **Regla de dependencia:** las dependencias apuntan hacia abajo; la presentación no accede a red, almacenamiento ni permisos directamente.
- **Límite contractual único:** toda comunicación con el backend pasa por una sola capa de acceso; presentación y estado no conocen el transporte (CM-06).
- **Contrato:** la fuente de verdad es compartida con el backend; no se define ningún endpoint, recurso ni esquema en esta etapa. El cliente tolera campos desconocidos y responde de forma uniforme a versiones no soportadas.
- **Sesión y datos locales:** credenciales solo en almacenamiento seguro del sistema; caché no sensible con expiración e invalidación; borrado al cerrar sesión o eliminar cuenta; sin modo offline.
- **Tecnologías sustituibles:** React Native está confirmado; Expo, TypeScript y bibliotecas concretas siguen como propuestas y no deben presentarse como aprobadas (CM-04, CM-09).

Los detalles de diseño se desarrollan en `plan.md`; las tareas documentales se enumeran en `task.md`.

## 5. Criterios de aceptación

- **AC-M01:** Dado el plan, cuando se revisa la vista conceptual, entonces muestra el cliente como entorno no confiable y sin ruta directa a la persistencia (ARM-001, ARM-002).
- **AC-M02:** Dado el plan, cuando se revisan las capas, entonces existe una regla de dependencias que impide que la presentación acceda a red o almacenamiento sin interfaces (ARM-003, ARM-005).
- **AC-M03:** Dado el plan, cuando se revisa el contrato, entonces hay una política general de versionado y compatibilidad sin endpoints (ARM-004).
- **AC-M04:** Dado el plan, cuando se revisan datos locales, entonces clasifica datos y fija sesión y caché sin modo offline (ARM-006, ARM-007).
- **AC-M05:** Dado el plan, cuando se revisan capacidades transversales, entonces permisos, privacidad, eliminación de cuenta, moderación, notificaciones y ML/IA figuran como políticas o puntos de extensión, no como funcionalidad (ARM-008 a ARM-012).
- **AC-M06:** Dado el plan, cuando se revisa calidad, entonces incluye política de estados, matriz de calidad y diagnóstico futuro sin métricas inventadas (ARM-013, ARM-014).
- **AC-M07:** Dado el plan, cuando se revisa la verificación, entonces distingue revisión documental presente de pruebas técnicas futuras y no afirma compilaciones (ARM-015, ARM-016).
- **AC-M08:** Dada la trazabilidad, cuando se cruzan `spec.md`, `plan.md` y `task.md`, entonces cada ARM-001…ARM-020 tiene al menos una fase y una tarea, y ninguna tarea queda huérfana (ARM-017).
- **AC-M09:** Dadas las decisiones, cuando se revisan, entonces están etiquetadas y vinculadas a `memoria.md`, y la reconciliación con el backend está registrada (ARM-018, ARM-019).
- **AC-M10:** Dado el paquete completo, cuando se audita, entonces no existe spec funcional, pantalla, módulo, endpoint, modelo de negocio ni tarea marcada o ejecutada (ARM-020).
- **AC-M11:** Dada la puerta de aprobación, cuando se revisa, entonces permanece **pendiente** de aprobación humana (ARM-020).

## 6. Plan de pruebas

**Ahora, permitido solo como planeación:** revisión documental de coherencia, trazabilidad, permisos de agentes, alineación con el backend y ausencia de funcionalidad.

**Más adelante, solo con autorización:** pruebas reales según las tecnologías confirmadas.

| Tipo de verificación futura | Propósito | Estado |
| --- | --- | --- |
| Unitarias | Lógica del cliente aislada de la interfaz | No ejecutada |
| Integración | Capas del cliente entre sí y contra un contrato simulado o entorno de validación | No ejecutada |
| Seguridad | Dependencias, secretos, almacenamiento, tráfico y configuración | No ejecutada |
| Extremo a extremo | Recorridos clave en dispositivo o emulador | No ejecutada |

No se ejecutó ningún comando, instalación, compilación ni prueba para preparar este documento.

## 7. Riesgos, límites y deuda

- **RM-01:** convertir tecnologías propuestas (Expo, bibliotecas) en decisiones oficiales sin aprobación (CM-04).
- **RM-02:** incrustar secretos o claves privilegiadas en el paquete de la app (CM-05, CM-07).
- **RM-03:** dejar reglas de negocio autoritativas en el cliente o divergir del backend (CM-05, CM-14).
- **RM-04:** persistir datos sensibles sin protección en el dispositivo o exponerlos en registros, capturas o respaldos (CM-07).
- **RM-05:** derivar el contrato de la interfaz en lugar de acordarlo con el backend (CM-06, CM-14).
- **RM-06:** sobrediseñar con demasiadas bibliotecas o capas (CM-09).
- **RM-07:** ejecutar tareas antes de la autorización o con agentes sin restricciones efectivas (CM-03, CM-11).
- **RM-08:** rechazo o retraso en Google Play por incumplir políticas vigentes (privacidad, permisos, contenido de usuarios, eliminación de cuenta, requisitos de pruebas previas) (CM-07, CM-15). Debe verificarse con la información vigente.
- **RM-09:** fragmentación de dispositivos y versiones de Android (CM-13).
- **RM-10:** vulnerabilidades en dependencias de terceros y cadena de suministro (CM-07, CM-08).

**Deuda documental:** no existe carpeta de ADR; las decisiones se mantienen en `plan.md` y `memoria.md` (CM-04). La reconciliación RC-01 y RC-02 con el backend sigue abierta.

## Aprobación

| Estado | Revisor | Fecha | Evidencia |
|---|---|---|---|
| Borrador | — | — | Pendiente de revisión docente/equipo (puerta G-M06) |
