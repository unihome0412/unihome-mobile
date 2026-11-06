# Plan — FT-06 primer-ingreso

**ID:** PLAN-MOV-ING-001  
**Estado:** planificación documentada, **no ejecutada**  
**Base:** `spec.md`.

## 1. Diseño

Presentación → estado → interfaces de datos. Cada interfaz tiene una fuente de ejemplo o API, seleccionada al componer la app. Las pantallas no saben de dónde vienen los datos, lo que facilita conectar M02, M03 y M04 después.

## 2. UI y navegación

```text
Login -> ¿Universidad guardada?
           |-- no --> ¿Dónde vas a estudiar? --> Explorar
           '-- sí --------------------------> Explorar

Barra inferior: Explorar · Mensajes · Perfil
Explorar: Mapa <-> Lista -> Detalle
Perfil: Mi universidad, aviso, cerrar sesión y eliminar cuenta
```

Orden propuesto para la revisión: selección de universidad, lista, detalle, perfil con logout, mensajes vacíos, mapa visual y eliminar cuenta.

## 3. DI / composición de dependencias

Interfaces para universidades, alojamientos y perfil. Los datos de ejemplo quedan en un módulo separado y señalado.

## 4. Gates

Ahora: revisión documental. Antes de la entrega final: inventario de datos de ejemplo retirados o aprobados.

## Tareas

Ver `task.md`.
