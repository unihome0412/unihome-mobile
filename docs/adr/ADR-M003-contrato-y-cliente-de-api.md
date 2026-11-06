# ADR-M003 · Contrato y cliente de API

- Estado: **Propuesto — sin aprobación** · Fecha: 2026-11-03 · Relacionado: MM-105, ARQM-004, ALN-09, CM-06, CM-16

## Contexto
El backend declara `/api/v1`, JSON camelCase y `ProblemDetails`, y OpenAPI accesible solo en desarrollo. Los DTOs de F01/F02 existen parcialmente (ver ALN-01).

## Alternativas
**A:** Cliente generado desde el OpenAPI del backend. **B:** Cliente escrito a mano con tipos derivados de las specs. **C:** Mezcla: tipos generados + capa propia de manejo de errores.

## Propuesta (NO ratificada)
**C** cuando el backend publique OpenAPI estable; mientras tanto, **B** con los DTOs de las specs marcados como Propuestos. El cliente nunca dependerá de campos no definidos.

## Consecuencias
Un cambio de contrato rompe la compilación de tipos y obliga a revisar F01/F02. Debe existir una versión del contrato fijada por etiqueta (compatibilidad, ARQM-004).

## Criterios de aprobación
- [ ] Backend confirma entrega de OpenAPI. - [ ] Equipo valida herramienta de generación.
