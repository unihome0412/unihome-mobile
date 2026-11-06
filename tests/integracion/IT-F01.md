# Pruebas de integración — F01 Registro de usuario (especificación, no ejecutada)

Entorno: pantallas + estado + capa de API contra una **API simulada** que respeta el contrato; nunca producción.

| ID | HU / requisito | Contrato | Precondición | Pasos | Resultado esperado | Tipo |
|---|---|---|---|---|---|---|
| IT-F01-001 | HU-001 · MV-F01-R01, R05 | EP-M01-01 | API simulada responde 2xx | Completar el formulario válido y enviar | Se muestra «Confirma tu correo» con el correo parcialmente oculto | Éxito |
| IT-F01-002 | HU-012 · MV-F01-R03 | EP-M01-01 | Casilla marcada | Enviar | La solicitud lleva `aceptoAvisoPrivacidad: true` y la versión mostrada | Éxito |
| IT-F01-003 | HU-001 · MV-F01-R04, R11 | EP-M01-01 | API simulada responde 400 con `errors` | Enviar | Errores bajo cada campo; se conservan datos **excepto** contraseñas; foco al primer error | Error |
| IT-F01-004 | HU-001 · MV-F01-R08 | EP-M01-01 | **Bloqueado por DEC-09** | Enviar un correo ya registrado | A: misma pantalla que un registro nuevo; B: error en el campo correo | Error |
| IT-F01-005 | HU-003 · MV-F01-R09 | EP-M01-02 | Pantalla de confirmación | Enviar código correcto | Se muestra confirmado y se conduce al inicio de sesión (sin login automático) | Éxito |
| IT-F01-006 | HU-003 · MV-F01-R06 | EP-M01-02 | API simulada responde 400 | Enviar código incorrecto | Error bajo el campo; permite corregir o reenviar | Error |
| IT-F01-007 | HU-003 · MV-F01-R06 | EP-M01-02 | API simulada responde 410 | Enviar código vencido | Mensaje de vencido y acción «Reenviar código» | Error |
| IT-F01-008 | HU-003 · MV-F01-R07 | EP-M01-03 | API simulada responde 202 y luego 429 | Reenviar dos veces | Primero cuenta regresiva; después `limiteDeUso` con acción deshabilitada | Éxito/Error |
| IT-F01-009 | MV-F01-R11 | EP-M01-01 | Sin conexión | Enviar | Estado `sinConexion`, datos conservados, un solo envío (sin doble envío) | Error |
| IT-F01-010 | MV-F01-R12 | — | — | Recorrer el flujo con lector de pantalla simulado | Etiquetas presentes; errores anunciados; foco correcto | Accesibilidad |
| IT-F01-011 | MV-F01-R13 | — | **Bloqueado por DEC-M09** | Cerrar la app durante la confirmación y reabrir | Sin token de registro recuperado; se aplica la política de cuenta sin confirmar | Error |
