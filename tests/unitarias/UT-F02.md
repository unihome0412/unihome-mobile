# Pruebas unitarias — F02 Inicio de sesión (especificación, no ejecutada)

| ID | HU / requisito | Unidad | Precondición | Pasos | Resultado esperado | Tipo |
|---|---|---|---|---|---|---|
| UT-F02-001 | HU-004 · MV-F02-R01 | Validador del formulario | — | Correo vacío, correo mal formado, contraseña vacía, ambos válidos | Inválido los tres primeros; válido el último; **sin regla de longitud** de contraseña | Éxito/Error |
| UT-F02-002 | MV-F02-R03 | Mapeo de 401 en login | Error simulado 401 | Mapear a estado de interfaz | Mensaje «Revisa tu correo y contraseña», idéntico para cualquier causa | Éxito |
| UT-F02-003 | MV-F02-R04 | Mapeo de 403 | Error simulado 403 | Mapear | Estado `prohibido` con mensaje neutro del catálogo | Éxito |
| UT-F02-004 | MV-F02-R05 | Mapeo de 429 | Error con `Retry-After` | Mapear | `limiteDeUso`; sin reintento automático; acción deshabilitada durante la espera | Éxito |
| UT-F02-005 | MV-F02-R02 | Transición de sesión | Estado `SinSesion` | Simular éxito de login | `SinSesion → Autenticando → ConSesion`; refresh a almacenamiento seguro | Éxito |
| UT-F02-006 | MV-F02-R02 | Cálculo de vigencia | `expiraEn` simulado | Evaluar antes y después de `expiraEn` con margen | Marca el access token como vigente/vencido sin duraciones codificadas | Éxito |
| UT-F02-007 | MV-F02-R06 | Limpieza de contraseña | Formulario con contraseña | Enviar con éxito y salir | La contraseña queda vacía en memoria | Seguridad |
| UT-F02-008 | MV-F02-R08 | Selección de destino | **Bloqueado por DEC-M06** | Simular respuesta con indicador de destino | Navega al destino indicado; sin indicador no deduce el rol | Éxito/Error |
