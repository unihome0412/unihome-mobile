# FT-05 diseno-figma-ui — Maqueta vigente y sistema de diseño

**ID:** SPEC-MOV-DIS-001  
**Versión:** 1.0.0  
**Estado:** Borrador documental / inventario parcial  
**Rector:** `../../.specify/memory/constitution.md` (CM-16)  
**Etapa:** especificación documental; ninguna tarea ejecutada.

## 1. Contexto y objetivo

Registrar la maqueta vigente, lo que se ha podido verificar de ella y las reglas para llevarla a la app móvil.

**Maqueta:** [Pantallas móviles UniHome en Figma Make](https://www.figma.com/make/rFp3lbBxtw2amKSDotP9Jy/Pantallas-m%C3%B3viles-UniHome)  
**Revisada:** 5 de noviembre de 2026.  
**Naturaleza:** prototipo web interactivo en React con datos de ejemplo. Es referencia visual y funcional; no se reutiliza como código de producción.

## 2. Requisitos

| ID | Requisito (DEBE) | Norma |
| --- | --- | --- |
| DIS-01 | Tomar esta maqueta como referencia visual vigente | CM-16 |
| DIS-02 | Congelar una versión o fecha antes de implementar | CM-16 |
| DIS-03 | Traducir colores, tipografía, espacios, radios, sombras e íconos a tokens de React Native | CM-16 |
| DIS-04 | Construir componentes equivalentes, sin copiar elementos solo web | CM-09, CM-16 |
| DIS-05 | Registrar cualquier pantalla que la API necesite y no esté en la maqueta | CM-16 |
| DIS-06 | Excluir de producción datos de ejemplo, cuentas demo y textos de prototipo | CM-05, CM-08 |
| DIS-07 | No eliminar funciones de la maqueta sin aprobación | Lineamiento 4; MM-009 |
| DIS-08 | Comparar visualmente cada pantalla antes de aceptarla | CM-16 |

## 3. Requisitos no funcionales

Español de México, accesibilidad, área táctil suficiente y buen comportamiento en distintos tamaños de pantalla Android (CM-13). Credenciales de Figma nunca versionadas.

## 4. Inventario de la maqueta

**Evidencia:** `Vista previa` = abierta el 5 de noviembre de 2026. `Historial` = mencionada en los cambios de Figma Make; falta verificarla pantalla por pantalla.

| Área | Pantalla o ruta | Evidencia |
| --- | --- | --- |
| Acceso | Bienvenida `/` | Vista previa |
| Acceso | Iniciar sesión `/acceso` | Vista previa |
| Acceso | Crear cuenta `/registro` | Vista previa |
| Estudiante | Universidad `/universidad` | Vista previa |
| Estudiante | Mapa `/mapa` | Vista previa |
| Estudiante | Lista y filtros `/explorar` | Vista previa |
| Estudiante | Mensajes `/chat` | Vista previa, estado vacío |
| Cuenta | Perfil `/perfil` y sus opciones | Vista previa |
| Estudiante | Detalle de alojamiento | Historial |
| Estudiante | Favoritos | Historial |
| Estudiante | Mi renta e historial | Historial |
| Estudiante | Unirse con código | Historial |
| Estudiante | Reparaciones | Historial |
| Común | Notificaciones | Historial |
| Arrendador | Propiedades, unidades y publicación | Historial |
| Arrendador | Renta, control de rentas, resumen y conversaciones | Historial |
| Arrendador | Verificación de documentos | Historial |
| Administración | Usuarios, universidades y revisión de expedientes | Historial |

**Inventario pendiente:** rutas exactas y estados de las pantallas marcadas `Historial`.

### Tokens observados, no definitivos

| Token propuesto | Valor |
| --- | --- |
| `color.primary` | `#D9544A` |
| `color.primaryDark` | `#B8453C` |
| `color.primarySoft` | `#FDECEA` |
| `color.secondary` | `#70B0A6` |
| `color.secondaryDark` | `#285E55` |
| `color.secondarySoft` | `#E5F4F1` |

Faltan tipografía, escala de espacios, radios, sombras y la exportación de logo e ilustraciones.

## 5. Criterios de aceptación

- **AC-DIS-01:** Dado el paquete, entonces la URL de la maqueta está registrada (DIS-01).
- **AC-DIS-02:** Antes de implementar, existe una fecha o versión congelada (DIS-02).
- **AC-DIS-03:** Dada una pantalla de la app, entonces usa tokens y componentes registrados (DIS-03, DIS-04).
- **AC-DIS-04:** Dada una versión publicable, entonces no contiene cuentas demo ni textos de prototipo (DIS-06).
- **AC-DIS-05:** Dado un cambio de alcance, entonces ninguna función se eliminó sin aprobación (DIS-07).

## 6. Plan de pruebas

Revisión documental ahora. En el futuro: comparación visual y revisión de accesibilidad en Android. **No ejecutadas.**

## 7. Riesgos, límites y deuda

- **RM-DIS-01:** el inventario es parcial porque se revisó la vista previa y el historial, no todo el código.
- **RM-DIS-02:** la maqueta incluye más funciones de las que existen en la API. Ver `FT-06`.
- **RM-DIS-03:** copiar componentes web a React Native puede romper comportamiento y accesibilidad.
- **RM-DIS-04:** `G-M07` sigue pendiente hasta completar tokens y congelar versión.

## Aprobación

| Estado | Revisor | Fecha | Evidencia |
|---|---|---|---|
| Borrador | — | — | Pendiente de revisión docente/equipo |
