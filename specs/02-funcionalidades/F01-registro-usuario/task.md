# Tareas — F01 Registro de usuario

**Estado inicial:** 0/12 ejecutadas. **No ejecutar por este paquete.**

- [ ] **MV-F01-T01** Acordar con el backend los DTOs de `RegistroResponse`, `ConfirmarCorreoResponse`, `ReenviarCodigoRequest` y el transporte del token de registro. → MV-F01-R05, R09, R13. Dep.: ALN-01 (G-M07).
- [ ] **MV-F01-T02** Obtener la decisión DEC-09 (correo duplicado) y DEC-10 (menores) y actualizar la spec. → MV-F01-R02, R08. Dep.: PO del backend.
- [ ] **MV-F01-T03** Definir el origen y la versión vigente del aviso de privacidad que envía el cliente. → MV-F01-R03. Dep.: backend `EP-M01-01`, landing.
- [ ] **MV-F01-T04** Extraer de la maqueta los textos del catálogo (`registro.*`, `confirmar.*`) y el diseño de estados. → MV-F01-R12, R14. Dep.: `MV-A05-T01`.
- [ ] **MV-F01-T05** Definir el esquema de validación del cliente (campos, límites, enumeración de género). → MV-F01-R01, R02, R04. Dep.: MV-F01-T02.
- [ ] **MV-F01-T06** Especificar la máquina de estados del flujo y la cuenta regresiva de reenvío. → MV-F01-R05, R06, R07, R11. Dep.: MV-A03-T01.
- [ ] **MV-F01-T07** Especificar las tres operaciones de la capa de API y su mapeo de errores. → MV-F01-R08, R09, R14. Dep.: MV-F01-T01, MV-A04-T04.
- [ ] **MV-F01-T08** Especificar el manejo seguro de contraseña, código y token de registro en memoria. → MV-F01-R10. Dep.: MV-A02-T05.
- [ ] **MV-F01-T09** Revisar accesibilidad (etiquetas, foco al primer error, anuncios). → MV-F01-R12. Dep.: MV-A05-T03.
- [ ] **MV-F01-T10** Revisar y completar casos `UT-F01-*` (unitarios). → MV-F01-R01…R07. Dep.: MV-F01-T05.
- [ ] **MV-F01-T11** Revisar y completar casos `IT-F01-*` e `ST-F01-*`. → MV-F01-R05…R14. Dep.: MV-F01-T07, MV-F01-T08.
- [ ] **MV-F01-T12** Presentar la spec para aprobación y registrar G-M07. → todos. Dep.: MV-F01-T01…T11.

Evidencia futura: acta de aprobación humana y resultados reales de pruebas (hoy no existen).
