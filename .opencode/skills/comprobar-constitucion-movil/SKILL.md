---
name: comprobar-constitucion-movil
description: Verifica que los documentos SDD de arquitectura base del cliente móvil de UniHome respeten sus dieciséis artículos constitucionales, sin editarlos.
---
# Comprobar constitución · Móvil

## Cuándo utilizar

Al revisar cualquier archivo de `specs/FT-00-arquitectura-base-movil/` o una propuesta de cambio documental.

## Procedimiento (solo lectura)

1. Leer `.specify/memory/constitution.md` como fuente normativa (espejo `./constitution.md`); anotar CM-01…CM-16.
2. Revisar `AGENTS.md`, `memoria.md`, `spec.md`, `plan.md` y `task.md`.
3. Contrastar alcance, prioridad normativa, decisiones, política de dispositivo no confiable y veto de ejecución.
4. Devolver tabla `Artículo | Archivo/sección | Cumple/No cumple/Indeterminado | Ajuste sugerido`.
5. Informar expresamente que **no se ejecutó ninguna tarea**.

No editar documentos ni completar casillas. En caso de contradicción detener evaluación y señalarla.

## Alcance vigente

La enmienda 1.2.0 extiende esta revisión a `FT-01`, `FT-02`, `FT-05` y `FT-06`. Sigue siendo documental y de solo lectura (CM-03, CM-11).
