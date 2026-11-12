# UniHome Móvil — SDD del cliente móvil (React Native)

> Proyecto construido con **Spec Driven Development** y criterios DevSecOps.
> Fuente de verdad: `.specify/memory/constitution.md` v1.3.0 (espejo `./constitution.md`); guía operativa: `AGENTS.md`.
> Estado técnico (2026-11-12): la app React Native existe, el CI conserva sus seis checks y se preparó build Android debug, release firmado y publicación controlada sin ejecutar publicación. `G-M06` sigue pendiente de ratificación docente global.
> Las afirmaciones históricas de "cero tareas ejecutadas" y "app sin crear" describen el corte del **2026-11-05**; no el estado técnico actual.

## Alcance de esta entrega

El repositorio contiene el SDD de arquitectura base, las features funcionales y la implementación del cliente móvil. La excepción de equipo del **12/11/2026** autoriza exclusivamente trabajo de CI/CD, DevSecOps, pruebas y build Android en `feature/mobile-cicd-android-delivery`; no autoriza cambios funcionales ni publicación. La aprobación global `G-M06` permanece pendiente.

Es el paquete **pareja** del SDD de backend (`UniHome_SDD`, v1.0.0): misma jerarquía normativa y estructura de archivos, con identificadores propios (sufijo **M**) para no colisionar (CM-14).

## Stack

| Estado | Elemento |
|---|---|
| Confirmado | **React Native** consumiendo los endpoints implementados (`EP-M01-*`) · **sin publicar todavía en tienda** · Expo SDK 58 · TypeScript strict · React Navigation · Android (API 36 objetivo, API 24 mínimo generado) · API propia · MongoDB Atlas solo desde el servidor · sin modo offline · repositorios separados · SemVer + `versionCode` |
| Implementado sin ejecutar / verificado parcialmente | CI de seis checks · Gitleaks, CodeQL, SCA, SBOM y dry-run Expo JS · build Android debug con artefacto · workflow AAB firmado con secretos de environment · publicación Play con gates, **sin ejecutar** |
| Propuesto / Borrador | Cliente generado desde contrato · configuración de Google Play (`FT-04`/`INFM-004`, sin publicar) · diagnóstico · push vía Expo · pruebas de UI/integración reales (las 13 pruebas actuales son de seguridad) · funcionalidades `F03..Fn` |
| Por definir | Moderación, ML e IA generativa · decisiones `DEC-M05`, `DEC-M06`, `DEC-M09`, `DEC-M10` · aprobación docente y del equipo (`G-M06`) · cuentas y credenciales de Play |

## Estructura

```text
UniHome_SDD_Movil/
├── README.md
├── constitution.md                         # Espejo de la constitución
├── AGENTS.md                               # Manual operativo vivo
├── memoria.md                              # Decisiones, propuestas, pendientes y reconciliación
├── CHECKLIST_PR.md                         # Gate documental de revisión
├── opencode.jsonc                          # Reglas globales; excepción del agente CI/CD
├── package.json                            # Scripts de app, pruebas y validadores
├── app.json                                # Identidad Android, versión y permisos bloqueados
├── src/                                    # Cliente React Native existente
├── __tests__/security/                     # 13 pruebas Jest de seguridad
├── scripts/                                # Validadores de workflows, manifiesto, SBOM y artefactos
├── .github/
│   ├── workflows/ci.yml                    # Seis checks obligatorios
│   ├── workflows/android-build.yml         # APK debug sin secretos
│   ├── workflows/android-release.yml       # AAB firmado, manual y protegido
│   ├── workflows/play-publish.yml          # Publicación controlada, deshabilitada por defecto
│   ├── workflows/scheduled-security.yml    # SCA/SBOM semanal
│   └── dependabot.yml
├── docs/ci-cd/                             # Runbook, entornos y evidencias
├── .specify/
│   ├── memory/
│   │   └── constitution.md                 # Constitución canónica (CM-01…CM-16)
│   └── templates/
│       ├── spec-template.md                # 7 secciones + Aprobación
│       ├── plan-template.md
│       ├── tasks-template.md               # Salida: task.md (singular)
│       └── checklist-template.md
├── specs/
│   ├── README.md                           # Convención FT-00…FT-0X
│   ├── _template.md                        # Copia física de spec-template.md
│   ├── FT-00-arquitectura-base-movil/
│   │   ├── spec.md                         # ARM-001…ARM-020
│   │   ├── plan.md                         # Diseño y fases FM-01…FM-06
│   │   ├── task.md                         # TM-001…TM-019, sin ejecutar
│   │   └── checklists/
│   │       └── checklist.md
│   ├── FT-01-registro-usuario/             # Registro y confirmación (con endpoints reales)
│   ├── FT-02-login-sesion/                 # Login, sesión siempre viva (deberá) y cierre
│   ├── FT-03-infraestructura-cicd-devsecops/ # CI/CD y DevSecOps integrados
│   ├── FT-04-despliegue-google-play/       # Firma, versionado y Google Play integrados
│   ├── FT-05-diseno-figma-ui/              # Maqueta y diseño
│   ├── FT-06-primer-ingreso/               # Pantallas posteriores al ingreso
│   ├── 01-arquitectura-base/               # ARQM-001 a ARQM-006 (incluye ARQM-002/spec.md restaurado)
│   ├── 02-funcionalidades/                 # F01-registro-usuario y F02-inicio-sesion (Gherkin + contratos)
│   └── 03-infraestructura/                 # INFM-001 a INFM-005 + plantillas CI/CD inactivas
├── docs/                                   # ADR-M001..M005, decisiones-pendientes, amenazas, trazabilidad
├── tests/                                  # Casos UT, IT y ST diseñados; aún no automatizados
└── .opencode/
    ├── agents/
    │   ├── coordinador-sdd-movil.md        # primario
    │   ├── arquitecto-movil.md             # subagente
    │   ├── auditor-sdd-movil.md            # subagente
    │   ├── revisor-seguridad-movil.md      # subagente
    │   └── verificador-alineacion-backend.md
    └── skills/
        ├── comprobar-constitucion-movil/SKILL.md
        ├── auditar-trazabilidad-movil/SKILL.md
        ├── revisar-riesgos-movil/SKILL.md
        └── verificar-alineacion-backend/SKILL.md
```

