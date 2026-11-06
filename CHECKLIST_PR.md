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

- [ ] Selección de lint, typecheck, pruebas, análisis estático y CI/CD aprobada
- [ ] Comandos y resultados verificables registrados con evidencia
- [ ] Sin afirmar cobertura, compilación ni despliegue no ejecutados
