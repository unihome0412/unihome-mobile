# Tasks Template — FT-0X

> 1 PR = 1 slice. Orden: Model → Repository → UseCase → ViewModel/Store → Screen → Route → DI → Tests → Gates.
> Salida: `specs/FT-0X-<nombre>/task.md` (singular por requisito académico).
> En arquitectura base las tareas son documentales y permanecen en `[ ]` (CM-03).

- [ ] Model + interfaz Repository (capa de dominio)
- [ ] Implementación real (capa de datos), sin fake en producción
- [ ] UseCase + validación pura
- [ ] ViewModel/Store (`UiState` + evento, pruebas con `runTest`)
- [ ] Screen + preview + estado de ciclo de vida
- [ ] Route tipada + navegación centralizada
- [ ] DI / composición explícita
- [ ] Tests Unit/Security/Contract + umbral de cobertura aprobado
- [ ] `CHECKLIST_PR.md` + `memoria.md` + tag `vX.Y.Z-ftN`
