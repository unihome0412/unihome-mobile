# Pruebas de seguridad — F02 Inicio de sesión (especificación, no ejecutada)

| ID | Amenaza | Requisito | Pasos | Resultado esperado |
|---|---|---|---|---|
| ST-F02-001 | THM-04 (TH-01) | MV-F02-R03 | Intentar login con correo inexistente y con contraseña errónea | Mensaje y comportamiento de interfaz **idénticos** |
| ST-F02-002 | THM-05 | MV-F02-R06 | Iniciar sesión con datos ficticios; inspeccionar registros y reportes de fallos | Sin contraseña, tokens ni correo en registros |
| ST-F02-003 | THM-09 | MV-F02-R05 | Forzar 401 y 429 repetidos | El cliente no reintenta automáticamente ni genera ráfagas |
| ST-F02-004 | THM-01, THM-11 | MV-F02-R02, R07 | Dos peticiones simultáneas con access vencido; luego refresh rotado | Una sola renovación; el token rotado **nunca** se reenvía; reemplazo atómico |
| ST-F02-005 | THM-05 | MV-F02-R06 | Revisar campo de contraseña tras éxito y tras salir | Vaciado; sin autocompletado inseguro; sin captura en portapapeles |
| ST-F02-006 | THM-01 | MV-F02-R02 | Inspeccionar preferencias, caché y respaldo tras iniciar sesión | La credencial de sesión **solo** está en almacenamiento seguro |
| ST-F02-007 | THM-04 | MV-F02-R04 | **Bloqueado por DEC-M09 / revisión del backend.** Credenciales correctas de cuenta suspendida frente a incorrectas | Solo se distinguen tras validar la contraseña; mensaje neutro; sin dato adicional |
