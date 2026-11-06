# FT-02 login-sesion — Inicio de sesión, sesión y cierre

**ID:** SPEC-MOV-SES-001  
**Versión:** 1.0.0  
**Estado:** Borrador documental / pendiente de aprobación  
**Rector:** `../../.specify/memory/constitution.md`  
**Etapa:** especificación funcional; ninguna tarea ejecutada.

## 1. Contexto y objetivo

Permitir iniciar sesión, mantenerla activa y cerrarla, usando `EP-M01-04`, `EP-M01-08` y `EP-M01-05`.

**Incluye:** pantalla `Qué bueno verte`, mostrar u ocultar contraseña, restauración de sesión, renovación de tokens y cierre de sesión.  
**Excluye:** cuentas de demostración, exploración sin cuenta conectada a la API y recuperación de contraseña, que sigue pendiente de backend.

## 2. Requisitos funcionales

| ID | Requisito (DEBE) | Origen |
| --- | --- | --- |
| SES-01 | Mostrar correo, contraseña con ícono de mostrar/ocultar, `¿Olvidaste tu contraseña?`, `Iniciar sesión` y `Crear cuenta` | Maqueta `/acceso` |
| SES-02 | No incluir `Cuentas de demostración` en el artefacto publicable | Prototipo; CM-05 |
| SES-03 | Enviar `POST /api/v1/auth/login` con `correo` y `contrasena` | OpenAPI |
| SES-04 | Tras `200`, guardar la sesión de forma segura y entrar a la app | API; CM-07 |
| SES-05 | Mostrar un único mensaje para credenciales inválidas (`401`) | API |
| SES-06 | Ante `403`, mostrar el `detail` del servidor; si no es por suspensión, ofrecer ingresar código | API; RC-04 |
| SES-07 | Mantener la sesión al reabrir la app hasta cierre explícito o sesión inválida | ARM-006; CM-13 |
| SES-08 | Agregar el `accessToken` a las rutas protegidas desde la capa de API | CM-06 |
| SES-09 | Renovar con `POST /api/v1/auth/refresh` al recibir `401` o estar próximo el vencimiento | API |
| SES-10 | Ejecutar una sola renovación a la vez y reintentar las demás peticiones después | Rotación con detección de reuso |
| SES-11 | Guardar el nuevo `refreshToken` antes de reintentar | API |
| SES-12 | Si el refresh responde `401`, borrar la sesión y volver a login | API |
| SES-13 | `Cerrar sesión` llama a `POST /api/v1/auth/logout` y borra sesión y caché del usuario | ARM-006, ARM-007 |
| SES-14 | Si logout falla por red, borrar localmente e informar que la sesión del servidor puede seguir vigente | Decisión propuesta |
| SES-15 | Mientras no exista backend, `¿Olvidaste tu contraseña?` indica que no está disponible, sin simular éxito | CM-08; RC-05 |

## 3. Requisitos no funcionales

- Tokens fuera de logs, capturas de diagnóstico y estado persistido no seguro (CM-07).
- `refreshToken` en almacenamiento seguro; `accessToken` en memoria durante la ejecución.
- Sin secretos de firma de JWT ni validación local de permisos en el cliente (CM-05).
- Estados uniformes de carga, sin conexión y límite de uso (`429`).

## 4. Arquitectura y contratos

| Operación | Autorización | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| Login | Pública | `correo`, `contrasena` | `200`: `accessToken`, `refreshToken`, `expiraEn` |
| Refresh | Pública | `refreshToken` | `200`: mismos campos |
| Logout | Bearer | Vacío | `204` |

Valores actuales del servidor: access token de 60 minutos y refresh token de 30 días, con rotación. Usar `expiraEn`, sin fijar duraciones en la app. Reutilizar un refresh token ya usado revoca la familia de sesiones.

La respuesta no incluye nombre, rol ni identificador. La app no debe depender de datos internos del JWT para mostrar perfil o permisos.

## 5. Criterios de aceptación

- **AC-SES-01:** Dada la pantalla, entonces coincide con `/acceso` y la versión publicable no tiene cuentas demo (SES-01, SES-02).
- **AC-SES-02:** Dadas credenciales válidas de una cuenta confirmada, entonces entra a la app (SES-03, SES-04).
- **AC-SES-03:** Dadas credenciales inválidas, entonces no indica si el correo existe (SES-05).
- **AC-SES-04:** Dado un `403` por correo sin confirmar, entonces ofrece ingresar el código (SES-06).
- **AC-SES-05:** Dada una sesión válida, cuando se reabre la app, entonces no pide login (SES-07).
- **AC-SES-06:** Dadas varias peticiones con token vencido, entonces solo hay un refresh y todas continúan (SES-08 a SES-11).
- **AC-SES-07:** Dado un refresh `401`, entonces borra la sesión y vuelve a login (SES-12).
- **AC-SES-08:** Dado un logout correcto, entonces no quedan tokens ni caché del usuario (SES-13).
- **AC-SES-09:** Dado un fallo de red en logout, entonces cierra localmente y avisa (SES-14).
- **AC-SES-10:** Dado `¿Olvidaste tu contraseña?`, entonces no simula un envío (SES-15).

## 6. Plan de pruebas

Futuras y **no ejecutadas**: unitarias de sesión; integración de refresh concurrente; seguridad de almacenamiento y logs; extremo a extremo de login, reapertura, refresh y logout en Android.

## 7. Riesgos, límites y deuda

- **RM-SES-01:** si el servidor rota el token y la respuesta se pierde, un reintento puede revocar la sesión. Se acepta volver a login.
- **RM-SES-02:** el `403` no trae un código estable, por lo que distinguir su causa depende de texto (RC-04).
- **RM-SES-03:** `¿Olvidaste tu contraseña?` aparece en la maqueta, pero `EP-M01-06` y `EP-M01-07` no están implementados (RC-05).
- **RM-SES-04:** 30 días sin renovar cierran la sesión. Revisar si cumple “sesión viva salvo cierre explícito” (lineamiento 16).
- **RM-SES-05:** el logout invalida el refresh del dispositivo. Falta confirmar con backend el tratamiento del access token ya emitido.

## Aprobación

| Estado | Revisor | Fecha | Evidencia |
|---|---|---|---|
| Borrador | — | — | Pendiente de revisión docente/equipo (G-M06) |
