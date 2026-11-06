# Plan — FT-04 despliegue-google-play

**ID:** PLAN-MOV-PLAY-001  
**Estado:** planificación documentada, **no ejecutada** (despliegue actual mantenido en **LOCAL**, sin publicar todavía).  
**Base:** `spec.md` y `../03-infraestructura/INFM-004-despliegue-google-play/spec.md`.

## 1. Secuencia documental y de preparación
1. Mantener el desarrollo y las pruebas en entorno **LOCAL** consumiendo los endpoints existentes, tal como fue confirmado por el equipo el 2026-11-05.
2. Conservar lista la matriz de versionamiento (`versionName` en SemVer `MAJOR.MINOR.PATCH` y `versionCode` entero incremental) y la tabla de Seguridad de los datos de `INFM-004` (§6).
3. Cuando se autorice pasar de entorno local a Google Play Console, ejecutar las tareas `MV-I04-T01` a `MV-I04-T07`.
