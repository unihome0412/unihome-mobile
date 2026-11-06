# Memoria del proyecto UniHome Móvil · Estado documental

**Fecha de corte:** 2026-11-05  
**Ámbito:** decisiones de la **arquitectura base y de las features funcionales** del cliente móvil.  
**Naturaleza:** registro de contexto auditable, **no instrucciones superiores** a `constitution.md`.

## Decisiones confirmadas

| ID | Decisión / dato | Estado | Implicación para este paquete |
| --- | --- | --- | --- |
| MM-001 | Proyecto identificado como **UniHome** | Confirmada | Nombre de artefactos y paquete |
| MM-002 | Solución con **cliente móvil**, **backend/API** y persistencia remota | Confirmada (coincide con M-002 del backend) | Diseñar el lado cliente y su frontera con la API |
| MM-003 | Persistencia en **MongoDB Atlas**; el cliente **no** accede a ella | Confirmada (M-003 del backend + CM-05) | Sin conexión ni credenciales de base de datos en la app |
| MM-004 | Equipo de UniHome: **Jessui, Citlali, Leslie y Omar** | Confirmada | La revisión final corresponde a personas, no a agentes |
| MM-005 | La instrucción académica actual para el móvil limita el trabajo a **constitución, AGENTS, memoria, subagentes, skills y spec/plan/task de arquitectura base**, sin funcionalidad y sin ejecutar tareas | Actualizada por las enmiendas 1.1.0 y 1.2.0 | Se permiten specs documentales `FT-01`…`FT-06`; sigue prohibido ejecutar tareas sin `G-M06` |
| MM-006 | El cliente móvil se construirá con **React Native** | Confirmada (declaración del equipo) | Resuelve parcialmente el pendiente M-201 del backend; ver reconciliación |
| MM-007 | Plataforma objetivo **Android**; entregable publicable en **Google Play** | Confirmada (lineamientos 1 y 16) | Condiciona entrega y cumplimiento de políticas de la tienda |
| MM-008 | **Sin modo offline**; la caché del cliente es solo de velocidad | Confirmada (decisión del equipo) | No se adopta almacenamiento local relacional (el lineamiento 16 lo pide solo si el proyecto lo requiere) |
| MM-009 | Existe una **maqueta autorizada** que el desarrollo posterior deberá respetar (lineamiento 4) | Confirmada | La versión vigente se registra en `FT-05` (MM-019) y no se eliminan funciones sin aprobación |
| MM-010 | Existe el **SDD de backend v1.0.0 (2026-10-26)** como paquete hermano | Confirmada | Referencia de solo lectura para alinear decisiones (CM-14) |
| MM-011 | Fecha de evaluación del proyecto: **2 de diciembre de 2026** | Confirmada (lineamiento 19) | Informativa; no fija fechas en este paquete |
| MM-012 | Se adopta la organización de primeros pasos de `MovilSDD-main`: constitución canónica en `.specify/memory/` + espejo, plantillas en `.specify/templates/`, `specs/_template.md`, feature `specs/FT-00-<nombre>/` y formato de 7 secciones + Aprobación | Confirmada (instrucción del equipo) | Conserva React Native, los IDs propios y la prohibición de ejecutar |
| MM-013 | Se usa **Expo** (flujo gestionado) sobre React Native (resuelve MM-101) | Confirmada (decisión del titular, 2026-11-04) | El proyecto de código se inicializa con Expo; sigue sin autorizar ejecución por sí sola (CM-03) |
| MM-014 | Se usa **TypeScript** (resuelve MM-102) | Confirmada (decisión del titular, 2026-11-04) | Habilita tipar el cliente de API generado desde el contrato OpenAPI (MM-105) |
| MM-015 | Navegación con **React Navigation**; estado del servidor con **TanStack Query**; estado de interfaz local con **Zustand**; sin Redux (resuelve MM-201) | Confirmada (decisión del titular, 2026-11-04; criterio CM-09 simplicidad) | Define las bibliotecas base del cliente; persistencia local de la caché de TanStack Query queda en MM-103 (parcialmente pendiente) |
| MM-016 | `minSdkVersion` **24 (Android 7.0)** como versión mínima soportada (resuelve MM-202) | Confirmada (decisión del titular, 2026-11-04) | Define el rango de dispositivos objetivo y las APIs disponibles sin polyfills |
| MM-017 | Repositorios **separados** (no monorepo): `unihome-backend`, `unihome-mobile` (código) y este paquete SDD documental, dentro de una sola cuenta de GitHub (resuelve MM-203, lineamiento 18) | Confirmada (decisión del titular, 2026-11-04) | El código de `unihome-mobile` se crea en una carpeta nueva fuera de este paquete SDD, que permanece documental |
| MM-018 | Matriz de versionamiento: `versionName` en **SemVer** (`MAJOR.MINOR.PATCH`) y `versionCode` entero incremental por build, con tabla de compatibilidad contra la versión del contrato del backend (resuelve MM-207, lineamiento 11, CM-15) | Confirmada (decisión del titular, 2026-11-04) | Debe aplicarse desde el primer build publicable; registrar la tabla de compatibilidad en `plan.md` de `FT-04` |
| MM-019 | La maqueta vigente es **Pantallas móviles UniHome** en Figma Make, revisada el 2026-11-05. Es un prototipo web de referencia, no código de producción | Confirmada (Citlali, 2026-11-05) | `FT-05` registra enlace, inventario parcial y tokens observados; falta congelar versión |
| MM-020 | Revisión de segunda unidad: backend desplegado con URL, registro/login/logout y 4 endpoints más; móvil con registro/login, pantallas posteriores al primer ingreso e inicio de Google Play. Fecha indicada: 3 y 4 de noviembre de 2026 | Confirmada (hoja compartida por Citlali, 2026-11-04) | Falta confirmar si la revisión se movió o ya ocurrió |
| MM-021 | API publicada en Azure Container Apps con `EP-M01-01` a `EP-M01-05`, `EP-M01-08` y `EP-M01-09` | Confirmada (prueba en producción, 2026-11-05) | Base de `FT-01`/`F01`, `FT-02`/`F02` y `FT-06`; hoy es el único contrato implementado |
| MM-022 | **Framework y consumo de API:** Se confirma formalmente **React (React Native)** consumiendo los endpoints que ya están implementados | Confirmada (decisión de la titular, 2026-11-05) | Resuelve en definitivo el framework (`ADR-M001`) y el consumo contra el contrato implementado (`EP-M01-*`) |
| MM-023 | **Estrategia de despliegue actual:** Por ahora el proyecto móvil se mantendrá en entorno **LOCAL**; **no se va a publicar todavía** en tienda | Confirmada (decisión de la titular, 2026-11-05) | Desbloquea el trabajo local sin depender hoy del calendario de publicación en Google Play (`DEC-M01` / `DEC-M04` / `ADR-M005`), conservando documentadas `FT-03`/`FT-04` (`INFM-001..005`) |
| MM-024 | **Unificación documental SDD:** Se unificaron en una sola estructura limpia las carpetas anidadas, se restauró `specs/01-arquitectura-base/ARQM-002-seguridad-cliente/spec.md`, y se rescataron del SDD anterior la arquitectura base (`ARQM-001..006`), infraestructura CI/CD y Google Play (`INFM-001..005` / `FT-03` y `FT-04`), registro (`F01`/`FT-01`), login (`F02`/`FT-02`), `docs/` y `tests/`. Todo permanece en estado `Propuesto / Borrador` con `0` tareas ejecutadas, y `F03` en adelante no están redactadas a detalle | Confirmada (2026-11-05) | Paquete SDD completo y unificado |

