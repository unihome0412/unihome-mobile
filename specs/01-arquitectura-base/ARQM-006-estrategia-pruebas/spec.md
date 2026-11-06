# ARQM-006 — Estrategia de pruebas del cliente

**Versión:** 0.1.0 | **Estado:** Propuesto — requiere aprobación | **Depende de:** `../../../constitution.md` (CM-03, CM-08, CM-10), `ARQM-001` | **Amplía:** ARM-015 | **Lineamiento:** 7 (pruebas unitarias, de seguridad e integración) | **Contraparte backend:** `docs/estrategia-pruebas.md`.

## Propósito
Definir qué se probará, con qué tipo de prueba y con qué criterios, **sin ejecutar nada**. Los casos concretos viven en `tests/`.

## Pirámide

| Tipo | Qué cubre | Dónde se especifica | Herramienta (Propuesta, MM-108) |
|---|---|---|---|
| Unitarias | Lógica del cliente sin red ni dispositivo: validadores, máquina de estados de sesión, mapeo de errores, catálogo de textos | `tests/unitarias/` | Jest |
| Componente / integración | Pantallas y capas juntas con una API simulada que respeta el contrato: flujos de F01/F02 | `tests/integracion/` | React Native Testing Library + simulador de API |
| Contrato | El cliente frente a la especificación OpenAPI del backend (cuando exista) | `tests/integracion/` | Por definir (ADR-M003) |
| Seguridad | Almacenamiento, registros, antienumeración, manifiesto, dependencias, secretos | `tests/seguridad/` | Revisión + herramientas de INFM-003 |
| Extremo a extremo | Recorridos clave en emulador contra un entorno de pruebas | (futuro) | Por definir; se ejecuta bajo demanda o nocturno, no en cada PR |

## Requisitos

| ID | Requisito (DEBE) | Norma |
|---|---|---|
| MV-A06-R01 | Todo criterio Gherkin de F01/F02 tiene al menos un caso en `tests/` y cada caso cita HU y requisito | CM-10 |
| MV-A06-R02 | Las pruebas **no usan datos reales**: correos con dominio reservado `.invalid`, contraseñas generadas en la prueba, sin cuentas de producción | CM-07 |
| MV-A06-R03 | Las pruebas de integración usan una API simulada fiel al contrato; **nunca** apuntan al backend de producción | CM-15 |
| MV-A06-R04 | La cobertura se mide y se publica; el umbral se acuerda **por riesgo** (sesión, autenticación, manejo de errores, formularios de registro/login) y no solo por porcentaje global | INFM-001 |
| MV-A06-R05 | Las pruebas de seguridad del cliente verifican: tokens fuera de almacenamiento inseguro, ausencia de PII en registros, mensajes sin enumeración, manifiesto (permisos, tráfico en claro, respaldos, depuración) y dependencias | ARQM-002 |
| MV-A06-R06 | La **matriz de dispositivos y versiones de Android** se define antes de ejecutar pruebas en dispositivo/emulador (DEC-M02); no se afirma compatibilidad sin ella | CM-13 |
| MV-A06-R07 | No se fijan objetivos numéricos de rendimiento sin medición previa en dispositivos representativos | CM-08 |
| MV-A06-R08 | Ningún caso se declara ejecutado ni se adjunta evidencia hasta que exista implementación autorizada | CM-08 |
| MV-A06-R09 | Las pruebas de accesibilidad verifican etiquetas, foco, contraste y anuncio de errores en F01/F02 | ARQM-005 |

## Convención de IDs
`UT-Fxx-NNN`, `IT-Fxx-NNN`, `ST-Fxx-NNN`; transversales `UT-ARQM-NNN`, `ST-TRANS-NNN`. Ver `specs/_templates/test-case-template.md`.

## Referencias
`tests/README.md`.
