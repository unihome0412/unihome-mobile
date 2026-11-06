# Spec · Arquitectura base del cliente móvil de UniHome

**ID:** ARQM-001 (antes SPEC-MOV-ARQ-000)  
**Versión:** 1.1.0  
**Estado:** definida documentalmente / pendiente de aprobación  
**Depende de:** `../../../constitution.md` (2.0.0)  
**Etapa:** solo especificación; ninguna tarea ejecutada.

## 1. Propósito

Definir **qué** propiedades debe satisfacer la **arquitectura base del cliente móvil**, con independencia de módulos, pantallas, historias de usuario o procesos de negocio. La implementación no forma parte de este documento. Esta spec es la contraparte del lado cliente de `ARQ-001` del backend v3 y la base de las demás specs: `ARQM-002…006`, `INFM-001…005`, `F01` y `F02`.

## 2. Alcance

**Incluye:** capas internas del cliente, frontera con la API, política de datos locales y caché, gestión de sesión como política, permisos del dispositivo, privacidad, puntos de extensión para moderación, notificaciones y capacidades de ML/IA, configuración por entorno, calidad, estrategia de pruebas, entrega a Google Play, gobierno documental y alineación con el backend.

**Excluye explícitamente:** módulos y pantallas, flujos de usuario, reglas de negocio, contratos o endpoints concretos, modelos de dominio, diseño visual, código, scripts, creación de proyectos, pruebas ejecutadas, compilaciones y publicaciones. Las funcionalidades autorizadas (F01 y F02) viven en `specs/02-funcionalidades/` con su propia triada y **no forman parte de esta spec**.

## 3. Línea base y supuestos

- **Confirmado:** cliente móvil en **React Native** para **Android/Google Play** (sujeto a `targetSdk` 36, MM-016), backend/API propio, persistencia en MongoDB Atlas accesible solo desde el servidor, **sin modo offline** (`memoria.md`: MM-002, MM-003, MM-006, MM-007, MM-008).
- **Propuesto, no aprobado:** Expo, TypeScript, biblioteca de consultas con caché, almacenamiento seguro, cliente generado desde contrato, push vía servicio de Expo, estrategia de pruebas (MM-101 a MM-109).
- **No confirmado:** navegación y estado de interfaz, versión mínima de Android, repositorios, CI/CD y firma, proveedores de moderación/ML/IA, diagnóstico de fallos, matriz de versionamiento (DEC-M01 a DEC-M12 en `docs/decisiones-pendientes.md`).
- **Supuesto de modelado, no decisión de despliegue:** representar las capas del cliente como separadas aunque se alojen en un mismo proyecto.

## 4. Requisitos arquitectónicos verificables

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

## 5. Criterios de aceptación de **esta especificación documental**

- **AC-M01:** el plan muestra al cliente como entorno no confiable y sin ruta directa a la persistencia (ARM-001, ARM-002).
- **AC-M02:** el plan describe las capas del cliente y una regla de dependencias que impide que la presentación acceda a red o almacenamiento sin pasar por interfaces (ARM-003, ARM-005).
- **AC-M03:** el plan contiene una política general de contrato y compatibilidad sin endpoints (ARM-004).
- **AC-M04:** el plan clasifica datos locales y fija la política de sesión y caché sin modo offline (ARM-006, ARM-007).
- **AC-M05:** el plan cubre permisos, privacidad, eliminación de cuenta, moderación, notificaciones y ML/IA como políticas o puntos de extensión, no como funcionalidad (ARM-008 a ARM-012).
- **AC-M06:** el plan incluye política de estados, matriz de calidad y diagnóstico futuro sin métricas inventadas (ARM-013, ARM-014).
- **AC-M07:** el plan distingue verificaciones documentales presentes de las pruebas técnicas futuras y describe la entrega sin afirmar compilaciones (ARM-015, ARM-016).
- **AC-M08:** todas las filas ARM-001…ARM-020 tienen al menos una fase y una tarea; ninguna tarea queda sin requisito (ARM-017).
- **AC-M09:** las decisiones están etiquetadas y vinculadas a `memoria.md`; la reconciliación con el backend está registrada (ARM-018, ARM-019).
- **AC-M10:** esta spec no contiene pantallas, módulos, endpoints ni modelos de negocio, y ninguna tarea del paquete está marcada o ejecutada; las únicas funcionalidades documentadas son F01 y F02 (ARM-020, CM-02).
- **AC-M11:** la puerta de autorización final se mantiene **pendiente** de aprobación (ARM-020).

## 6. Riesgos iniciales a evaluar (no mitigaciones realizadas)

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

## 7. Especificaciones derivadas (v2)

| Spec | Tema | Requisitos |
|---|---|---|
| `ARQM-002` | Seguridad del cliente | `MV-A02-R01…` |
| `ARQM-003` | Sesión, estado y datos | `MV-A03-R01…` |
| `ARQM-004` | Convenciones cliente–API | `MV-A04-R01…` |
| `ARQM-005` | Convenciones de interfaz, formularios y accesibilidad | `MV-A05-R01…` |
| `ARQM-006` | Estrategia de pruebas | `MV-A06-R01…` |
| `INFM-001…005` | CI, CD, DevSecOps, Google Play, ambientes | `MV-I01…I05-R..` |
| `F01`, `F02` | Registro de usuario; inicio de sesión | `MV-F01-R..`, `MV-F02-R..` |

## 8. Condición de salida

Una aprobación posterior del equipo/docente debe confirmar consistencia, decisiones pendientes, reconciliación con el backend y límite de alcance. **No hay autorización de programación en este documento.**
