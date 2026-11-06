# UniHome Móvil — SDD del cliente móvil (React Native)

> Proyecto construido con **Spec Driven Development** y criterios DevSecOps.
> Fuente de verdad: `.specify/memory/constitution.md` v1.2.0 (espejo `./constitution.md`); guía operativa: `AGENTS.md`.
> Estado: arquitectura base y features funcionales en **Borrador**; **cero tareas ejecutadas** y app sin crear (2026-11-05).

## Alcance de esta entrega

El paquete establece las reglas, instrucciones para agentes y artefactos SDD de la arquitectura base y de registro, sesión, diseño y primer ingreso. Es documental: la autorización para crear la app depende de `G-M06` (CM-03).

Es el paquete **pareja** del SDD de backend (`UniHome_SDD`, v1.0.0): misma jerarquía normativa y estructura de archivos, con identificadores propios (sufijo **M**) para no colisionar (CM-14).

## Stack

| Estado | Elemento |
|---|---|
| Confirmado | **React (React Native)** consumiendo los endpoints ya implementados (`EP-M01-*`) · **Entorno actual mantenido en LOCAL** (sin publicar todavía en tienda) · Expo · TypeScript · React Navigation · TanStack Query · Zustand · Android (mínimo API 24) · API propia · MongoDB Atlas solo desde el servidor · sin modo offline · repositorios separados · SemVer + `versionCode` |
| Propuesto / Borrador | Almacenamiento seguro (`expo-secure-store`) · cliente generado desde contrato · CI/CD y firma (`FT-03`/`INFM-001..005`) · configuración de Google Play (`FT-04`/`INFM-004`, diferida para publicación futura) · diagnóstico · push vía Expo · Jest + RNTL · Funcionalidades `F03..Fn` (no redactadas a detalle; 0 tareas ejecutadas) |
| Por definir | Moderación, ML e IA generativa · decisiones `DEC-M05`, `DEC-M06`, `DEC-M09`, `DEC-M10` · aprobación docente y del equipo (`G-M06`) |

## Estructura

```text
UniHome_SDD_Movil/
├── README.md
├── constitution.md                         # Espejo de la constitución
├── AGENTS.md                               # Manual operativo vivo
├── memoria.md                              # Decisiones, propuestas, pendientes y reconciliación
├── CHECKLIST_PR.md                         # Gate documental de revisión
├── opencode.jsonc                          # Perfil OpenCode V2 de solo lectura
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
├── tests/                                  # Casos UT, IT y ST diseñados (0 ejecutados)
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
| Gate de revisión | `CHECKLIST_PR.md` | Checklist documental y gates técnicos reservados |
| Configuración OpenCode | `opencode.jsonc` | Solo lectura, sin shell ni edición |

## Subagentes y skills

Convención: `coordinador-sdd-movil` es primario y solo analiza; los subagentes revisan por especialidad. Todos leen constitución + `AGENTS.md` + `memoria.md` antes de actuar. Ninguno guarda secretos ni toca archivos de entorno o firma.

Subagentes: `arquitecto-movil` (capas y fronteras), `auditor-sdd-movil` (trazabilidad y alcance), `revisor-seguridad-movil` (riesgos y privacidad), `verificador-alineacion-backend` (comparación con backend).

Skills: `comprobar-constitucion-movil`, `auditar-trazabilidad-movil`, `revisar-riesgos-movil`, `verificar-alineacion-backend`. Las skills de implementación quedan reservadas hasta aprobar `G-M06`.

## Flujo SDD

1. Leer primero `.specify/memory/constitution.md`; después `AGENTS.md` y `memoria.md`.
2. Revisar en orden `spec.md` → `plan.md` → `task.md`.
3. Solicitar solo análisis documental. **No iniciar implementaciones, ejecutar comandos ni marcar casillas** hasta que el equipo y el docente autoricen la fase de ejecución y se actualicen formalmente las restricciones (CM-03, CM-11).
4. Registrar cualquier cambio aprobado en `memoria.md`; si altera principios, actualizar primero la constitución y reconciliar los demás artefactos (CM-12).
5. Al cerrar una fase, conciliar `spec.md`/`plan.md` con lo documentado y resolver la tabla de Aprobación.

## Cómo utilizarlo

1. Copiar la **estructura completa** a la raíz del espacio de trabajo **documental** del móvil, preservando los archivos ocultos `.opencode/` y `.specify/`. Para que `verificador-alineacion-backend` funcione, dejar la carpeta del SDD de backend como **hermana** de esta (solo lectura).
2. Leer en el orden indicado y revisar la tabla de Aprobación de `FT-00`.
3. No ejecutar tareas hasta aprobar `G-M06`.

## Compatibilidad y convenciones

- `opencode.jsonc` y los perfiles de `.opencode/agents/` usan el formato de permisos de **OpenCode V2**: arreglo ordenado de reglas `{action, resource, effect}`, donde prevalece la última regla que coincide. V2 se ejecuta como `opencode2`, separado de V1.
- **Si el equipo usa OpenCode V1**, esos permisos no aplican. V1 usa un objeto `permission` con otras claves (`bash` en lugar de `shell`, `task` en lugar de `subagent`; `edit` cubre la escritura). Adaptar y verificar antes de confiar en la restricción de solo lectura (CM-11).
- En V2 el campo `instructions` de la configuración aún no se carga; las instrucciones activas se toman de `AGENTS.md`.
- El nombre `task.md` se mantiene **deliberadamente** en singular, tal como lo solicita la actividad. La plantilla se llama `tasks-template.md` por compatibilidad con la estructura de referencia.
- `memoria.md` es un registro **versionado del proyecto**, no memoria automática de un modelo de IA.
- Ningún comando, instalación ni generación de proyecto se ejecutó para preparar este paquete.

## Referencias metodológicas (consulta)

- GitHub Spec Kit: https://github.com/github/spec-kit
- OpenCode V2 · agents: https://opencode.ai/v2/docs/agents/
- OpenCode V2 · migración desde V1: https://opencode.ai/v2/docs/migrate-v1/
- Convención AGENTS.md: https://agents.md/
- NIST SSDF: https://csrc.nist.gov/projects/SSDF
