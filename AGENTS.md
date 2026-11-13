> **ENMIENDA VIGENTE DE CI/CD (2026-11-12):** la autorizacion de Scrum Master se registra en `docs/gobierno/AUT-SM-20261112-CICD-MOVIL.md` y en la constitucion v1.3.0. El agente `implementador-cicd-movil` puede realizar exclusivamente CI/CD, DevSecOps, pruebas y build Android en un PR con aprobacion `ask` por operacion. La prohibicion de ejecutar de este documento sigue vigente para el coordinador documental, los demas agentes y cualquier trabajo fuera de la excepcion. G-M06 sigue pendiente de ratificacion docente general. Toda afirmacion antigua de "cero tareas" describe el corte del 2026-11-05, NO el estado tecnico actual. Antes de cambiar codigo o workflows, reconciliar spec/plan/task de FT-03/FT-04 e INFM-001..005 con los cambios ya presentes.
# AGENTS.md — UniHome Móvil (SDD)

> Rector: `.specify/memory/constitution.md` (espejo `./constitution.md`). Ante conflicto, manda la constitución (CM-01).
> Este archivo dice cómo trabajar; la constitución dice qué no se negocia.
> **Estado técnico (2026-11-12):** la app React Native existe; el CI conserva sus seis checks; el build Android debug, el AAB firmado y la publicación Play están preparados sin publicar. Las frases históricas "cero tareas" y "app sin crear" corresponden al corte del **2026-11-05**. `G-M06` sigue pendiente de ratificación docente global.

## 1. Forma de trabajo

Stack confirmado: **React Native** para **Android / Google Play**, backend/API propio, persistencia en MongoDB Atlas solo desde el servidor y **sin modo offline** (MM-002, MM-003, MM-006, MM-007, MM-008). Expo, TypeScript, React Navigation, TanStack Query y Zustand están **Confirmados** (MM-013 a MM-015). El resto de bibliotecas sigue como **Propuesta** (CM-04).

Orden obligatorio de lectura:

1. `.specify/memory/constitution.md` — máxima autoridad documental (CM-01).
2. `memoria.md` — estado de decisiones y datos confirmados.
3. `specs/FT-00-arquitectura-base-movil/spec.md` — requisitos.
4. `specs/FT-00-arquitectura-base-movil/plan.md` — aproximación técnica.
5. `specs/FT-00-arquitectura-base-movil/task.md` — actividades sin ejecutar.
6. `specs/README.md` — índice de features.
7. Por feature, en este orden: `spec.md` → `plan.md` → `task.md`.
   - `FT-05-diseno-figma-ui`: maqueta vigente, inventario y tokens.
   - `FT-01-registro-usuario`: registro y confirmación de correo.
   - `FT-02-login-sesion`: login, sesión y cierre.
   - `FT-06-primer-ingreso`: pantallas posteriores al primer ingreso.
   - `FT-03` y `FT-04`: autorizadas por la constitución, todavía sin redactar.

Un cambio documental = revisión + aprobación humana + `memoria.md` al día. Nada fuera de la constitución sin excepción documentada (CM-12). Sin secretos y sin `TODO/FIXME` sin issue. Mientras `G-M06` siga pendiente: sin código y sin comandos.

## 2. Memoria

Plantilla canónica: `.specify/templates/spec-template.md`; copia física: `specs/_template.md`.
`memoria.md` es el registro de estado, decisiones con porqué y errores a evitar. Se actualiza al cerrar cada fase o cambio documental.
Máx. ~10000 líneas. Si una lección se vuelve regla, moverla a este archivo. Nunca datos sensibles.

## 3. Límites — no hacer

> **Excepción CI/CD:** el agente `implementador-cicd-movil` puede editar y ejecutar exclusivamente lo descrito en la enmienda 1.3.0 y en `docs/gobierno/AUT-SM-20261112-CICD-MOVIL.md`. Los límites siguientes siguen vigentes para el coordinador, los subagentes y cualquier trabajo funcional.

