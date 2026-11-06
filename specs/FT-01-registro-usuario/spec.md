# FT-01 registro-usuario — Registro y confirmación de correo

**ID:** SPEC-MOV-REG-001  
**Versión:** 1.0.0  
**Estado:** Borrador documental / pendiente de aprobación  
**Rector:** `../../.specify/memory/constitution.md` (CM-01, CM-02)  
**Etapa:** especificación funcional; ninguna tarea ejecutada.

## 1. Contexto y objetivo

Permitir que una persona cree su cuenta desde la app y confirme su correo con un código de 6 dígitos, usando la API real (`EP-M01-01`, `EP-M01-02`, `EP-M01-03`).

**Incluye:** pantalla `Crea tu cuenta`, aviso de privacidad, pantalla para confirmar el correo, reenvío de código y manejo de errores.  
**Excluye:** login y sesión (`FT-02`), recuperación de contraseña (pendiente de backend), publicar como arrendador y verificación de identidad.

**Fuentes:** maqueta vigente (`FT-05`, ruta `/registro`), contrato OpenAPI y SDD de backend M01.

## 2. Requisitos funcionales

| ID | Requisito (DEBE) | Origen |
| --- | --- | --- |
| REG-01 | Mostrar `Nombre completo`, `Correo electrónico`, `Fecha de nacimiento`, `Género`, `Contraseña`, `Confirmar contraseña`, `Aviso de privacidad` y casilla de consentimiento | Maqueta `/registro` |
| REG-02 | Mantener `Crear mi cuenta` deshabilitado hasta aceptar el aviso de privacidad | Maqueta `/registro` |
| REG-03 | Enviar `POST /api/v1/auth/registro` con los campos de la sección 4 | OpenAPI |
| REG-04 | Convertir `Prefiero no decir` al valor de contrato `PrefiereNoDecir` | API |
| REG-05 | Enviar la fecha como `AAAA-MM-DD`; mostrarla en formato largo de México | API; maqueta |
| REG-06 | Mostrar los errores por campo a partir de `errors` sin exponer mensajes técnicos | API; CM-13 |
| REG-07 | Tras `201`, abrir la confirmación de correo aunque `correoConfirmacionEnviado` sea `false` | API |
| REG-08 | Si `correoConfirmacionEnviado` es `false`, avisar que no se pudo enviar y ofrecer reenvío | API |
| REG-09 | Pedir un código de 6 dígitos y enviar `POST /api/v1/auth/confirmacion-correo` | API |
| REG-10 | Informar que solo sirve el código más reciente y que vence a los 10 minutos | API; backend M01 |
| REG-11 | Ofrecer `POST /api/v1/auth/confirmacion-correo/reenvio` y limpiar el código escrito | API |
| REG-12 | Tratar `202` como solicitud aceptada, sin afirmar que el correo llegó | API |
| REG-13 | Tras `200`, llevar a `Iniciar sesión` con el correo precargado | Decisión de flujo propuesta |
| REG-14 | Ante `409`, mostrar el mensaje genérico y ofrecer ir a `Iniciar sesión` | API |

## 3. Requisitos no funcionales

- Sin registrar nombre, correo, fecha, código ni contraseña en logs (CM-07).
- No guardar la contraseña ni el código en almacenamiento local.
- La validación del cliente mejora la experiencia, pero la autoridad es el servidor (CM-05).
- Estados uniformes de carga, error, sin conexión y límite de uso (CM-13).

## 4. Arquitectura y contratos

**`POST /api/v1/auth/registro`**

| Campo | Tipo | Regla |
| --- | --- | --- |
| `nombreCompleto` | texto | 2 a 120 caracteres |
| `correo` | texto | Correo válido, máximo 254 |
| `fechaNacimiento` | `AAAA-MM-DD` | Fecha pasada |
| `genero` | texto | `Mujer`, `Hombre` o `PrefiereNoDecir` |
| `contrasena` | texto | 8 a 128 caracteres |
| `confirmarContrasena` | texto | Igual a `contrasena` |
| `aceptoAvisoPrivacidad` | booleano | Debe ser `true` |
| `versionAvisoPrivacidad` | texto | Versión publicada del aviso; pendiente de definir su fuente |

