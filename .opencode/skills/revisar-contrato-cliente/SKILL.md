---
name: revisar-contrato-cliente
description: Revisa que una spec funcional del cliente respete el contrato del backend, deje URLs en blanco y marque DTOs no definidos como Propuestos.
---
# Revisar contrato del cliente

## Cuándo utilizar
Al revisar `specs/02-funcionalidades/**` o cualquier JSON de solicitud/respuesta.

## Procedimiento (solo lectura)
1. Confirmar que cada endpoint se referencia por ID (`EP-Mxx-NN`) y que la URL está **en blanco**.
2. Comparar nombres de campo con el backend (`M01`) y con `ARQM-004` (formato, errores, 401/403/429).
3. Verificar que los DTOs no definidos están marcados **Propuesto — por acordar** y que los JSON usan datos ficticios.
4. Verificar que cada error tiene estado de interfaz y que cada Gherkin tiene caso en `tests/`.
5. Reportar hallazgos con gravedad; no editar.
