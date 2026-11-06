# Plan — FT-02 login-sesion

**ID:** PLAN-MOV-SES-001  
**Estado:** planificación documentada, **no ejecutada**  
**Base:** `spec.md`.

## 1. Diseño

La sesión se encapsula en un servicio propio sobre almacenamiento seguro (MM-104). La capa de API agrega el token y coordina la renovación en un único punto, para que las pantallas no conozcan tokens.

```text
Pantalla -> Caso de uso -> Capa de API -> API
                               |
                        Servicio de sesión -> Almacenamiento seguro
```

Regla de renovación: una sola operación en curso; las demás esperan su resultado. Si falla con `401`, se borra la sesión y se notifica a navegación.

## 2. UI y navegación

Al abrir: buscar sesión → renovar si hace falta → área autenticada; sin sesión → Bienvenida. `Iniciar sesión` lleva a `FT-06`. `Cerrar sesión` vive en Perfil.

## 3. DI / composición de dependencias

Interfaces para sesión y API. La biblioteca de almacenamiento seguro sigue propuesta hasta aprobar MM-104.

## 4. Gates

Ahora: revisión documental. Con G-M06: pruebas de refresh concurrente y revisión de seguridad obligatorias.

## Tareas

Ver `task.md`.
