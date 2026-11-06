# ARQM-004 — Convenciones del cliente para la API

**Versión:** 0.1.0 | **Estado:** Propuesto — requiere aprobación | **Depende de:** `../../../constitution.md` (CM-06, CM-13, CM-14, CM-16), `ARQM-001`, `ARQM-003` | **Contraparte backend:** `ARQ-005-convenciones-api` (Propuesto, backend) | **Amplía:** ARM-003, ARM-004, ARM-013.

## Propósito
Que todo consumo de la API siga las mismas reglas de transporte, errores y reintentos, sin depender de una pantalla. Las rutas **no** se fijan aquí; la dirección base del servidor es un valor de ambiente **en blanco** hasta acordarse (CM-16).

## Transporte y formato (según backend, Propuesto)
| Tema | Regla del cliente |
|---|---|
| Raíz | El backend declara `/api/v1` (fuente 20-oct-2026). La **dirección base** completa es configuración de ambiente: `(en blanco)` |
| Formato | JSON camelCase, UTF-8; fechas ISO 8601 UTC; el cliente convierte a hora local solo para mostrar |
| Dinero | Decimal MXN; el cliente **nunca usa números de punto flotante** para importes (fuera de F01/F02, pero se fija aquí) |
| Paginación | `page`, `pageSize`, `total` en toda colección |
| Autorización | `Authorization: Bearer <access_token>` **solo** en rutas protegidas; nunca en la URL |
| Idioma | `Accept-Language: es-MX` (Propuesta, por acordar) |
| Versión de la app | Cabecera con la versión de la app para permitir bloqueo de versiones no soportadas (Propuesta, **por acordar** con backend) |

## Requisitos

| ID | Requisito (DEBE) | Origen |
|---|---|---|
| MV-A04-R01 | Todo acceso a la red pasa por una **capa única** que añade autorización, cabeceras comunes y manejo uniforme de errores; ninguna pantalla construye peticiones por su cuenta | CM-06 |
| MV-A04-R02 | La capa interpreta `ProblemDetails` (`type`, `title`, `status`, `traceId`, `errors`) y produce un **error de cliente tipado** con estado de interfaz y mensaje del catálogo; nunca muestra texto crudo del servidor | ARQ-005 |
| MV-A04-R03 | La capa tolera **campos desconocidos** en las respuestas y valores de enumeración desconocidos (se tratan como «desconocido» sin fallar) | CM-06 |
| MV-A04-R04 | `401` en ruta protegida activa la renovación única (ARQM-003); `401` en login significa credenciales inválidas, **no** sesión vencida | ARQ-005 |
| MV-A04-R05 | `403` y `404` se interpretan según la regla 403 vs 404 del backend; el cliente no intenta distinguir lo que el servidor oculta a propósito | ARQ-005 |
| MV-A04-R06 | `429` produce el estado `limiteDeUso`: se respeta `Retry-After` si existe, **no** hay reintento automático y el botón de acción se deshabilita durante la espera | THM-09 |
| MV-A04-R07 | `5xx` y errores de red producen `error`/`sinConexion` con opción de reintento manual; los **reintentos automáticos** solo aplican a lecturas idempotentes, con espera creciente y límite; **nunca** a solicitudes que crean o consumen (registro, confirmación, login) | CM-13 |
| MV-A04-R08 | Los tiempos de espera de red se definen **tras medición**; hasta entonces se registran como «por definir» | CM-08 |
| MV-A04-R09 | Se evita el doble envío: mientras una solicitud de escritura está pendiente, la acción queda deshabilitada | CM-13 |
| MV-A04-R10 | El cliente conserva el `traceId` del error para soporte **sin** guardarlo con datos personales; puede mostrarse como «código de soporte» solo si la decisión de producto lo aprueba | CM-07 |
| MV-A04-R11 | El cliente soporta **una sola versión mayor** del contrato (`v1`); un cambio incompatible exige nueva versión, convivencia documentada y revisión de F01/F02 | CM-15 |
| MV-A04-R12 | Los valores de ambiente (dirección base, identificadores públicos) se inyectan por configuración de compilación y no se codifican en las specs ni en el código | CM-16, INFM-005 |

## Mapeo de errores a estados de interfaz

| HTTP | Estado de interfaz | Comportamiento del cliente |
|---|---|---|
| 400 | `error` con errores por campo | Mostrar mensajes de campo del catálogo; no reenviar |
| 401 (protegida) | renovación → `noAutorizado` si falla | ARQM-003 |
| 401 (login) | `error` genérico | «Revisa tu correo y contraseña» |
| 403 | `prohibido` | Mensaje neutro; sin revelar detalle |
| 404 | `noEncontrado` | Mensaje neutro |
| 409 | `error` (conflicto) | Según spec de la funcionalidad |
| 410 | `error` (vencido) | Según spec (p. ej. código vencido) |
| 422 | `error` (regla de negocio) | Mostrar mensaje de catálogo |
| 429 | `limiteDeUso` | Respetar `Retry-After`; sin reintento automático |
| 5xx | `error` | Reintento manual |
| Sin red/tiempo agotado | `sinConexion` | Reintento manual |

## Exclusiones
Rutas, parámetros y DTOs concretos (viven en cada spec funcional); SignalR; subida de archivos.

## Referencias a pruebas
`tests/unitarias/UT-ARQM.md`, `tests/integracion/IT-F01.md`, `tests/integracion/IT-F02.md`.
