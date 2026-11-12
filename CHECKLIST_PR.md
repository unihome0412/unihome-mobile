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
- [ ] Seis checks existentes verificados en el SHA final del PR (pendiente de run)
- [ ] APK debug de GitHub Actions verificado con SHA256 (pendiente de run)
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
