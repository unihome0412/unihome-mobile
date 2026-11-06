# Plantilla de ficha de contrato de endpoint (cliente)

| Campo | Contenido |
|---|---|
| ID de contrato del backend | `EP-Mxx-NN` (referencia, **no** copiar rutas) |
| Método | `POST` / `GET` / … |
| URL | **(en blanco — completar tras acuerdo con el equipo)** |
| Autenticación | Público / Bearer / token específico |
| Idempotencia y reintentos | Sí/No y política del cliente |
| HU de origen | `HU-xxx` |
| Estado del contrato | Confirmado en backend / **Propuesto — por acordar** |

**Solicitud (JSON):** bloque `json` con valores **ficticios** (correo `.invalid`; contraseñas como marcador `<...>`).
**Respuesta 2xx (JSON):** idem. Si el backend no define el DTO, marcarlo **Propuesto — por acordar**.
**Errores (`ProblemDetails`):** tabla `HTTP | type | caso | estado de interfaz`.
**Pruebas:** `UT-Fxx-NNN`, `IT-Fxx-NNN`, `ST-Fxx-NNN`.