## Componentes SDD

| Componente | Ruta | Propósito |
|---|---|---|
| Constitución canónica | `.specify/memory/constitution.md` | Principios no negociables; manda ante conflicto |
| Constitución espejo | `./constitution.md` | Copia bit a bit de la canónica |
| Guía de agentes | `AGENTS.md` | Cómo trabajar; la constitución dice qué no se negocia |
| Plantillas | `.specify/templates/` + `specs/_template.md` | Spec/plan/task/checklist canónicas |
| Spec de arquitectura base | `specs/FT-00-arquitectura-base-movil/spec.md` | Requisitos ARM verificables por inspección |
| Plan de arquitectura base | `specs/FT-00-arquitectura-base-movil/plan.md` | Diseño lógico, políticas, decisiones y fases |
| Tareas | `specs/FT-00-arquitectura-base-movil/task.md` | 19 tareas documentales en `[ ]` |
| Features funcionales | `specs/FT-01-*`, `FT-02-*`, `FT-05-*`, `FT-06-*` | Requisitos, plan y tareas de la revisión móvil |
| Memoria | `memoria.md` | Estado, decisiones con porqué y errores a evitar |
| Gate de revisión | `CHECKLIST_PR.md` | Checklist documental y evidencia técnica |
| Configuración OpenCode | `opencode.jsonc` + `.opencode/agents/` | Coordinador de solo lectura; excepción CI/CD con `edit/shell: ask` |
| CI/CD | `.github/workflows/` | Seis checks, APK debug, AAB release y publicación Play con gates |
| Runbook de entrega | `docs/ci-cd/` | Reproducción local, entornos, secretos por nombre y activación de Play |

## Subagentes y skills

Convención: `coordinador-sdd-movil` es primario y solo analiza; los subagentes revisan por especialidad. Todos leen constitución + `AGENTS.md` + `memoria.md` antes de actuar. Ninguno guarda secretos ni toca archivos de entorno o firma.

Subagentes: `arquitecto-movil` (capas y fronteras), `auditor-sdd-movil` (trazabilidad y alcance), `revisor-seguridad-movil` (riesgos y privacidad), `verificador-alineacion-backend` (comparación con backend). El agente primario `implementador-cicd-movil` opera solo CI/CD con aprobación por operación.

Skills: `comprobar-constitucion-movil`, `auditar-trazabilidad-movil`, `revisar-riesgos-movil`, `verificar-alineacion-backend`, `revisar-pipeline-play`, `revisar-contrato-cliente`, `guardian-adr-movil`.

## Flujo SDD

