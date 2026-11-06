---
name: revisar-riesgos-movil
description: Revisa por inspección los riesgos del cliente móvil de UniHome: secretos en la app, datos locales, permisos, privacidad, tienda, dependencias y gobernanza.
---
# Revisar riesgos del cliente móvil

## Cuándo utilizar

En una revisión del plan de arquitectura base del cliente o al evaluar decisiones tecnológicas propuestas.

## Procedimiento (solo lectura)

1. Revisar CM-04, CM-05, CM-07, CM-09, CM-11 y CM-15 en `.specify/memory/constitution.md` (espejo `./constitution.md`).
2. Revisar los riesgos RM-01…RM-10, las fronteras y la clasificación de datos locales de `spec.md`/`plan.md`.
3. Identificar causa, impacto cualitativo, posible mitigación **futura** y decisión pendiente.
4. Distinguir tecnología **Confirmada / Propuesta / Por definir** desde `memoria.md`.
5. Entregar observaciones, sin implementar controles ni ejecutar pruebas.

No consultar servicios externos, bases de datos, credenciales ni archivos de entorno.

## Alcance vigente

La enmienda 1.2.0 extiende esta revisión a `FT-01`, `FT-02`, `FT-05` y `FT-06`. Sigue siendo documental y de solo lectura (CM-03, CM-11).