### Lineamientos académicos aplicables como restricciones del cliente (fuente externa)

Fuente: *Lineamientos para el desarrollo del proyecto Móvil*, cuatrimestre septiembre–diciembre 2026. Se citan por número como **restricciones**, no como funcionalidad.

| Lineamiento | Restricción para el cliente | Dónde se aborda |
| --- | --- | --- |
| 5, 7, 8 | Spec Driven-Development y DevSecOps; pruebas unitarias, de seguridad e integración; CI/CD | ARM-015, ARM-016, ARM-017 |
| 6 | Desarrollo completo con agentes de IA (se sugiere OpenCode con Warp) | ARM-017 |
| 9 | Caché a nivel de frontend | ARM-007 |
| 10, 16 | Cierre de sesión en backend y móvil; sesión viva salvo cierre explícito | ARM-006 |
| 11 | Matriz de versionamiento previa al desarrollo, aplicada en cada despliegue | ARM-016 |
| 16 | Moderación previa de contenido; notificaciones push; aviso de privacidad vinculado a la landing; eliminación de cuenta; permisos; sesión siempre viva salvo logout (**deberá**); al menos una función de ML y de IA generativa | ARM-008 a ARM-012, CM-13 |
| 18 | Una sola cuenta de GitHub para los proyectos | MM-017 (Confirmada) |
| 19 | Proyectos ML (Machine Learning e IA Generativa) con las mismas prácticas SDD/DevSecOps que backend y móvil | ARM-012, MM-205 / DEC-M11 |
| 20 | Evaluación del proyecto (2 de diciembre) y entrega en `.rar` + script de BD (más evaluación móvil de 2ª unidad: registro/login, pantallas posteriores al primer ingreso e inicio de Google Play) | MM-011, MM-020, FT-01, FT-02, FT-04, FT-06 |