Respuesta `201`: `id`, `correo`, `correoConfirmado`, `requiereConfirmacionCorreo`, `correoConfirmacionEnviado`.

| Operación | Cuerpo | Respuestas que la app atiende |
| --- | --- | --- |
| Registro | Tabla anterior | `201`, `400`, `409`, `413`, `503` |
| Confirmación | `correo`, `codigo` | `200`, `400`, `410`, `413`, `429`, `503` |
| Reenvío | `correo` | `202`, `400`, `413`, `429`, `503` |

Límites actuales del servidor, provisionales: 5 intentos por código; por IP, 10 confirmaciones y 5 reenvíos por minuto. La app no debe fijar esos valores en su código.

## 5. Criterios de aceptación

- **AC-REG-01:** Dado el formulario sin aceptar el aviso, entonces no se puede enviar (REG-01, REG-02).
- **AC-REG-02:** Dados datos válidos, cuando la API responde `201`, entonces se abre la confirmación (REG-03, REG-07).
- **AC-REG-03:** Dado `Prefiero no decir`, entonces se envía `PrefiereNoDecir` (REG-04).
- **AC-REG-04:** Dada una fecha, entonces la API recibe `AAAA-MM-DD` y la persona ve formato largo (REG-05).
- **AC-REG-05:** Dado un `400` con `errors`, entonces cada mensaje útil aparece junto a su campo y los errores técnicos usan un mensaje general (REG-06).
- **AC-REG-06:** Dado `correoConfirmacionEnviado=false`, entonces se ofrece reenvío y no se afirma que el correo salió (REG-08).
- **AC-REG-07:** Dado un código correcto, entonces se confirma y lleva a login (REG-09, REG-13).
- **AC-REG-08:** Dado un código incorrecto, entonces muestra error sin borrar el correo; dado un `410`, pide un código nuevo (REG-09, REG-10).
- **AC-REG-09:** Dado un reenvío, cuando la API responde `202`, entonces limpia el código y pide usar el más reciente (REG-11, REG-12).
- **AC-REG-10:** Dado un `409`, entonces no revela más datos y ofrece iniciar sesión (REG-14).

## 6. Plan de pruebas

Futuras y **no ejecutadas**:

| Tipo | Cobertura |
| --- | --- |
| Unitarias | Validaciones, conversión de género y fecha, mapeo de errores |
| Integración | Registro, confirmación y reenvío contra un doble del contrato |
| Seguridad | Ausencia de contraseña, código y datos personales en logs |
| Extremo a extremo | Registro real, correo y confirmación en dispositivo Android |

## 7. Riesgos, límites y deuda

- **RM-REG-01:** la vista previa revisada no mostró la pantalla de código. Debe diseñarse en la maqueta o usar componentes de `FT-05`, con aprobación (CM-16).
- **RM-REG-02:** OpenAPI publica `Gender` como entero, pero la API solo acepta texto. Un cliente generado sin corrección fallaría (RC-03).
- **RM-REG-03:** falta definir de dónde sale `versionAvisoPrivacidad` y el enlace del aviso publicado.
- **RM-REG-04:** el campo de fecha de la maqueta muestra `dd/mm/aaaa`, distinto de la regla de fechas largas. Usar un selector en la app.
- **RM-REG-05:** Brevo puede bloquear una IP nueva de Azure, y entonces `correoConfirmacionEnviado` sería `false`.
- **RM-REG-06:** la política para menores de edad (`DEC-10` del backend) sigue abierta.

## Aprobación

| Estado | Revisor | Fecha | Evidencia |
|---|---|---|---|
| Borrador | — | — | Pendiente de revisión docente/equipo (G-M06) |
