# FT-06 primer-ingreso — Pantallas posteriores al primer ingreso

**ID:** SPEC-MOV-ING-001  
**Versión:** 1.0.0  
**Estado:** Borrador documental / pendiente de aprobación  
**Rector:** `../../.specify/memory/constitution.md` (CM-02, enmienda 1.2.0)  
**Etapa:** especificación funcional; ninguna tarea ejecutada.

## 1. Contexto y objetivo

Definir lo que ve una estudiante después de entrar por primera vez, para cumplir el punto de revisión “pantallas posteriores a ingreso por primera vez”.

**Incluye:** universidad, exploración en mapa y lista, detalle de alojamiento, mensajes vacíos, perfil, aviso de privacidad, cierre de sesión y eliminación de cuenta.  
**Excluye:** funciones completas de arrendador y administrador, Mi renta y chat en tiempo real.

**Decisión de esta versión:** lo que no tiene endpoint usa datos de ejemplo identificados en la app. Esto debe validarse con el docente.

## 2. Requisitos funcionales

| ID | Requisito (DEBE) | Origen |
| --- | --- | --- |
| ING-01 | Sin universidad elegida, mostrar `¿Dónde vas a estudiar?` | Maqueta `/universidad` |
| ING-02 | Permitir buscar y elegir universidad; ninguna aparece elegida antes de tocarla | Maqueta; historial |
| ING-03 | Mostrar `Explorar` con vistas `Mapa` y `Lista`, universidad actual y filtros | Maqueta `/mapa`, `/explorar` |
| ING-04 | Mostrar tarjetas con foto, precio, distancia y datos principales | Maqueta `/explorar` |
| ING-05 | Abrir el detalle del alojamiento desde mapa o lista | Maqueta; historial |
| ING-06 | Mostrar barra inferior con `Explorar`, `Mensajes` y `Perfil` para usuaria nueva | Maqueta |
| ING-07 | Mostrar `Mensajes` con su estado vacío | Maqueta `/chat` |
| ING-08 | Mostrar `Mi perfil` con sus opciones de la maqueta | Maqueta `/perfil` |
| ING-09 | Marcar como `Próximamente` las opciones de perfil sin implementación, sin simular éxito | CM-08 |
| ING-10 | Abrir el aviso de privacidad | CM-07 |
| ING-11 | Ejecutar cierre de sesión según `FT-02` | ARM-006 |
| ING-12 | `Eliminar cuenta` pide contraseña y confirmación, y llama a la API | Maqueta; API |
| ING-13 | Identificar los datos de ejemplo en la app y centralizarlos para retirarlos después | CM-08 |
| ING-14 | Guardar temporalmente la universidad como dato local no sensible y borrarla al cerrar sesión | ARM-007 |

## 3. Requisitos no funcionales

Estados uniformes, español de México, caché sin modo offline y ningún permiso del dispositivo hasta que una acción lo requiera (CM-07, CM-13). El mapa de la versión de revisión puede ser la representación visual de la maqueta si no se integra un proveedor real.

## 4. Arquitectura y contratos

Las pantallas consumen interfaces de datos. Primero usan una fuente de ejemplo; después se reemplaza por API sin cambiar la presentación.

| Función | Fuente para la revisión | Endpoint futuro en el SDD de backend | Estado |
| --- | --- | --- | --- |
| Universidades | Ejemplo | `EP-M03-01` | No implementado |
| Guardar universidad | Local | `EP-M02-02` | No implementado |
| Mapa y lista | Ejemplo | `EP-M04-01`, `EP-M04-02` | No implementados |
| Tarjeta y detalle | Ejemplo | `EP-M04-03`, `EP-M04-04` | No implementados |
| Perfil | Correo de la sesión; nombre pendiente | `EP-M02-01` | No implementado |
| Favoritos | Pendiente | `EP-M07-01` a `EP-M07-03` | No implementados |
| Mensajes | Estado vacío | `EP-M08-01` a `EP-M08-03` | No implementados |
| Notificaciones | Ejemplo o `Próximamente` | `EP-M12-01`, `EP-M12-02` | No implementados |
| Cerrar sesión | API real | `EP-M01-05` | **Publicado** |
| Eliminar cuenta | API real | `EP-M01-09` | **Publicado** |

`DELETE /api/v1/cuentas/mi-cuenta` usa Bearer y el cuerpo `contrasena`, `confirmacionPerdidaInformacion`. Respuestas: `204`, `400`, `401`, `413` y `503`. Tras `204`, se borra todo lo local y se vuelve a Bienvenida.

## 5. Criterios de aceptación

- **AC-ING-01:** Dada una usuaria sin universidad, entonces ve la selección y ninguna opción preelegida (ING-01, ING-02).
- **AC-ING-02:** Dada una universidad elegida, entonces ve `Explorar` y puede cambiar entre mapa y lista (ING-03, ING-14).
- **AC-ING-03:** Dada una tarjeta, entonces abre su detalle (ING-04, ING-05).
- **AC-ING-04:** Dada la barra inferior, entonces lleva a `Explorar`, `Mensajes` y `Perfil` (ING-06 a ING-08).
- **AC-ING-05:** Dada una opción sin implementar, entonces no simula un resultado (ING-09).
- **AC-ING-06:** Dado `Cerrar sesión`, entonces cumple `AC-SES-08` (ING-11).
- **AC-ING-07:** Dada contraseña correcta y confirmación, cuando se elimina la cuenta, entonces la API responde `204` y no queda sesión local (ING-12).
- **AC-ING-08:** Dados datos de ejemplo, entonces están rotulados y aislados (ING-13).

## 6. Plan de pruebas

Futuras y **no ejecutadas**: unitarias de selección y estados; integración de eliminar cuenta y logout; extremo a extremo de registro, primer ingreso, exploración y cierre en Android.

## 7. Riesgos, límites y deuda

- **RM-ING-01:** el docente podría no aceptar datos de ejemplo. Validarlo antes de la revisión.
- **RM-ING-02:** falta confirmar el recorrido exacto de una cuenta recién creada. En la demo de usuaria nueva se abrió `/mapa` con universidad preelegida; la spec pide elegirla primero.
- **RM-ING-03:** Perfil requiere nombre, pero login no lo devuelve y `EP-M02-01` no existe todavía (RC-06).
- **RM-ING-04:** `Editar datos personales` menciona teléfono, y el SDD de backend M02 no lo define (RC-07).
- **RM-ING-05:** eliminar cuenta aún no valida vínculos activos (`409`) ni retención (`ADR-005`) en backend.
- **RM-ING-06:** la maqueta incluye funciones de backend pendientes. Para el 2 de diciembre deben implementarse o acordarse con el docente, porque el lineamiento 4 no permite eliminarlas.

## Aprobación

| Estado | Revisor | Fecha | Evidencia |
|---|---|---|---|
| Borrador | — | — | Pendiente de revisión docente/equipo (G-M06) |