## Propuestas arquitectónicas (NO aprobadas)

| ID | Propuesta | Estado | Acción futura |
| --- | --- | --- | --- |
| MM-101 | Usar **Expo** (flujo gestionado y compilaciones de desarrollo) sobre React Native | Confirmada, ver MM-013 | — |
| MM-102 | Usar **TypeScript** | Confirmada, ver MM-014 | — |
| MM-103 | Gestionar datos del servidor con una biblioteca de consultas con caché (**TanStack Query**, resuelve la parte de consultas de MM-201); persistencia local no sensible (p. ej. MMKV) para esa caché sigue **Propuesta** | Parcialmente confirmada, ver MM-015 | Justificar y aprobar solo la biblioteca de persistencia local de caché (MMKV u otra) |
| MM-104 | Guardar credenciales de sesión en el **almacenamiento seguro del sistema** (Keystore de Android) mediante una biblioteca por definir | Propuesta: `expo-secure-store`, para mantenerse dentro de Expo; validar vigencia antes de instalar | Aprobar antes de implementar `FT-02` |
| MM-105 | Generar el cliente de la API a partir del **contrato OpenAPI** compartido con el backend | Propuesta lista para aprobar: el contrato ya existe en `/openapi/v1.json`; guardar una copia versionada porque Swagger podría desactivarse | Aprobar y resolver antes RC-03 |
| MM-106 | Notificaciones push mediante el servicio de Expo sobre FCM | Propuesta | Alinear con el backend antes de aprobar |
| MM-107 | Arquitectura en **capas con límite contractual** hacia la API | Propuesta de diseño (equivale a M-102 del backend) | Aprobar al validar el plan |
| MM-108 | Pruebas con Jest y React Native Testing Library; pruebas de extremo a extremo con una herramienta por definir | Propuesta | Definir criterios (ARM-015) |
| MM-109 | Idioma de la interfaz **español de México** con formatos regionales | Propuesta (coherente con la maqueta) | Confirmar con el equipo |

## Pendientes de decisión

| ID | Decisión pendiente | Criterio para resolver | Estado |
| --- | --- | --- | --- |
| MM-201 | Navegación y gestor de estado de interfaz | Simplicidad, mantenimiento, pruebas | Resuelto, ver MM-015 |
| MM-202 | Versión mínima de Android y dispositivos objetivo | Alcance de usuarios, costo de pruebas | Resuelto, ver MM-016 |
| MM-203 | Estructura de repositorios (monorepo o separados) dentro de una sola cuenta de GitHub | Independencia de ciclo de vida; depende de M-203 del backend | Resuelto, ver MM-017 |
| MM-204 | Herramientas de CI/CD, firma de la app y entornos de compilación | Costo, seguridad y requisitos académicos. **Propuesta:** GitHub Actions para validar, EAS Build para compilar, Play App Signing para firmar y entornos `desarrollo` y `produccion` | Propuesta; validar costos y detallar en `FT-03` y `FT-04` |
| MM-205 | Proveedor de moderación, ML e IA generativa (consumidos **a través del backend**) | Costo, privacidad y viabilidad; depende de decisiones del backend | Por definir |
| MM-206 | Estrategia de reporte de fallos y diagnóstico del cliente | Privacidad, costo, requisitos de observabilidad. **Propuesta:** para la revisión, logger sanitizado y mostrar `traceId` en errores; elegir proveedor de fallos antes de publicar | Propuesta |
| MM-207 | Formato y valores de la **matriz de versionamiento** (obligatoria antes de desarrollar) | Lineamiento 11; alinear esquema con backend | Resuelto, ver MM-018 |
| MM-208 | Aprobación del docente/equipo y autorización para ejecutar tareas | Instrucción explícita posterior | Por definir |

## Reconciliación con el SDD de backend (CM-14)

