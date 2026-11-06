# Pruebas de seguridad — F01 Registro de usuario (especificación, no ejecutada)

| ID | Amenaza | Requisito | Pasos | Resultado esperado |
|---|---|---|---|---|
| ST-F01-001 | THM-05 | MV-F01-R10 | Registrar y confirmar con datos ficticios; inspeccionar registros, reportes de fallos y estado persistido | Contraseña, confirmación y código **no aparecen** en ningún registro ni almacenamiento |
| ST-F01-002 | THM-04 (TH-01) | MV-F01-R08, R14 | **Bloqueado por DEC-09.** Registrar correo nuevo y correo ya registrado | Opción A: la interfaz es **indistinguible**; opción B: único mensaje aprobado, sin detalles adicionales |
| ST-F01-003 | THM-01 | MV-F01-R10 | Registrar, forzar cierre de la app a mitad de la confirmación y reabrir | El `registroToken` no persiste (solo memoria) |
| ST-F01-004 | THM-05 | MV-F01-R10 | Revisar campos de contraseña | Entrada protegida, sin sugerencias ni corrección, vaciados al salir |
| ST-F01-005 | THM-12 | MV-F01-R02, R03 | Revisar el formulario | Aviso de privacidad completo y versionado visible antes de registrar; no se piden datos adicionales a los del contrato |
| ST-F01-006 | THM-05 | MV-F01-R05 | Revisar pantalla de confirmación, capturas y registros | Correo parcialmente oculto en pantalla; nunca completo en registros |
| ST-F01-007 | THM-09 | MV-F01-R07 | Forzar 429 en reenvío | Sin reintento automático; acción deshabilitada |
