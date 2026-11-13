# INFM-002 — Entrega continua (CD) del cliente móvil

**Versión:** 0.2.0 | **Estado:** Diseño e implementación preparatoria; publicación bloqueada y no ejecutada | **Depende de:** `../../constitution.md` (CM-03, CM-15), `INFM-001`, `INFM-003`, `INFM-004`, `INFM-005`, ADR-M004, DEC-M07 | **Lineamientos:** 8, 11, 16 | **Contraparte backend:** `INF-002-cd` (Propuesto, backend) | **Plantilla:** `plantillas/cd-play.yml.example`.

> **Transición 2026-11-12:** `android-release.yml` genera el AAB firmado y `play-publish.yml` promueve el mismo artefacto. La corrección final hace checkout del commit exacto del AAB, verifica provenance y reutiliza el `versionCode` con la API de Play. No se crearon credenciales, cuentas, environments protegidos ni lanzamientos. Las plantillas no contienen secretos ni valores reales.

## Estado de implementación (2026-11-12)

| Elemento | Estado |
|---|---|
| Ambientes GitHub | Nombres definidos (`android-release`, `play-internal`, `play-closed`, `play-production`); configuración manual pendiente |
| AAB firmado | Workflow implementado; **NO EJECUTADO** por falta de keystore y autorización |
| Mismo artefacto | El publicador descarga el AAB por `release_run_id`, hace checkout del mismo commit, verifica run/SHA256/metadata/versionCode y reutiliza el bundle; no vuelve a subir el mismo AAB |
| Promoción | API de Play por `versionCode`; solo sube un AAB nuevo a pista interna o cerrada y producción exige un versionCode en un release `completed` o `inProgress` de una pista de pruebas |
| Gates | `workflow_dispatch` desde `main`, environment, variables, `PLAY_CLOSED_TRACK` cuando aplica y confirmación; falla cerrado por defecto |
| Play Console | No probado; sin cuenta ni service account |
| Rollback | Pausar rollout o nueva versión con `versionCode` mayor; no rollback binario |

No se afirma que `bundleRelease` o la API de Play hayan sido probados.

## Propósito
Convertir un cambio aprobado en un paquete firmado y llevarlo a Google Play por pistas controladas, con versionamiento verificable y **sin ninguna publicación automática a producción**.

## Ambientes y pistas

| Ambiente | Disparador | Pista de Google Play | Aprobación |
|---|---|---|---|
| `dev` | Push/Merge a `main` con CI y seguridad verdes (futuro; condicionado a decisión de publicación) | Pruebas internas | Automática o manual según configuración (solo este ambiente) |
| `staging` | Etiqueta `mobile-vX.Y.Z-rc.N` desde `main` | Pruebas cerradas | Humana (≥1 persona) |
| `prod` | Etiqueta `mobile-vX.Y.Z` desde `main` con el mismo candidato probado | Producción (escalonada) | Humana de **persona distinta** del autor (CM-15) |

## Matriz de versionamiento (Propuesta; DEC-M07; lineamiento 11)

| Elemento | Regla propuesta |
|---|---|
| `versionName` | `MAJOR.MINOR.PATCH` (SemVer); candidatos con sufijo `-rc.N` |
| `versionCode` | Entero **estrictamente creciente** por subida: `MAJOR × 1 000 000 + MINOR × 10 000 + PATCH × 100 + build` (build 0–99). Ej.: 0.1.0 build 0 → 10 000; 1.0.0 build 5 → 1 000 005. Debe respetar el máximo que acepta Play (verificar) |
| Etiqueta git | `mobile-vX.Y.Z[-rc.N]` |
| Contrato del backend | Versión mayor soportada: `v1` (ARQM-004); cambios incompatibles = nuevo MAJOR del cliente |
| Registro | Cada lanzamiento se anota (versión, commit, pista, aprobadores, fecha) |

## Requisitos

| ID | Requisito (DEBE) | Norma |
|---|---|---|
| MV-I02-R01 | **Ningún** despliegue a producción es automático; en el modelo GitHub Flow adoptado, la promoción a `staging` y `prod` desde `main` exige aprobación humana mediante ambientes protegidos | CM-15 |
| MV-I02-R02 | El autor del cambio **no** puede aprobar su propio lanzamiento a producción | CM-15 |
| MV-I02-R03 | El artefacto (`.aab`) lo genera **solo el pipeline**, nunca un equipo local; el mismo artefacto/versión se **promueve** entre pistas (no se recompila) | CM-15, ADR-M004 |
| MV-I02-R04 | La firma usa la llave de carga guardada como secreto de ambiente, nunca en el repositorio ni en registros | MV-A02-R13 |
| MV-I02-R05 | `versionCode` nunca disminuye ni se repite; el pipeline falla si lo detecta | CM-15 |
| MV-I02-R06 | Antes de promover a `staging`/`prod` se verifica que el backend del ambiente objetivo esté listo y exponga la versión mayor de contrato soportada; la **dirección de salud es un valor en blanco** hasta acordarse | ARQM-004 |
| MV-I02-R07 | La producción usa **lanzamiento escalonado** con porcentaje inicial y ampliación por etapas; los criterios de pausa (tasa de fallos, reportes) se definen **tras medición**, sin umbrales inventados | CM-13 |
| MV-I02-R08 | La **reversión** no es un «deshacer»: se pausa o detiene el escalonado y se publica una versión corregida con `versionCode` mayor; se conservan los artefactos de las últimas versiones (cantidad por definir) | CM-15 |
| MV-I02-R09 | Cada lanzamiento incluye notas de versión en español de México, sin datos sensibles | CM-07 |
| MV-I02-R10 | Tras cada promoción se ejecuta una lista de verificación manual (instalar desde Play, recorrer F01 y F02 con una cuenta de prueba ficticia, revisar informe previo al lanzamiento y salud en la consola) | CM-08 |
| MV-I02-R11 | Las actualizaciones de código por aire (OTA) **no se adoptan** hasta contar con ADR que evalúe políticas de la tienda y control de cambios | CM-09 |
| MV-I02-R12 | Los secretos de CD (llave de carga, cuenta de servicio de Play) están separados por ambiente, con alcance mínimo, rotación y revocación documentadas | INFM-005 |
| MV-I02-R13 | Los ambientes no productivos apuntan a backends no productivos y pueden coexistir instalados con producción (ID de aplicación distinto; Propuesta, INFM-005) | THM-10 |
| MV-I02-R14 | La plantilla permanece **inactiva** (`if: false`) hasta aprobación expresa | CM-03 |

## Criterios de salida
Matriz de versionamiento aprobada (DEC-M07), ADR-M004 resuelto, ambientes y revisores definidos, custodia de secretos aprobada y G-M05 sin hallazgos bloqueantes.
