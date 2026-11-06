# ARQM-005 — Convenciones de interfaz, formularios y accesibilidad

**Versión:** 0.1.0 | **Estado:** Propuesto — requiere aprobación | **Depende de:** `../../../constitution.md` (CM-02, CM-07, CM-13), `ARQM-001`, `ARQM-004` | **Amplía:** ARM-013, ARM-014 | **Referencia visual:** maqueta autorizada (lineamiento 4).

## Propósito
Reglas comunes para construir pantallas sin repetir decisiones y sin definir diseño gráfico. Los colores, tipografías y composiciones **los fija la maqueta**; esta spec solo fija el comportamiento.

## Requisitos

| ID | Requisito (DEBE) | Norma |
|---|---|---|
| MV-A05-R01 | La interfaz se desarrolla a imagen de la maqueta; se pueden **agregar** funciones, nunca eliminar lo que la maqueta incluye | Lineamiento 4 |
| MV-A05-R02 | Todo texto visible sale de un **catálogo de textos** en español de México (sin cadenas literales en las pantallas); los mensajes de error se identifican por clave | CM-13 |
| MV-A05-R03 | Los formularios validan **al salir del campo y al enviar**; el error se muestra bajo el campo con texto claro; al enviar con errores, el foco va al primer campo inválido | CM-13 |
| MV-A05-R04 | La validación del cliente es **de experiencia**: refleja reglas del backend pero nunca sustituye al servidor; ante discrepancia gana el servidor | CM-05 |
| MV-A05-R05 | Los campos declaran tipo de teclado, sugerencias de autocompletado del sistema (correo, contraseña nueva/actual, código de un solo uso) y reglas de mayúsculas/corrección apropiadas; la contraseña ofrece **mostrar/ocultar** | CM-07 |
| MV-A05-R06 | Durante una solicitud: se muestra progreso, la acción queda deshabilitada y se evita el doble envío; al fallar, se conserva lo escrito (excepto contraseñas y códigos) | ARQM-004 |
| MV-A05-R07 | Cada pantalla define sus estados con el vocabulario de `ARQM-003` (cargando, vacío, error, sin conexión, no autorizado, límite de uso) y evita estados sin salida (siempre hay acción de reintento o regreso) | CM-13 |
| MV-A05-R08 | **Accesibilidad:** roles y etiquetas accesibles en todo control; orden de foco lógico; objetivos táctiles de tamaño suficiente (guía de Android: 48 dp); contraste suficiente; soporte de tamaño de fuente del sistema; los errores se anuncian a lectores de pantalla | CM-13 |
| MV-A05-R09 | El botón «atrás» del sistema y los gestos tienen comportamiento definido por pantalla; no se sale de un flujo con datos escritos sin aviso | CM-13 |
| MV-A05-R10 | La interfaz respeta pantalla completa de borde a borde y las áreas del sistema (barras, recortes, teclado), requisito de la plataforma al apuntar a la API 36 (verificar al implementar) | INFM-004 |
| MV-A05-R11 | Las fechas se muestran en formato regional y se capturan con selección guiada (día, mes, año) cuando la maqueta lo defina | MM-109 |
| MV-A05-R12 | Los textos legales (aviso de privacidad) se muestran completos, con versión visible, y enlazan a la página pública del proyecto cuando exista; su URL es valor de ambiente (en blanco hasta acuerdo) | Lineamiento 16, CM-16 |
| MV-A05-R13 | Los componentes se organizan en una biblioteca interna reutilizable (controles básicos, campo de formulario, aviso, diálogo de confirmación, estado vacío/error); no se crean variantes por pantalla sin justificación | CM-09 |

## Exclusiones
Diseño gráfico (colores, tipografías, ilustraciones), animaciones y navegación entre módulos no autorizados.

## Referencias a pruebas
`tests/unitarias/UT-ARQM.md` (accesibilidad y catálogo), casos de F01 y F02.