- No implementar, no usar shell, no generar proyectos (incluidos React Native o Expo), no instalar paquetes, no compilar, no probar, no desplegar ni publicar, salvo la excepción CI/CD autorizada.
- No marcar casillas de `task.md`, no crear código y no hacer commits.
- No introducir pantallas, flujos, endpoints ni reglas de negocio en `FT-00`. En `FT-01`…`FT-06` solo se documentan si salen de la maqueta o del contrato; no inventar endpoints.
- No leer, mostrar ni copiar archivos de entorno, credenciales, claves o configuraciones reales.
- No editar el paquete SDD de backend; es referencia externa de solo lectura (CM-14).
- No cambiar la jerarquía `constitution.md` → `spec.md` → `plan.md` → `task.md` (CM-01).

## 4. Verificación por feature (documental)

- `spec.md` con 7 secciones + tabla de Aprobación en **Borrador**.
- `plan.md` derivado de `spec.md` y `task.md` con tareas atómicas en `[ ]`.
- Trazabilidad completa requisito → fase → tarea; sin requisitos sin tarea ni tareas huérfanas (CM-10).
- Checklist de `specs/FT-0X-<nombre>/checklists/checklist.md` resuelto en modo documental.
- `CHECKLIST_PR.md` resuelto en su parte documental y con evidencia técnica CI/CD cuando exista; no se marcan gates no ejecutados.
- Coherencia con CM-01…CM-16 y alineación con el backend registrada (CM-14).
- Cero resultados ficticios: no se afirma compilación, prueba, auditoría, publicación ni despliegue (CM-08).

## 5. Convenciones técnicas

- Estructura por feature: `specs/FT-0X-<nombre>/{spec.md,plan.md,task.md,checklists/checklist.md}`.
- IDs estables: `CM-XX`, `ARM-XXX`, `FM-XX`, `TM-XXX`, `RM-XX`, `DM-XX`, `MM-XXX`, `RC-XX`; requisitos funcionales `REG-XX`, `SES-XX`, `DIS-XX` e `ING-XX`. El sufijo **M** evita colisiones con backend.
- `task.md` se mantiene en singular por requisito académico.
- Español de México, Markdown UTF-8, encabezados claros y enlaces relativos existentes.
- No crear carpetas de código ni rutas a artefactos que no existan.
- No duplicar tablas vivas: la fuente canónica se enlaza, no se copia.

## 6. Seguridad DevSecOps

- El dispositivo y el paquete de la app son **no confiables**; sin secretos ni credenciales privilegiadas en el cliente (CM-05, CM-07).
- Deny-list de lectura: `*.env`, `*.env.*`, `keys.properties`, `local.properties`, `*.jks`, `*.keystore`, `SIGNING_*`, `KEYSTORE_*`.
- Almacenamiento seguro para credenciales de sesión; mínimo privilegio; tráfico cifrado; registros sin datos sensibles.
- SAST, análisis de dependencias y CI/CD están **implementados en el PR de infraestructura**: CodeQL, Gitleaks, SCA, SBOM, gate de manifiesto y validación de workflows. Su ejecución se registra en `docs/ci-cd/EVIDENCIAS.md`; no se declaran verdes sin run.

## 7. Testing

El CI ejecuta toda prueba Jest real disponible. Estado 2026-11-12: **13 pruebas de seguridad ejecutadas**, cobertura global medida y umbral mínimo contra regresión. Pruebas de UI, integración y extremo a extremo siguen **pendientes** (ARM-015); Jest + React Native Testing Library continúa como **Propuesta** (MM-108). Prohibido afirmar cobertura o resultados no medidos.

## 8. Observabilidad mínima (diseño futuro)

Logger sanitizado y `CorrelationId` por operación como principios de diseño; sin PII ni tokens en registros. Proveedor de diagnóstico **por definir** (MM-206). No se implementa nada en esta fase.

## 9. Operación CI/CD y Play

La ruta de build y firma está **implementada sin ejecutar publicación**: Expo CNG + Gradle, AAB con upload key externa y gates de Play. Los environments y secretos deben configurarse manualmente; no hay credenciales en el repositorio. La publicación sigue bloqueada hasta autorización expresa y verificación de las políticas vigentes de Google Play (CM-15). La matriz de versionamiento se conserva (MM-207).

