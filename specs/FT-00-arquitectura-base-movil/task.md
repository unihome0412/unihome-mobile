# Task — FT-00 arquitectura-base-movil

**ID:** TASK-MOV-ARQ-000  
**Versión:** 1.0.0  
**Estado general:** **NO INICIADO**  
**Fuente:** `spec.md` y `plan.md`  
**Regla:** ninguna casilla se marca hasta nueva autorización. Esta es una **lista de trabajo futuro**, no una bitácora de ejecución.

## Convenciones

- `TM-XXX` = tarea; `FM-XX` = fase; `ARM-XXX` = requisito.
- La dependencia indica la precedencia **propuesta** para cuando se autorice la ejecución.
- Todo resultado previsto es **evidencia futura** y no existe todavía como trabajo validado.
- No hay tareas de código funcional, pantallas, módulos, endpoints, creación de proyectos, compilación ni publicación.
- 1 tarea = 1 entregable verificable; `Verif.` describe la evidencia documental esperada.

## FM-01 · Gobernanza y alineación (pendiente)

- [ ] **TM-001** · Revisar con el equipo/docente que la constitución CM-01…CM-15 expresa correctamente el alcance y las restricciones del cliente móvil. **Req:** ARM-020. **Dep.:** —. **Verif.:** validación humana identificable.
- [ ] **TM-002** · Confirmar el estatus de tecnologías y asuntos abiertos en `memoria.md`; no elevar propuestas (MM-101…MM-109) a confirmadas sin respaldo. **Req:** ARM-018. **Dep.:** TM-001. **Verif.:** registro validado.
- [ ] **TM-003** · Revisar permisos de agentes, `opencode.jsonc` y reglas SDD del uso de agentes de IA, sin levantar aún la prohibición de ejecutar. **Req:** ARM-017. **Dep.:** TM-001. **Verif.:** verificación de reglas y configuración.
- [ ] **TM-004** · Reconciliar con el SDD de backend las observaciones RC-01 y RC-02 y definir quién actualiza qué mediante gobierno de cambios; no editar el otro paquete sin esa decisión. **Req:** ARM-004, ARM-019. **Dep.:** TM-002. **Verif.:** acuerdo registrado en ambos paquetes.

## FM-02 · Modelo lógico y capas (pendiente)

- [ ] **TM-005** · Validar la vista conceptual y las fronteras de confianza del cliente (sin ruta a la persistencia, sin secretos en la app). **Req:** ARM-001. **Dep.:** TM-002. **Verif.:** conformidad del diagrama.
- [ ] **TM-006** · Revisar capas, responsabilidades y reglas de dependencia, incluida la capa única de acceso a API y la justificación de dependencias de terceros. **Req:** ARM-003, ARM-005. **Dep.:** TM-005. **Verif.:** reglas aceptadas o decisión marcada como pendiente.
- [ ] **TM-007** · Aprobar solo principios generales de contrato, versionado y compatibilidad con versiones instaladas, sin definir API funcional. **Req:** ARM-003, ARM-004. **Dep.:** TM-005, TM-004. **Verif.:** política técnica aceptada.

## FM-03 · Seguridad y capacidades transversales (pendiente)

- [ ] **TM-008** · Revisar matriz conceptual de entornos, configuración pública frente a secretos de construcción y firma. **Req:** ARM-002. **Dep.:** TM-005. **Verif.:** matriz de configuración revisada.
- [ ] **TM-009** · Revisar política de sesión, clasificación de datos locales y política de caché (sin modo offline). **Req:** ARM-006, ARM-007. **Dep.:** TM-006, TM-008. **Verif.:** políticas aceptadas.
- [ ] **TM-010** · Revisar política de permisos del dispositivo y los puntos reservados de privacidad y eliminación de cuenta. **Req:** ARM-008, ARM-009. **Dep.:** TM-008. **Verif.:** políticas aceptadas.
- [ ] **TM-011** · Revisar la política de verificación de contenido previa a su aceptación y el canal de notificaciones push como capacidades de plataforma. **Req:** ARM-010, ARM-011. **Dep.:** TM-006, TM-010. **Verif.:** políticas aceptadas y acuerdos pendientes con backend registrados.
- [ ] **TM-012** · Revisar los puntos de extensión para ML e IA generativa y sus límites de datos, sin definir funcionalidad. **Req:** ARM-012. **Dep.:** TM-006, TM-009. **Verif.:** límites aceptados.
- [ ] **TM-013** · Inspeccionar fronteras de confianza y registrar tratamiento conceptual de los riesgos RM-01…RM-10. **Req:** ARM-001, ARM-002. **Dep.:** TM-005, TM-008. **Verif.:** lista de riesgos aceptada.

