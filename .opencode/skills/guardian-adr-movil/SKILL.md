---
name: guardian-adr-movil
description: Verifica que las decisiones técnicas del cliente móvil tengan ADR y que ninguna propuesta se trate como aprobada.
---
# Guardián de ADR · Móvil

## Cuándo utilizar
Al detectar una elección tecnológica (biblioteca, almacenamiento, compilación, canal de publicación).

## Procedimiento (solo lectura)
1. Comprobar que existe un ADR en `docs/adr/` o una decisión en `docs/decisiones-pendientes.md`.
2. Verificar estado (Propuesto/Confirmado), alternativas, consecuencias y criterios de aprobación sin marcar.
3. Señalar cualquier spec o tarea que presuponga una decisión no aprobada.
4. Reportar; no crear ni editar ADR.
