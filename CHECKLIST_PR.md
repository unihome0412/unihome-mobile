> **Excepcion parcial CI/CD desde 2026-11-12:** aprobacion de Scrum Master registrada en `docs/gobierno/AUT-SM-20261112-CICD-MOVIL.md`. Esta checklist conserva el corte documental historico, pero los comandos y pruebas SI pueden ejecutarse por el agente `implementador-cicd-movil` despues de conciliar los specs de infraestructura. La ratificacion docente global de G-M06 sigue pendiente. Registrar evidencias y nunca marcar pruebas o tareas no ejecutadas.
# CHECKLIST_PR.md — Gate documental (1 revisor)

> Rector: `.specify/memory/constitution.md` (CM-03, CM-08, CM-12). Fase actual: documentación de arquitectura base y features funcionales; **no ejecutar comandos** hasta aprobar `G-M06`.
> Un cambio documental = 1 revisión + `memoria.md` al día. Sin evidencia no hay aprobación.

## Pre-vuelo

- [ ] `memoria.md` actualizado (estado, decisiones con porqué, errores a evitar)
- [ ] `spec.md`, `plan.md` y `task.md` conciliados y con Aprobación en **Borrador**
- [ ] Sin secretos, credenciales ni datos sensibles en documentos

## Coherencia SDD

- [ ] Trazabilidad requisito → fase → tarea completa, sin tareas huérfanas
- [ ] `FT-00` sin funcionalidad; `FT-01`…`FT-06` basadas en la maqueta y el contrato, sin endpoints inventados
- [ ] Enlaces relativos existentes y sin rutas a artefactos no creados
- [ ] Cero tareas marcadas, comandos ejecutados, pruebas, builds o publicaciones
- [ ] Coherencia con CM-01…CM-16 y alineación con backend registrada (CM-14)

## Gates técnicos (solo cuando se autoricen)

- [x] Selección de lint, typecheck, pruebas, análisis estático y CI/CD implementada dentro de la excepción (`AUT-SM-20261112-CICD-MOVIL`)
- [x] Comandos locales y resultados verificables registrados en `docs/ci-cd/EVIDENCIAS.md`
- [x] Sin afirmar cobertura, compilación ni despliegue no ejecutados
- [x] Seis checks existentes verificados en el head de código `ca5d382` del PR (run `43336338675`); el commit documental posterior se revalida en el PR
- [x] APK debug de GitHub Actions verificado con SHA256 `5311063b...f93429` (run `43336338699`, artefacto `13998820780`, 189,143,039 bytes)
- [ ] APK/AAB release firmado ejecutado (bloqueado: sin secretos ni autorización)
- [ ] Publicación en Google Play (no autorizada; no ejecutada)

## Evidencia CI/CD 2026-11-12

- [x] `AGENTS.md`, `memoria.md`, `README.md` y specs de infraestructura conciliados con el estado técnico.
- [x] Workflows con `permissions` mínimos, acciones fijadas por SHA y `persist-credentials: false`.
- [x] Gitleaks, CodeQL, SCA high/critical, SBOM CycloneDX y gate de manifiesto implementados.
- [x] Build Android debug sin secretos y build release con secretos externos preparados.
- [x] Publicación Play con gates y entorno protegido, deshabilitada por variables ausentes.
- [x] Sin secretos, keystores, cuentas de servicio ni valores reales en el repositorio.
- [ ] G-M06: sigue pendiente de ratificación docente global; este PR no la sustituye.

## Corrección final del workflow Play — 2026-11-12

- [x] `play-publish.yml` hace checkout del `head_sha` exacto del run de release antes de leer `app.json` y scripts.
- [x] Verifica run de `main`, artefacto del mismo run/SHA, metadata, SHA256, tamaño y versionCode; valida firma y manifiesto del AAB.
- [x] Reutiliza el `versionCode` ya cargado mediante la API; no usa `upload-google-play` ni vuelve a subir el mismo AAB.
- [x] `closed` usa el identificador real `PLAY_CLOSED_TRACK`; producción queda en `draft` sin `userFraction` y `staged` exige autorización y estado `inProgress`. La promoción solo cuenta releases `completed` o `inProgress` en pistas de pruebas.
- [x] Firma AAB verificada sin `jarsigner -strict` (upload key autofirmada), exigiendo `jar verified` y rechazando entradas sin firmar; release conserva el pin SHA256 del certificado.
- [x] Concurrencia de Play serializada y resumen en `RUNNER_TEMP`, sin leer archivos del checkout para el resultado.
- [x] Pruebas de workflows, promoción y provenance: 30 ejecutadas, 30 correctas; `actionlint` y `format:check` sin hallazgos.
- [ ] `play-publish.yml` ejecutado con credenciales reales y publicación verificada (NO EJECUTADO; bloqueo externo).
