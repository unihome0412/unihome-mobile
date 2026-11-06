---
name: revisar-pipeline-play
description: Revisa las specs y plantillas de CI/CD y publicación en Google Play: inactividad, secretos, permisos, SHA, aprobaciones, versionamiento y requisitos de tienda con fuente y fecha.
---
# Revisar pipeline y publicación en Google Play

## Cuándo utilizar
Al revisar `specs/03-infraestructura/**`, `plantillas/*.example` o ADR-M004/M005.

## Procedimiento (solo lectura)
1. Confirmar plantillas **inactivas** (`if: false`), sin secretos y con marcadores para SHA.
2. Confirmar permisos mínimos, ambientes protegidos y regla autor ≠ aprobador; **sin** despliegue automático a producción.
3. Revisar la matriz de versionamiento (`versionCode` estrictamente creciente) y la promoción del mismo artefacto.
4. Revisar que cada requisito de tienda cite fuente oficial y fecha y que el calendario de la prueba cerrada figure como riesgo.
5. Reportar hallazgos con gravedad; no ejecutar nada ni asumir tiempos de revisión de Google.
