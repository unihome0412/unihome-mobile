# FT-04 despliegue-google-play — Firma, versionado y configuración de Google Play

**ID:** SPEC-MOV-PLAY-001  
**Versión:** 1.1.0  
**Estado:** Diseño y automatización preparados; publicación no ejecutada ni probada con Play Console  
**Rector:** `../../.specify/memory/constitution.md` (CM-03, CM-07, CM-15)  
**Spec detallada rescatada:** `../03-infraestructura/INFM-004-despliegue-google-play/spec.md` y `../../docs/adr/ADR-M005-canal-de-publicacion-y-calendario-google-play.md`.

## 1. Contexto y objetivo
Documentar la configuración de Google Play Console, la matriz de versionamiento (`SemVer` + `versionCode`), la firma con Play App Signing, el formulario de Seguridad de los datos (*Data Safety*), el enlace al aviso de privacidad y eliminación de cuenta, y las reglas de pistas de prueba para cumplir el punto 3 de evaluación de segunda unidad y el lineamiento 16.

**Decisión histórica de despliegue (2026-11-05):** la aplicación se mantenía en ejecución **LOCAL** y no se publicaría todavía en Google Play. Se conserva como registro.

**Estado 2026-11-12:** existe workflow de AAB firmado y un publicador manual con environments/gates. El publicador hace checkout del commit exacto del AAB, verifica provenance y promueve por `versionCode` sin volver a subir el mismo bundle; usa `PLAY_CLOSED_TRACK` para la pista cerrada, deja producción en `draft` sin `userFraction` y exige autorización adicional para `staged`. No se crearon cuenta, credenciales, service account ni lanzamiento. La publicación sigue bloqueada por autorización, secretos y requisitos de Play Console. No se declara compatibilidad de tienda probada.

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