## FM-04 · Calidad y entrega (pendiente)

- [ ] **TM-014** · Revisar la política de estados y errores, la matriz de atributos de calidad y las necesidades futuras de diagnóstico. **Req:** ARM-013, ARM-014. **Dep.:** TM-006, TM-013. **Verif.:** matriz de calidad revisada.
- [ ] **TM-015** · Acordar criterios para futuras pruebas unitarias, de integración, de seguridad y de extremo a extremo sin ejecutar pruebas ni afirmar cobertura. **Req:** ARM-015. **Dep.:** TM-014. **Verif.:** estrategia de verificación aprobada.
- [ ] **TM-016** · Revisar la estrategia de entrega: entornos, esquema de la matriz de versionamiento (previa al desarrollo), CI/CD, firma sin secretos versionados y artefacto para Google Play, verificando los requisitos vigentes de la tienda. **Req:** ARM-016. **Dep.:** TM-007, TM-008, TM-015. **Verif.:** estrategia de entrega aprobada.

## FM-05 · Verificación documental (pendiente)

- [ ] **TM-017** · Auditar trazabilidad de ARM-001…ARM-020 y la coherencia con `.specify/memory/constitution.md`. **Req:** ARM-017. **Dep.:** TM-003, TM-007, TM-016. **Verif.:** informe de coherencia.
- [ ] **TM-018** · Comprobar que no hay especificaciones funcionales, pantallas, módulos ni endpoints en el paquete. **Req:** ARM-020. **Dep.:** TM-017. **Verif.:** verificación de exclusiones.

## FM-06 · Cierre de etapa (pendiente)

- [ ] **TM-019** · Presentar decisiones aún abiertas y la reconciliación con el backend al equipo/docente; registrar autorización o rechazo para una etapa posterior sin ejecutar la siguiente. **Req:** ARM-018, ARM-019, ARM-020. **Dep.:** TM-018. **Verif.:** decisión documentada.

## Tabla rápida de rastreo

| Requisito | Fases | Tareas |
| --- | --- | --- |
| ARM-001 | FM-02, FM-03 | TM-005, TM-013 |
| ARM-002 | FM-03 | TM-008, TM-013 |
| ARM-003 | FM-02 | TM-006, TM-007 |
| ARM-004 | FM-01, FM-02 | TM-004, TM-007 |
| ARM-005 | FM-02 | TM-006 |
| ARM-006 | FM-03 | TM-009 |
| ARM-007 | FM-03 | TM-009 |
| ARM-008 | FM-03 | TM-010 |
| ARM-009 | FM-03 | TM-010 |
| ARM-010 | FM-03 | TM-011 |
| ARM-011 | FM-03 | TM-011 |
| ARM-012 | FM-03 | TM-012 |
| ARM-013 | FM-04 | TM-014 |
| ARM-014 | FM-04 | TM-014 |
| ARM-015 | FM-04 | TM-015 |
| ARM-016 | FM-04 | TM-016 |
| ARM-017 | FM-01, FM-05 | TM-003, TM-017 |
| ARM-018 | FM-01, FM-06 | TM-002, TM-019 |
| ARM-019 | FM-01, FM-06 | TM-004, TM-019 |
| ARM-020 | FM-01, FM-05, FM-06 | TM-001, TM-018, TM-019 |

**Control de entrega:** 19 tareas planeadas; **0 iniciadas, 0 completadas, 0 ejecutadas**. No existe autorización para proceder a frontend funcional ni a implementación.

## Aprobación

| Estado | Revisor | Fecha | Evidencia |
|---|---|---|---|
| Borrador | — | — | Pendiente de revisión docente/equipo (puerta G-M06) |
