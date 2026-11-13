# specs/ — Features SDD (FT-00…FT-0X)

> Cada feature: `spec.md` (de `_template.md`) + `plan.md` + `task.md` + `checklists/`.
> Rector: `.specify/memory/constitution.md` (CM-01, CM-10).
> Las features funcionales siguen en Borrador. FT-03/FT-04 tienen implementación CI/CD parcial desde el 2026-11-12; `G-M06` sigue pendiente de ratificación global.

| Feature | Contenido | Estado |
|---|---|---|
| `FT-00-arquitectura-base-movil` + `01-arquitectura-base/ARQM-001..006` | Arquitectura base, seguridad (`ARQM-002` restaurado), sesión, API, UI y estrategia de pruebas | Borrador (0 tareas ejecutadas) |
| `FT-01-registro-usuario` + `02-funcionalidades/F01-registro-usuario` | Registro y confirmación de correo (`EP-M01-01..03`) | Borrador (0 tareas ejecutadas) |
| `FT-02-login-sesion` + `02-funcionalidades/F02-inicio-sesion` | Login, sesión siempre viva (`deberá`), refresh y logout (`EP-M01-04,05,08`) | Borrador (0 tareas ejecutadas) |
| `FT-03-infraestructura-cicd-devsecops` + `03-infraestructura/INFM-001..003,005` | CI/CD, DevSecOps y ambientes/secretos | Implementado parcialmente; seis checks ejecutados en GitHub, aprobación global pendiente |
| `FT-04-despliegue-google-play` + `03-infraestructura/INFM-004-despliegue-google-play` | Firma, versionado SemVer+`versionCode` y Google Play | Automatización preparada con provenance y promoción por `versionCode`; publicación no ejecutada |
| `FT-05-diseno-figma-ui` | Maqueta vigente y sistema de diseño | Borrador, inventario parcial |
| `FT-06-primer-ingreso` | Pantallas posteriores al primer ingreso | Borrador (0 tareas ejecutadas) |
| `F03..Fn` (resto de funcionalidades de la maqueta) | Funcionalidades posteriores de estudiante, arrendador y administrador | Propuesto / Borrador (no redactadas a detalle; 0 tareas ejecutadas) |

Estructura por feature:

```text
specs/FT-00-nombre/
├── spec.md
├── plan.md
├── task.md
└── checklists/
    └── checklist.md
```

Crear o implementar una feature requiere cumplir CM-02 y CM-03. La excepción CI/CD del 2026-11-12 solo cubre infraestructura de entrega; el resto sigue sujeto a `G-M06`.
