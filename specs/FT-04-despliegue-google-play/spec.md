# FT-04 despliegue-google-play — Firma, versionado y configuración de Google Play

**ID:** SPEC-MOV-PLAY-001  
**Versión:** 1.0.0  
**Estado:** Borrador documental / pendiente de aprobación  
**Rector:** `../../.specify/memory/constitution.md` (CM-03, CM-07, CM-15)  
**Spec detallada rescatada:** `../03-infraestructura/INFM-004-despliegue-google-play/spec.md` y `../../docs/adr/ADR-M005-canal-de-publicacion-y-calendario-google-play.md`.

## 1. Contexto y objetivo
Documentar la configuración de Google Play Console, la matriz de versionamiento (`SemVer` + `versionCode`), la firma con Play App Signing, el formulario de Seguridad de los datos (*Data Safety*), el enlace al aviso de privacidad y eliminación de cuenta, y las reglas de pistas de prueba para cumplir el punto 3 de evaluación de segunda unidad y el lineamiento 16.

**Decisión confirmada de despliegue actual (2026-11-05):** Por ahora la aplicación se mantiene en ejecución **LOCAL** y **no se publicará todavía** en Google Play; esta especificación deja lista toda la configuración documental requerida.

## 2. Requisitos consolidados (rescatados de `INFM-004`)
- **Requisitos de tienda (`MV-I04-R01..R18`):** Nivel de API objetivo (`targetSdk` 35/36 según requisito vigente de Google Play Console), formato `.aab`, Play App Signing, política de privacidad pública en la landing, eliminación de cuenta desde la app (`EP-M01-09`) y vía web, declaración de Seguridad de los datos (nombre, correo, fecha de nacimiento, género, credenciales y tokens cifrados en tránsito) y previsión de prueba cerrada (12 testers × 14 días si la cuenta de Play Console es personal posterior a nov-2023).

## 3. Especificación completa y tareas
Ver el desglose íntegro en:
- [INFM-004-despliegue-google-play/spec.md](../03-infraestructura/INFM-004-despliegue-google-play/spec.md)
- [INFM-004-despliegue-google-play/task.md](../03-infraestructura/INFM-004-despliegue-google-play/task.md)
- [ADR-M005](../../docs/adr/ADR-M005-canal-de-publicacion-y-calendario-google-play.md)

## Aprobación
| Estado | Revisor | Fecha | Evidencia |
|---|---|---|---|
| Borrador | — | — | Pendiente de revisión docente/equipo (G-M06 / G-M08) |