| ID | Observación | Acción | Estado |
| --- | --- | --- | --- |
| RC-01 | El backend registra **M-201 «Lenguaje/framework del cliente móvil» como Por definir** (y D-04 en su plan); este paquete confirma **React Native** (MM-006) | El equipo decide si actualiza `memoria.md` y `plan.md` del backend mediante su gobierno de cambios (C-12). **Este paquete no edita el del backend** | Abierta |
| RC-02 | Hosting y contrato ya existen: Azure Container Apps y OpenAPI. Falta alinear CI/CD y actualizar el SDD de backend | Reflejarlo en ambos paquetes mediante su gobierno de cambios | Parcial |
| RC-03 | OpenAPI publica `Gender` como entero, pero la API solo acepta `Mujer`, `Hombre` o `PrefiereNoDecir` | Corregir el documento OpenAPI; mientras tanto, ajustar el cliente | Abierta, bloquea MM-105 |
| RC-04 | Login usa `403` para correo sin confirmar y cuenta suspendida, sin un código estable | Agregar un código al error; mientras tanto, `FT-02` usa `detail` y ofrece ingresar código | Abierta |
| RC-05 | La maqueta muestra `¿Olvidaste tu contraseña?`, pero `EP-M01-06` y `EP-M01-07` no están implementados | Implementarlos en backend; la app no simula éxito | Abierta |
| RC-06 | Perfil necesita nombre y login no lo devuelve; `EP-M02-01` no está implementado | Implementar M02; mientras tanto, mostrar correo de sesión y nombre pendiente | Abierta |
| RC-07 | Perfil menciona teléfono, pero la spec M02 del backend no lo define | Decidir si se agrega al backend o se ajusta la maqueta | Abierta |
| RC-08 | La spec M01 del backend pedía token de sesión de registro; la API usa `correo` y `codigo`, aprobado el 2026-11-04 | `FT-01` usa lo implementado; confirmar en docs del backend | Por verificar |
| RC-09 | Universidades, exploración, favoritos, mensajes, notificaciones y rentas están en el SDD de backend, sin implementar | `FT-06` usa datos de ejemplo identificados; validar con el docente | Abierta |

## Historial de decisiones de este paquete

| Fecha | Versión | Cambio | Estado de ejecución |
| --- | --- | --- | --- |
| 2026-10-29 | 1.0.0 | Preparación del marco normativo y SDD de arquitectura base del cliente móvil | 0 tareas ejecutadas |
| 2026-10-29 | 1.0.0 | Alineación de estructura y formato con `MovilSDD-main`: `.specify/` (constitución canónica + plantillas), `specs/_template.md`, `specs/README.md` y `specs/FT-00-arquitectura-base-movil/` con 7 secciones + Aprobación; se conserva React Native | 0 tareas ejecutadas |
| 2026-11-04 | 1.1.0 | El titular del paquete resolvió MM-101, MM-102, MM-201, MM-202, MM-203 y MM-207 (Expo, TypeScript, React Navigation + TanStack Query + Zustand, `minSdkVersion` 24, repositorios separados, matriz de versionamiento SemVer + `versionCode`) en conversación con el asistente. Causa: desbloquear la creación del proyecto de código fuera de este paquete. Impacto: solo documental, en `memoria.md`; no se creó ni ejecutó código. **G-M06 (autorización docente/equipo) sigue Pendiente**; esta entrada no la sustituye | 0 tareas ejecutadas |
| 2026-11-05 | 1.2.0 | Se revisó la maqueta vigente y el contrato publicado. Se redactaron `FT-01`, `FT-02`, `FT-05` y `FT-06`, se agregó la enmienda 1.2.0 y se resincronizó el espejo de la constitución, que tenía 5 líneas menos. Solicitud de Citlali | 0 tareas ejecutadas |

## Errores a evitar

- No conectar una pantalla a un endpoint que solo existe en un SDD: comprobar el contrato publicado.
- No reutilizar un refresh token ni renovar en paralelo, porque el backend revoca la familia de sesiones.
- No dar por enviado un correo solo por recibir `202` en el reenvío.
- No llevar a producción cuentas demo ni datos de ejemplo de la maqueta.

## Reglas de actualización de la memoria

- No almacenar credenciales, tokens, datos personales privados ni transcripciones completas.
- Una propuesta pasa a **Confirmada** solamente con decisión humana identificable y fechada.
- Si una decisión contradice CM-01…CM-16, actualizar **primero** `constitution.md` por gobierno de cambios; después sincronizar documentos.
- No interpretar este archivo como autorización para implementar.
