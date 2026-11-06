# Plan — FT-01 registro-usuario

**ID:** PLAN-MOV-REG-001  
**Estado:** planificación documentada, **no ejecutada**  
**Base:** `spec.md`.

## 1. Diseño

Presentación (`Registro`, `ConfirmarCorreo`) → estado de formulario → caso de uso de cuenta → capa única de acceso a API (ARM-003, ARM-005). El formulario no llama a la red directamente. Las mutaciones usan TanStack Query (MM-015); el código y la contraseña viven solo en memoria mientras dura la pantalla.

## 2. UI y navegación

```text
Bienvenida / Iniciar sesión -> Crea tu cuenta -> Confirmar correo -> Iniciar sesión
                                     |  409 ------------------------^
```

- **Crea tu cuenta:** campos y textos de `/registro`.
- **Confirmar correo:** correo de destino, campo de 6 dígitos, `Confirmar`, `Reenviar código` y aviso de vigencia.
- La ruta de confirmación recibe el correo por navegación, sin persistirlo.

## 3. DI / composición de dependencias

Interfaz de cuenta con implementación real sobre la capa de API. En pruebas se sustituye por un doble; no se incluyen dobles en producción.

## 4. Gates

Ahora: revisión documental. Con G-M06 aprobada: tipos, lint, pruebas y checks de CI definidos en `FT-03`.

## Tareas

Ver `task.md`.
