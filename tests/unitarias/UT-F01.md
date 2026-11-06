# Pruebas unitarias — F01 Registro de usuario (especificación, no ejecutada)

| ID | HU / requisito | Unidad | Precondición | Pasos | Resultado esperado | Tipo |
|---|---|---|---|---|---|---|
| UT-F01-001 | HU-001 · MV-F01-R04 | Validador de nombre | — | Probar "A", 2 caracteres, 120, 121 caracteres y solo espacios | Inválido: 1, 121 y solo espacios; válido: 2 y 120 | Éxito/Error |
| UT-F01-002 | HU-001 · MV-F01-R04 | Validador de correo | — | Probar sin "@", sin dominio y un correo bien formado `.invalid` | Inválido los dos primeros; válido el tercero; se normaliza a minúsculas | Éxito/Error |
| UT-F01-003 | HU-001 · MV-F01-R02 | Validador de fecha | Fecha actual simulada | Fecha futura, hoy, pasada de menor de 18, pasada muy antigua | Futura inválida; pasadas válidas **sin bloqueo por edad** | Éxito/Error |
| UT-F01-004 | HU-001 · MV-F01-R04 | Validador de contraseña | — | 7 caracteres, 8 caracteres, confirmación distinta | 7 inválida; 8 válida; confirmación distinta marca error de coincidencia | Éxito/Error |
| UT-F01-005 | HU-012 · MV-F01-R03 | Estado del botón de envío | Formulario válido | Con casilla sin marcar; con casilla marcada | Deshabilitado sin consentimiento; habilitado con consentimiento | Éxito/Error |
| UT-F01-006 | HU-003 · MV-F01-R05 | Máscara de correo | — | Enmascarar `persona@ejemplo.invalid` | Muestra solo parte del usuario; dominio conservado; nunca el correo completo | Éxito |
| UT-F01-007 | HU-003 · MV-F01-R06 | Validador de código | — | "12345", "1234567", "12a456", "123456" | Solo "123456" es válido | Éxito/Error |
| UT-F01-008 | MV-F01-R14 | Mapeo de `ProblemDetails` 400 | Error simulado con `errors` por campo | Mapear a errores de campo | Cada campo recibe su clave de catálogo; sin texto crudo del servidor | Éxito |
| UT-F01-009 | HU-003 · MV-F01-R07 | Cuenta regresiva de reenvío | `Retry-After` simulado | Iniciar espera y avanzar el tiempo | Acción deshabilitada hasta terminar; sin reintento automático | Éxito |
| UT-F01-010 | MV-F01-R08 | Selección de comportamiento DEC-09 | **Bloqueado por DEC-09** | Configurar opción A y B | A: misma pantalla que un registro nuevo; B: error en el campo correo | Éxito |
