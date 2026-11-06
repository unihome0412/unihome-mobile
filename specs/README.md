# specs/ — Features SDD (FT-00…FT-0X)

> Cada feature: `spec.md` (de `_template.md`) + `plan.md` + `task.md` + `checklists/`.
> Rector: `.specify/memory/constitution.md` (CM-01, CM-10).
> Todas las features están en Borrador documental y sin tareas ejecutadas. `G-M06` sigue pendiente.

| Feature | Contenido | Estado |
|---|---|---|
| `FT-00-arquitectura-base-movil` + `01-arquitectura-base/ARQM-001..006` | Arquitectura base, seguridad (`ARQM-002` restaurado), sesión, API, UI y estrategia de pruebas | Borrador (0 tareas ejecutadas) |
| `FT-01-registro-usuario` + `02-funcionalidades/F01-registro-usuario` | Registro y confirmación de correo (`EP-M01-01..03`) | Borrador (0 tareas ejecutadas) |
| `FT-02-login-sesion` + `02-funcionalidades/F02-inicio-sesion` | Login, sesión siempre viva (`deberá`), refresh y logout (`EP-M01-04,05,08`) | Borrador (0 tareas ejecutadas) |
| `FT-03-infraestructura-cicd-devsecops` + `03-infraestructura/INFM-001..003,005` | CI/CD, DevSecOps y ambientes/secretos (rescatado e integrado; despliegue actual mantenido en **LOCAL**) | Borrador (0 tareas ejecutadas) |
| `FT-04-despliegue-google-play` + `03-infraestructura/INFM-004-despliegue-google-play` | Firma, versionado SemVer+`versionCode` y Google Play (rescatado e integrado; publicación pospuesta mientras opera en **LOCAL**) | Borrador (0 tareas ejecutadas) |
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

Crear o implementar una feature requiere cumplir CM-02 y CM-03. Las specs documentan; solo `G-M06` autoriza ejecutar.
