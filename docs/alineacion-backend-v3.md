# Alineación con el SDD de backend v3 (CM-14)

**Fecha:** 2026-11-03 · **Fuente:** `UniHome_Backend_SDD_v3` (2026-11-02), solo lectura. Las decisiones del backend se citan como **Propuesto (backend)** porque su constitución 2.1.0 no está ratificada.

## Qué se adoptó del backend
| Tema | Adopción en el móvil | Referencia |
|---|---|---|
| Estructura de 3 bloques + `tests/` + ADR | Misma organización (`01-arquitectura-base`, `02-funcionalidades`, `03-infraestructura`) | README |
| Raíz de la API `/api/v1`, JSON camelCase, fechas ISO 8601 UTC, dinero decimal | Reglas del cliente | ARQM-004 |
| `ProblemDetails` y tabla 400/401/403/404/409/422/429/500; regla 403 vs 404 | Mapeo error → estado de interfaz | ARQM-004 |
| Login único, sin rol; código de 6 dígitos; mensaje genérico de login | Comportamiento F01 y F02 | F01, F02 |
| Plantillas inactivas `if: false`; acciones fijadas por SHA; permisos mínimos; gates y umbrales de severidad; promoción dev→staging→prod con aprobación manual | Adaptado a móvil | INFM-001…003 |
| Configuración V2 de OpenCode con `external_directory`/`execute` denegados y agentes integrados deshabilitados | `opencode.json` | AGENTS.md |

## Hallazgos abiertos
| ID | Gravedad | Fuente | Impacto en el móvil | Propuesta | Decisión requerida |
|---|---|---|---|---|---|
| ALN-01 | **Bloqueante** (G-M07) | Backend `M01` | `RegistroResponse`, `ConfirmarCorreoResponse` y el «token de sesión de registro» (EP-M01-02/03) no tienen campos ni mecanismo definidos; el cliente no puede cerrar el flujo | F01 propone un borrador (`registroToken`, `codigoExpiraEn`) marcado **Propuesto — por acordar** | Backend: definir DTO y transporte del token (DEC-M05) |
| ALN-02 | **Importante** | Backend `M01`, `M02`, HU-004 | HU-004 exige abrir Expedientes si la cuenta es administrativa, pero `LoginResponse` y `PerfilResponse` no entregan ese dato (por diseño no exponen claims) | Campo/consulta de «destino inicial» o capacidades, sin claims internos | Backend (DEC-M06) |
| ALN-03 | **Importante** | Backend `M01` EP-M01-04 | No define la respuesta de login para cuenta no confirmada | Código de error con `type` propio que no revele existencia | Backend (DEC-M09) |
| ALN-04 | **Importante** | Backend DEC-02 | Propone SQL Server/EF; el equipo confirmó MongoDB Atlas y el lineamiento 14 exige NoSQL. Condiciona el entorno de pruebas de integración y de staging | No es del cliente: escalar al responsable del backend | Equipo/PO (ADR-002 del backend) |
| ALN-05 | **Importante** | Backend ADR-006 | Instancia única; el lineamiento 15 pide ≥2 instancias. Afecta rate limit (429) y SignalR; el cliente debe tolerar 429 con `Retry-After` | Tratar el 429 de forma uniforme (ARQM-004) | Equipo/PO |
| ALN-06 | Importante | Backend DEC-09 | Mensaje ante correo duplicado: respuesta genérica (A) o 409 explícito (B); cambia la pantalla de registro | F01 define ambos escenarios condicionados | PO |
| ALN-07 | Importante | Backend DEC-10 | Registro de menores y tratamiento de datos | F01 no introduce campos adicionales hasta decisión | PO + legal |
| ALN-08 | Menor | Backend `M01` | Vigencia del access token «60 min» sujeta a revisión de seguridad; el cliente no debe codificar el valor, sino leer `expiraEn` | `expiraEn` como única fuente | — |
| ALN-09 | Menor | Backend ARQ-005 | OpenAPI solo «accesible en desarrollo»; el cliente generado desde contrato depende de ello | ADR-M003 | Backend |
| ALN-10 | Menor | Backend | Rutas con `/api/v1` frente al CRUD de apoyo del equipo (`/v1/auth/…`) | El backend v3 manda; las URLs de F01/F02 quedan en blanco | Equipo |
