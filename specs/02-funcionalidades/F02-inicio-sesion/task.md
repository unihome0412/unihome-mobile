# Tareas — F02 Inicio de sesión

**Estado inicial:** 0/11 ejecutadas. **No ejecutar por este paquete.**

- [ ] **MV-F02-T01** Obtener del backend la definición del destino tras login y de la detección de cuenta administrativa. → MV-F02-R08. Dep.: DEC-M06 (G-M07).
- [ ] **MV-F02-T02** Obtener el contrato de respuesta para cuenta sin confirmar y el texto del 403. → MV-F02-R04, R09. Dep.: DEC-M09.
- [ ] **MV-F02-T03** Acordar los campos de `RefreshRequest` y su transporte. → MV-F02-R02, R07. Dep.: backend `EP-M01-08`.
- [ ] **MV-F02-T04** Extraer de la maqueta los textos del catálogo (`login.*`) y los estados del formulario. → MV-F02-R03, R10, R11, R12. Dep.: `MV-A05-T01`.
- [ ] **MV-F02-T05** Especificar la máquina de sesión aplicada a F02 y la restauración al abrir. → MV-F02-R02, R07. Dep.: `MV-A03-T01`.
- [ ] **MV-F02-T06** Especificar las operaciones `iniciarSesion` y `renovarSesion` y su mapeo de errores. → MV-F02-R03…R05. Dep.: MV-F02-T02, MV-F02-T03, `MV-A04-T04`.
- [ ] **MV-F02-T07** Especificar el manejo seguro de la contraseña y de los tokens. → MV-F02-R02, R06. Dep.: `MV-A02-T02`, `MV-A02-T05`.
- [ ] **MV-F02-T08** Revisar accesibilidad del formulario. → MV-F02-R12. Dep.: `MV-A05-T03`.
- [ ] **MV-F02-T09** Revisar y completar casos `UT-F02-*`. → MV-F02-R01, R03, R05, R06. Dep.: MV-F02-T04.
- [ ] **MV-F02-T10** Revisar y completar casos `IT-F02-*` e `ST-F02-*`. → MV-F02-R02…R13. Dep.: MV-F02-T06, MV-F02-T07.
- [ ] **MV-F02-T11** Presentar la spec para aprobación y registrar G-M07. → todos. Dep.: MV-F02-T01…T10.

Evidencia futura: acta de aprobación humana y resultados reales de pruebas (hoy no existen).
