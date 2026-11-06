# Pruebas de integración — F02 Inicio de sesión (especificación, no ejecutada)

Entorno: pantallas + estado + capa de API contra una **API simulada** que respeta el contrato; nunca producción.

| ID | HU / requisito | Contrato | Precondición | Pasos | Resultado esperado | Tipo |
|---|---|---|---|---|---|---|
| IT-F02-001 | HU-004 · MV-F02-R01, R02 | EP-M01-04 | API simulada responde `LoginResponse` | Enviar correo y contraseña válidos | Estado `ConSesion`; refresh en almacenamiento seguro; sin pantalla de código ni de rol | Éxito |
| IT-F02-002 | HU-004 · MV-F02-R03 | EP-M01-04 | API simulada responde 401 | Enviar credenciales inválidas | Mensaje «Revisa tu correo y contraseña»; contraseña vaciada; correo conservado | Error |
| IT-F02-003 | HU-004 · MV-F02-R04 | EP-M01-04 | API simulada responde 403 | Enviar | Mensaje neutro; sin detalle adicional | Error |
| IT-F02-004 | MV-F02-R05 | EP-M01-04 | API simulada responde 429 con `Retry-After` | Enviar y reintentar | `limiteDeUso`; acción deshabilitada durante la espera; sin reintento automático | Error |
| IT-F02-005 | MV-F02-R07 | EP-M01-08 | Refresh guardado; API simulada responde tokens | Abrir la app | Una sola renovación; el usuario llega a su destino sin credenciales | Éxito |
| IT-F02-006 | MV-F02-R07 | EP-M01-08 | API simulada responde 401 | Abrir la app | Limpieza local y formulario de inicio de sesión | Error |
| IT-F02-007 | MV-F02-R08 | EP-M01-04 | **Bloqueado por DEC-M06** | Iniciar sesión con cuenta administrativa simulada | Navega a Expedientes; cuenta común navega a Explorar | Éxito |
| IT-F02-008 | MV-F02-R09 | EP-M01-04 | **Bloqueado por DEC-M09** | Iniciar sesión con cuenta sin confirmar | Se reanuda la confirmación sin revelar existencia | Error |
| IT-F02-009 | MV-F02-R11 | EP-M01-04 | Sin conexión | Enviar | `sinConexion`; un solo envío | Error |
| IT-F02-010 | MV-F02-R12 | — | — | Recorrer el formulario con lector de pantalla simulado | Etiquetas presentes; error anunciado; foco en el campo con error | Accesibilidad |
| IT-F02-011 | MV-F02-R10 | — | — | Pulsar enlace de registro | Navega a F01; el enlace de recuperación no navega (no definido) | Éxito |
| IT-F02-012 | MV-F02-R13 | — | — | Recorrer el inicio de sesión observando solicitudes de permisos y de biometría | No se solicita ningún permiso del dispositivo ni biometría | Seguridad |
