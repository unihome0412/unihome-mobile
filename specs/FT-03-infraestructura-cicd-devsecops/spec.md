# FT-03 infraestructura-cicd-devsecops — Integración continua, entrega continua y DevSecOps

**ID:** SPEC-MOV-CICD-001  
**Versión:** 1.1.0  
**Estado:** Implementado parcialmente en CI/CD; aprobación docente/equipo y publicación pendientes  
**Rector:** `../../.specify/memory/constitution.md` (CM-03, CM-07, CM-08, CM-15)  
**Specs detalladas rescatadas:** `../03-infraestructura/INFM-001-ci/`, `../03-infraestructura/INFM-002-cd/`, `../03-infraestructura/INFM-003-pipeline-devsecops/`, `../03-infraestructura/INFM-005-ambientes-secretos-observabilidad/` y `../03-infraestructura/plantillas/`.

## 1. Contexto y objetivo
Definir el pipeline de integración continua (CI), entrega continua (CD), controles de seguridad DevSecOps y gestión de ambientes/secretos del cliente móvil en **React Native**.

**Decisión histórica de despliegue (2026-11-05):** la ejecución y verificación del cliente móvil se mantenían en entorno **LOCAL**, sin activar workflows ni publicar. Se conserva como registro.

**Transición autorizada (2026-11-12):** el Scrum Master autorizó un único PR de CI/CD y DevSecOps (`AUT-SM-20261112-CICD-MOVIL`). Estado real: CI de seis checks mejorado, APK debug y AAB firmado preparados, SBOM/SCA/manifiesto implementados y publicación Play con gates **no ejecutada**. `G-M06` sigue pendiente.

## 2. Requisitos consolidados (rescatados de `INFM-001`, `INFM-002`, `INFM-003` e `INFM-005`)
- **CI (`MV-I01-R01..R12`):** 9 etapas en orden estricto (preparación con lockfile, tipos y lint, pruebas unitarias `UT-*`, pruebas de integración `IT-*` con API simulada, contrato OpenAPI, configuración sin secretos, seguridad rápida, cobertura y compilación de verificación sin firma). Plantilla inactiva: `../03-infraestructura/plantillas/ci-movil-pr.yml.example`.
- **CD (`MV-I02-R01..R14`):** Promoción controlada (`dev` → `staging` → `prod`) de artefactos `.aab`, con matriz de versionamiento `SemVer` (`MAJOR.MINOR.PATCH`) + `versionCode` entero estrictamente creciente y aprobación humana obligatoria de persona distinta al autor. Plantilla inactiva: `../03-infraestructura/plantillas/cd-play.yml.example`.
- **DevSecOps (`MV-I03-R01..R11`):** Gates de escaneo de secretos, SAST (TypeScript/React Native), SCA de dependencias npm/nativas, generación de SBOM y verificación del manifiesto de Android frente a línea base aprobada.
- **Ambientes, secretos y observabilidad (`MV-I05-R01..R11`):** Separación de ambientes (`local`, `dev`, `staging`, `prod`), cero secretos en el binario o repositorio, custodia de llave de carga y registros sanitizados sin datos personales (conservando `traceId` para soporte).

## 3. Tareas y verificación
Ver el desglose completo en:
- [INFM-001-ci/spec.md](../03-infraestructura/INFM-001-ci/spec.md) y [task.md](../03-infraestructura/INFM-001-ci/task.md)
- [INFM-002-cd/spec.md](../03-infraestructura/INFM-002-cd/spec.md) y [task.md](../03-infraestructura/INFM-002-cd/task.md)
- [INFM-003-pipeline-devsecops/spec.md](../03-infraestructura/INFM-003-pipeline-devsecops/spec.md) y [task.md](../03-infraestructura/INFM-003-pipeline-devsecops/task.md)
- [INFM-005-ambientes-secretos-observabilidad/spec.md](../03-infraestructura/INFM-005-ambientes-secretos-observabilidad/spec.md) y [task.md](../03-infraestructura/INFM-005-ambientes-secretos-observabilidad/task.md)

## Aprobación
| Estado | Revisor | Fecha | Evidencia |
|---|---|---|---|
| Borrador | — | — | Pendiente de revisión docente/equipo (G-M06 / G-M08) |
