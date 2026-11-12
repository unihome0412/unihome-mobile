# INFM-001 — Integración continua (CI) del cliente móvil

**Versión:** 0.1.0 | **Estado:** Propuesto — requiere aprobación; **plantilla inactiva** | **Depende de:** `../../constitution.md` (CM-03, CM-08, CM-11, CM-15), `ARQM-006`, ADR-M001, DEC-M03, DEC-M04 | **Lineamientos:** 5, 7, 8 | **Contraparte backend:** `INF-001-ci` y `INF-003` (Propuesto, backend) | **Plantilla:** `plantillas/ci-movil-pr.yml.example`.

> No se ejecuta ningún pipeline ni se crean workflows activos (CM-03). Los ejemplos de comandos son ilustrativos y dependen de los scripts que defina el proyecto una vez aprobado ADR-M001. No se fijan versiones de herramientas sin aprobar el ADR.

## Propósito
Dar retroalimentación rápida y confiable sobre cada cambio del cliente: que compile en tipos, pase pruebas y respete las políticas de seguridad **antes** de fusionar. Los escaneos de seguridad se detallan en `INFM-003`; aquí se define la estructura y el orden.

## Etapas propuestas (orden y criterio de bloqueo)

| # | Etapa | Qué verifica | Bloquea el merge |
|---|---|---|---|
| 1 | Preparación | Obtener código, preparar la versión **fija** de Node y del gestor de paquetes, instalar con *lockfile* | Sí |
| 2 | Tipos y estilo | Verificación estricta de tipos; lint con errores como fallo; formato | Sí |
| 3 | Unitarias | `tests/unitarias` (`UT-*`) | Sí |
| 4 | Integración / componente | `tests/integracion` (`IT-*`) con API simulada fiel al contrato | Sí |
| 5 | Contrato | Tipos del cliente frente al OpenAPI del backend (cuando exista; ADR-M003) | Sí (cuando exista) |
| 6 | Configuración | Sin secretos; solo valores públicos por ambiente; sin direcciones de producción en ambientes de prueba | Sí |
| 7 | Seguridad rápida | Secretos, dependencias, SAST y gate de manifiesto (ver `INFM-003`) | Sí según umbral |
| 8 | Cobertura | Medir y publicar; umbrales por riesgo (`ARQM-006`) | Según umbral aprobado |
| 9 | Empaquetado y compilación de verificación | Empaquetado Expo (`dry-run`) en PR hacia `main` y push a `main`. La compilación de un paquete Android nativo de release sin firma queda pendiente de ADR-M004. | El check Expo debe ser obligatorio mediante Branch Protection o Rulesets. La compilación nativa queda condicionada a ADR-M004. |

## Requisitos

| ID | Requisito (DEBE) | Norma |
|---|---|---|
| MV-I01-R01 | El CI sigue el modelo **GitHub Flow** (`feature/*` → PR → `main`): corre en `pull_request` hacia `main`, en `push` a `main` y por demanda (`workflow_dispatch`); no existe rama `develop`; **nunca** ejecuta código de forks con secretos ni usa `pull_request_target` para compilar código de terceros | CM-15, THM-07 |
| MV-I01-R02 | Cada workflow declara `permissions` mínimos (lectura de contenido por defecto) y eleva por *job* solo lo necesario | THM-07 |
| MV-I01-R03 | Toda acción de terceros se fija por **SHA completo de commit**; su actualización requiere revisión humana | THM-07, INFM-003 |
| MV-I01-R04 | Las versiones de Node, del gestor de paquetes y del SDK se leen de archivos versionados y se **fijan** (sin `latest`); la instalación usa el *lockfile* de forma determinista | CM-09, ADR-M001 |
| MV-I01-R05 | Las etapas siguen el orden de la tabla y **no** se ocultan fallos (`continue-on-error` o equivalentes prohibidos en etapas que bloquean) | CM-08 |
| MV-I01-R06 | La caché de dependencias se indexa por el hash del *lockfile* y nunca contiene secretos; los artefactos tienen retención corta | THM-06 |
| MV-I01-R07 | Se cancelan ejecuciones obsoletas del mismo PR (control de concurrencia) para ahorrar minutos | CM-09 |
| MV-I01-R08 | La rama principal `main` exige que los checks de CI estén verdes y cuente con revisión humana mediante Pull Request; los controles no pueden omitirse ni evadirse, incluso por administradores, salvo excepción documentada y aprobada conforme a las normas del proyecto (requiere configuración administrativa de Branch Protection o Rulesets en GitHub) | CM-12 |
| MV-I01-R09 | Los resultados (pruebas, cobertura, hallazgos) se publican en el PR y quedan accesibles; no se versionan reportes con datos sensibles | CM-07 |
| MV-I01-R10 | Se registra el consumo de minutos de CI; si el repositorio es privado y los minutos gratuitos son limitados (verificar), se prioriza lo esencial por PR y lo costoso en ejecuciones hacia `main` | DEC-M03 |
| MV-I01-R11 | La compilación nativa de verificación no firma ni publica y no usa secretos de firma | CM-15 |
| MV-I01-R12 | La plantilla permanece **inactiva** (`if: false`) hasta aprobación expresa del equipo/docente | CM-03 |

## Criterios de salida
Plantilla revisada, etapas y umbrales aprobados, versión de herramientas fijada por ADR-M001, y definición de DEC-M03/M04 para repositorios y minutos.