1. Leer primero `.specify/memory/constitution.md`; después `AGENTS.md` y `memoria.md`.
2. Revisar en orden `spec.md` → `plan.md` → `task.md`.
3. El coordinador documental no implementa. La excepción vigente permite al agente `implementador-cicd-movil` editar y ejecutar únicamente CI/CD, DevSecOps, pruebas y build Android; toda otra ejecución sigue requiriendo autorización (CM-03, CM-11).
4. Registrar cualquier cambio aprobado en `memoria.md`; si altera principios, actualizar primero la constitución y reconciliar los demás artefactos (CM-12).
5. Al cerrar una fase, conciliar `spec.md`/`plan.md` con lo documentado y resolver la tabla de Aprobación sin firmar por terceros.

## CI/CD implementado (2026-11-12)

| Elemento | Estado real |
|---|---|
| CI de seis checks | Implementado en `.github/workflows/ci.yml`; nombres protegidos conservados |
| Node y lockfile | Node `22.23.5` en `.nvmrc`; `npm ci --legacy-peer-deps` con `package-lock.json` |
| Pruebas | 13 pruebas Jest de seguridad ejecutadas localmente; cobertura global medida y umbral mínimo |
| DevSecOps | Gitleaks, CodeQL, `npm audit` high/critical, SBOM CycloneDX, validador de workflows y gate de manifiesto |
| APK debug | `.github/workflows/android-build.yml`; Expo CNG + Gradle, sin secretos de producción |
| AAB firmado | `.github/workflows/android-release.yml`; manual, environment `android-release`, secretos externos, sin credenciales en el repositorio |
| Publicación Play | `.github/workflows/play-publish.yml`; manual, gates por variable/secreto y entorno, **no ejecutada** |
| Docker / EAS cloud | No utilizados |

Evidencia real del 2026-11-12: CI [`43311255547`](https://github.com/unihome0412/unihome-mobile/actions/runs/43311255547) y APK debug [`43311253954`](https://github.com/unihome0412/unihome-mobile/actions/runs/43311253954), ambos `success` sobre el head `ecd6960`. La reproducción local, los nombres de secretos y la activación de Play están en [`docs/ci-cd/README.md`](docs/ci-cd/README.md); el detalle de artefactos está en [`docs/ci-cd/EVIDENCIAS.md`](docs/ci-cd/EVIDENCIAS.md).

## Cómo utilizarlo

1. Copiar la **estructura completa** a la raíz del espacio de trabajo **documental** del móvil, preservando los archivos ocultos `.opencode/` y `.specify/`. Para que `verificador-alineacion-backend` funcione, dejar la carpeta del SDD de backend como **hermana** de esta (solo lectura).
2. Leer en el orden indicado y revisar la tabla de Aprobación de `FT-00`.
3. Para CI/CD, usar solo el agente habilitado y la rama del PR de infraestructura. Cualquier trabajo fuera de esa excepción sigue bloqueado por `G-M06`.

## Compatibilidad y convenciones

- `opencode.jsonc` y los perfiles de `.opencode/agents/` usan el formato de permisos de **OpenCode V2**: arreglo ordenado de reglas `{action, resource, effect}`, donde prevalece la última regla que coincide. V2 se ejecuta como `opencode2`, separado de V1.
- **Si el equipo usa OpenCode V1**, esos permisos no aplican. V1 usa un objeto `permission` con otras claves (`bash` en lugar de `shell`, `task` en lugar de `subagent`; `edit` cubre la escritura). Adaptar y verificar antes de confiar en la restricción de solo lectura (CM-11).
- En V2 el campo `instructions` de la configuración aún no se carga; las instrucciones activas se toman de `AGENTS.md`.
- El nombre `task.md` se mantiene **deliberadamente** en singular, tal como lo solicita la actividad. La plantilla se llama `tasks-template.md` por compatibilidad con la estructura de referencia.
- `memoria.md` es un registro **versionado del proyecto**, no memoria automática de un modelo de IA.
- El corte documental del 2026-11-05 no ejecutó comandos. Desde el 2026-11-12 se ejecutaron instalación, tipos, lint, pruebas, export JS y validadores dentro de la excepción CI/CD; los runs y artefactos reales se registran en `docs/ci-cd/EVIDENCIAS.md`.

## Referencias metodológicas (consulta)

- GitHub Spec Kit: https://github.com/github/spec-kit
- OpenCode V2 · agents: https://opencode.ai/v2/docs/agents/
- OpenCode V2 · migración desde V1: https://opencode.ai/v2/docs/migrate-v1/
- Convención AGENTS.md: https://agents.md/
- NIST SSDF: https://csrc.nist.gov/projects/SSDF
