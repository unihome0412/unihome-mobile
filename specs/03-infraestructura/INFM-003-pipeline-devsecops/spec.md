# INFM-003 — Pipeline DevSecOps del cliente móvil

**Versión:** 0.1.0 | **Estado:** Propuesto — requiere aprobación | **Depende de:** `../../constitution.md` (CM-07, CM-09, CM-11, CM-15), `ARQM-002`, `INFM-001`, `INFM-002` | **Lineamientos:** 5, 7 | **Amenazas:** THM-02, THM-06, THM-07 | **Contraparte backend:** `INF-003-pipeline-devsecops` (Propuesto, backend).

> Ningún escaneo se ejecuta ni se afirma como realizado. Las herramientas son **candidatas**; cada una requiere ADR o aprobación según CM-09. Las condiciones de licencia y de gratuidad de cada herramienta **se verifican al elegirla** (por ejemplo, algunas funciones solo son gratuitas en repositorios públicos).

## Gates y herramientas candidatas

| Control | Qué detecta | Herramienta candidata | Umbral de bloqueo propuesto | MASVS |
|---|---|---|---|---|
| Secretos | Llaves, tokens, contraseñas en código e historial | Escáner de secretos de código abierto | **Cualquier** hallazgo válido bloquea | STORAGE |
| SAST | Vulnerabilidades en TypeScript/JavaScript | Análisis estático de código del repositorio (p. ej., CodeQL o Semgrep CE) | Crítico/Alto bloquea; Medio requiere revisión | CODE |
| SCA | Dependencias con vulnerabilidades conocidas | Auditoría del gestor de paquetes + base de vulnerabilidades abierta; actualizaciones de dependencias con revisión humana | Crítico/Alto **explotable** bloquea sin excepción | CODE |
| Licencias | Licencias incompatibles | Verificador de licencias | Lista de licencias no permitidas **por definir** | — |
| SBOM | Inventario de componentes | Generador CycloneDX/SPDX para npm | Se genera en cada `release`; falta de SBOM bloquea la release | CODE |
| Manifiesto y permisos | Permisos nuevos, componentes exportados, tráfico en claro, depuración, respaldos | Inspección del manifiesto del paquete (p. ej., con bundletool) y reglas propias | **Cualquier permiso nuevo** bloquea hasta aprobación explícita | PLATFORM, NETWORK |
| Configuración de compilación | Release depurable, sin minificación, llaves de firma en el repositorio | Reglas propias sobre archivos de compilación | Bloquea | CODE |
| Análisis del binario | Secretos y debilidades en el `.aab`/APK | Herramienta de análisis estático móvil **por definir** (verificar soporte de `.aab`) | Por definir | RESILIENCE |
| Pipeline | Acciones sin fijar, permisos excesivos, uso inseguro de eventos | Revisión de workflows (reglas propias o analizador) | Bloquea | — |

## Requisitos

| ID | Requisito (DEBE) | Norma |
|---|---|---|
| MV-I03-R01 | El escáner de secretos corre en cada PR y se revisa el **historial inicial** del repositorio antes de usarlo | THM-02 |
| MV-I03-R02 | SAST y SCA corren en cada PR; SCA además por calendario para detectar nuevas vulnerabilidades | THM-06 |
| MV-I03-R03 | Las actualizaciones automáticas de dependencias abren PR, **nunca se fusionan solas**; requieren revisión y CI verde | THM-06 |
| MV-I03-R04 | Se genera SBOM en cada release y se archiva con el lanzamiento | THM-06 |
| MV-I03-R05 | El gate de manifiesto compara con una **línea base aprobada** y falla ante permisos, componentes exportados, tráfico en claro, depuración o respaldos no aprobados | MV-A02-R09/R10 |
| MV-I03-R06 | Las acciones de CI/CD se fijan por SHA y los workflows se revisan con la misma rigurosidad que el código | THM-07 |
| MV-I03-R07 | Las **excepciones** a un bloqueo tienen responsable, justificación, fecha de vencimiento y aprobación humana; no se aceptan por agentes | CM-12 |
| MV-I03-R08 | Los plazos de corrección por severidad se definen **antes** de ejecutar escaneos; no se inventan aquí | CM-04 |
| MV-I03-R09 | Los escaneos nunca apuntan a producción y los reportes no incluyen datos personales ni secretos | CM-07 |
| MV-I03-R10 | Cada dependencia nativa o con permisos del sistema se justifica por escrito (problema, alternativa, mantenimiento) antes de añadirse | CM-09 |
| MV-I03-R11 | Los resultados son visibles para el equipo (pestaña de seguridad o artefactos) y se resumen en el PR | CM-08 |

## Criterios de salida
Herramientas elegidas con verificación de licencia y costo, umbrales y plazos aprobados, línea base del manifiesto definida y política de excepciones vigente.