## 10. Lecciones

Fuente: `memoria.md`. Si una lección se vuelve regla, moverla a este archivo. No duplicar decisiones confirmadas en varios documentos.

## 11. Sub-agentes

Definiciones: `.opencode/agents/*.md` (`mode: primary` o `mode: subagent`). Todos leen constitución + `AGENTS.md` + `memoria.md` antes de actuar. Ninguno guarda secretos ni toca archivos de entorno o firma.

- `implementador-cicd-movil` — primario; única excepción de ejecución, limitada a CI/CD, DevSecOps, pruebas y build Android con aprobación por operación.
- `coordinador-sdd-movil` — primario; coordina análisis documental y delega revisiones acotadas.
- `arquitecto-movil` — capas, fronteras y decisiones de arquitectura base.
- `auditor-sdd-movil` — trazabilidad, alcance y prohibición de ejecutar.
- `revisor-seguridad-movil` — riesgos del cliente, privacidad y permisos de agentes.
- `verificador-alineacion-backend` — comparación con el SDD de backend (solo lectura).

Los subagentes **no delegan ejecución** (CM-11). Reportan hallazgos con evidencia y veredicto; no editan archivos ni marcan tareas.

## 12. Skills

Definiciones: `.opencode/skills/*/SKILL.md` (`name` = directorio, kebab-case).

- `comprobar-constitucion-movil` — verifica cumplimiento de CM-01…CM-16.
- `auditar-trazabilidad-movil` — revisa ARM → FM → TM y estados `[ ]`.
- `revisar-riesgos-movil` — inspecciona riesgos RM-01…RM-10 y decisiones.
- `verificar-alineacion-backend` — compara decisiones y acuerdos con backend.
- `revisar-pipeline-play` — revisa inactividad, secretos, permisos, SHA y requisitos de Play.
- `revisar-contrato-cliente` — verifica contrato, URLs y DTOs propuestos.
- `guardian-adr-movil` — exige ADR para decisiones técnicas y evita aprobaciones ficticias.

Skills de implementación (React Native, estado, DI, pruebas, DevSecOps, cliente API, sesión) quedan **reservadas** y no se crean hasta que se autorice la etapa funcional. Ante conflicto, manda la constitución.

## Solution structure (documental)

| Componente | Ruta | Tipo |
|---|---|---|
| Constitución canónica | `.specify/memory/constitution.md` | Norma superior CM-01…CM-16 |
| Constitución espejo | `./constitution.md` | Copia bit a bit de la canónica |
| Plantillas | `.specify/templates/` | spec, plan, tasks, checklist |
| Plantilla física | `specs/_template.md` | Copia de `spec-template.md` |
| Feature base | `specs/FT-00-arquitectura-base-movil/` | `spec.md` + `plan.md` + `task.md` + `checklists/` |
| Features funcionales | `specs/FT-01-*`, `FT-02-*`, `FT-05-*`, `FT-06-*` | Registro, sesión, diseño y primer ingreso, en Borrador |
| Índice de specs | `specs/README.md` | Estado de FT-00…FT-06 |
| Memoria | `memoria.md` | Estado, decisiones y lecciones |
| Gobierno | `AGENTS.md`, `opencode.jsonc` | Reglas operativas y permisos |
| Gate de revisión | `CHECKLIST_PR.md` | Checklist documental y gates técnicos reservados |
| Subagentes | `.opencode/agents/` | Perfiles `mode: primary/subagent` |
| Skills | `.opencode/skills/` | Procedimientos de revisión |
| Código de app | `src/`, `App.tsx`, `index.ts` | Creado; cambios funcionales fuera del alcance de este PR |
| Workflows y scripts | `.github/workflows/`, `scripts/` | CI/CD, validadores y build Android |
| Runbook de entrega | `docs/ci-cd/` | Reproducción, entornos, secretos por nombre y evidencias |
