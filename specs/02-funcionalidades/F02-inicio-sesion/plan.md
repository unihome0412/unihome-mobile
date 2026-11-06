# Plan — F02 Inicio de sesión (cliente móvil)

**Estado:** Propuesto — requiere aprobación | **Spec:** [spec.md](spec.md) | **Bloqueos:** DEC-M06, DEC-M09, ALN-02, ALN-03, ADR-M002, F01 aprobada.

## Enfoque por capas

| Capa | Responsabilidad en F02 | Requisitos |
|---|---|---|
| Presentación | Formulario único, mostrar/ocultar contraseña, mensajes y estados, enlaces a F01 | MV-F02-R01, R03…R05, R10…R12 |
| Estado y datos | Máquina de sesión (`ARQM-003`): `SinSesion → Autenticando → ConSesion`; restauración al abrir; renovación única en vuelo | MV-F02-R02, R07 |
| Acceso a API | Operaciones `iniciarSesion` y `renovarSesion`; mapeo de 400/401/403/429/5xx; sin reintentos automáticos de login | MV-F02-R03…R05 |
| Servicios de plataforma | Almacenamiento seguro de la credencial de sesión; ninguna otra capacidad del dispositivo | MV-F02-R02, R13 |

## Secuencia

```mermaid
sequenceDiagram
    participant U as Persona
    participant P as Presentación
    participant S as Sesión (estado)
    participant A as Acceso a API
    participant B as Backend (EP-M01-04/08)
    U->>P: Correo y contraseña
    P->>S: iniciarSesion(correo, contrasena)
    S->>A: POST login (URL en blanco)
    A->>B: solicitud
    B-->>A: 2xx tokens / 401 / 403 / 429
    A-->>S: resultado o error tipado
    S->>S: guardar refresh en almacenamiento seguro; access en memoria
    S-->>P: ConSesion o error (mensaje del catálogo)
    P-->>U: Destino según DEC-M06 (pendiente)
    Note over S,B: Al abrir la app: Restaurando → renovarSesion → ConSesion / SinSesion
```

## Orden de implementación propuesto (cuando se autorice)
1. Unitarias de validación y de la máquina de sesión (`UT-F02-*`).
2. Capa de acceso a API contra simulador fiel al contrato; casos de error 401/403/429 (`IT-F02-*`).
3. Almacenamiento seguro y renovación única en vuelo (`ST-F02-004`, `ST-F02-006`).
4. Restauración de sesión al abrir.
5. Destino tras login **solo** cuando se cierre DEC-M06.

## Seguridad específica
Mensaje de 401 idéntico; sin reintento automático ante 401/429; sin tokens ni contraseñas en registros; el token rotado nunca se reenvía; cierre local garantizado ante 401 irrecuperable.

## Dependencias cruzadas
F01 (cuenta confirmada y enlace de registro), `ARQM-003/004`, backend M01 (`EP-M01-04/08`), futura funcionalidad de cierre de sesión (HU-005) y de recuperación (HU-006).

## Criterio de salida
Escenarios Gherkin con evidencia real, DEC-M06/M09 resueltos y G-M07 cerrada. Estado en esta entrega: **Propuesto, sin implementación**.
