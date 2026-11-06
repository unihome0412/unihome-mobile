# Task — FT-02 login-sesion

**Estado general:** **NO INICIADO**. Ninguna casilla se marca sin autorización (CM-03).

## FM-21 · Preparación

- [ ] **TM-201** · Aprobar MM-104 para almacenamiento seguro. **Req:** SES-04, SES-07. **Dep.:** G-M06.
- [ ] **TM-202** · Acordar con backend un código estable para el `403`. **Req:** SES-06. **Dep.:** —.

## FM-22 · Implementación futura

- [ ] **TM-203** · Crear el servicio de sesión. **Req:** SES-04, SES-07, SES-11, SES-13. **Dep.:** TM-201.
- [ ] **TM-204** · Agregar token y renovación única en la capa de API. **Req:** SES-08 a SES-12. **Dep.:** TM-203.
- [ ] **TM-205** · Construir `Qué bueno verte` y conectar login. **Req:** SES-01 a SES-06, SES-15. **Dep.:** TM-204.
- [ ] **TM-206** · Conectar `Cerrar sesión` y limpiar caché. **Req:** SES-13, SES-14. **Dep.:** TM-204.

## FM-23 · Verificación futura

- [ ] **TM-207** · Pruebas unitarias e integración, incluido refresh concurrente. **Req:** SES-03 a SES-14. **Dep.:** TM-206.
- [ ] **TM-208** · Revisión de almacenamiento y logs. **Req:** sección 3. **Dep.:** TM-206.
- [ ] **TM-209** · Prueba real en Android de login, reapertura, refresh y logout. **Req:** todos. **Dep.:** TM-207, TM-208.
