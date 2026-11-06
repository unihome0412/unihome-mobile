# Plantilla de caso de prueba (cliente móvil, v2)

Toda fila en `tests/**` sigue esta forma:

| Campo | Contenido |
|---|---|
| ID | `UT-Fxx-NNN` / `IT-Fxx-NNN` / `ST-Fxx-NNN` (o `-ARQM-`/`-TRANS-` para transversales) |
| HU / requisito | `HU-xxx` y `MV-Fxx-Rnn` |
| Contrato | `EP-Mxx-NN` o unidad del cliente |
| Precondición | Estado previo (sin datos reales) |
| Pasos | Acción concreta |
| Resultado esperado | Estado de interfaz / HTTP simulado / evento |
| Tipo | Éxito / Error / Seguridad / Accesibilidad |

Es especificación de prueba, no código ni resultado: no se declara ejecutada ni se adjunta evidencia hasta que exista implementación autorizada (CM-08). Datos siempre ficticios.
