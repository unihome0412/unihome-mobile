---
name: auditar-trazabilidad-movil
description: Inspecciona enlaces ARM a fases FM y tareas TM para detectar huecos o tareas huérfanas en el SDD de arquitectura base del cliente móvil.
---
# Auditar trazabilidad SDD · Móvil

## Cuándo utilizar

Cuando se desee asegurar la coherencia entre `spec.md`, `plan.md` y `task.md`.

## Procedimiento (solo lectura)

1. Extraer los identificadores ARM-001…ARM-020 de `spec.md`.
2. Comparar con fases FM-01…FM-06 en `plan.md` y tareas TM-001…TM-019 en `task.md`.
3. Revisar ambos sentidos: requisito sin tarea, tarea sin requisito, tarea sin fase o dependencia inexistente.
4. Comprobar la tabla de rastreo de `task.md` contra los campos `Req.` de cada tarea.
5. Comprobar el estado `[ ]` de todas las tareas.
6. Emitir informe con hallazgos reproducibles y correcciones **propuestas, no aplicadas**.

No generar archivos de nuevas funcionalidades, realizar cambios ni ejecutar pruebas.

## Alcance vigente

La enmienda 1.2.0 extiende esta revisión a `FT-01`, `FT-02`, `FT-05` y `FT-06`. Sigue siendo documental y de solo lectura (CM-03, CM-11).
