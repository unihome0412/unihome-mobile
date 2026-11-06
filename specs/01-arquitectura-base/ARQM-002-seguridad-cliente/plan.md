# Plan — ARQM-002 Seguridad del cliente móvil

**Estado:** Propuesto — requiere aprobación | **Spec:** [spec.md](spec.md) | **Bloqueos:** ADR-M002, ADR-M004, DEC-M12.

## Secuencia
1. Aprobar el modelo de amenazas (`docs/modelo-amenazas-movil.md`) y priorizar THM-01, THM-04, THM-06 y THM-07 (mayor impacto en F01/F02 y en el pipeline).
2. Aprobar ADR-M002 (almacenamiento de sesión) antes de especificar la renovación de tokens (ARQM-003).
3. Fijar la política de registro sin datos personales (R05) y reflejarla en INFM-005.
4. Definir los *gates* de seguridad del cliente en INFM-003 (secretos, dependencias, permisos, configuración de manifiesto).
5. Revisar F01/F02 contra R05–R07 antes de aprobarlas.

## Pruebas de mayor riesgo a escribir primero
`ST-F02-004` (reutilización/renovación de token), `ST-F01-002` y `ST-F02-001` (antienumeración), `ST-TRANS-001` (credenciales fuera de almacenamiento inseguro), `ST-TRANS-003` (sin PII en registros).

## Dependencias cruzadas
ARQM-003 (sesión), ARQM-004 (errores), INFM-003 (gates), INFM-005 (secretos), backend `ARQ-002` (controles del servidor).

## Criterio de salida
Requisitos aprobados, THM revisadas, decisiones DEC-M12 y ADR-M002/M004 resueltas. Estado permanece **Propuesto** en esta entrega.
