# Especificación de pruebas del cliente móvil

**Estado:** Borrador — **ningún caso ejecutado** (CM-08). Estos archivos son *especificación de prueba*, no código ni resultados. Plantilla: `../specs/_templates/test-case-template.md`. Estrategia: `../specs/01-arquitectura-base/ARQM-006-estrategia-pruebas/spec.md`.

| Carpeta | Contenido | Lineamiento |
|---|---|---|
| `unitarias/` | `UT-F01.md`, `UT-F02.md`, `UT-ARQM.md` | 7 |
| `integracion/` | `IT-F01.md`, `IT-F02.md` | 7 |
| `seguridad/` | `ST-F01.md`, `ST-F02.md`, `ST-transversal-movil.md` | 7 |

**Reglas:** datos ficticios (correos `.invalid`); API simulada fiel al contrato, nunca producción; los casos marcados **Bloqueado** dependen de una decisión pendiente y no pueden escribirse como definitivos hasta resolverla. Cada caso cita HU y requisito.
