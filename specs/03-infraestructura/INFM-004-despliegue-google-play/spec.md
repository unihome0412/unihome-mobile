# INFM-004 — Despliegue y publicación en Google Play

**Versión:** 0.1.0 | **Estado:** Propuesto — requiere aprobación | **Depende de:** `../../constitution.md` (CM-07, CM-15), `INFM-002`, `INFM-005`, ADR-M004, ADR-M005 | **Lineamientos:** 1 (evaluación inicia descargando la app de Google Play), 16, 19 | **Decisiones:** DEC-M01 (URGENTE), DEC-M10, DEC-M02 | **Riesgos:** THM-13, RM-08, RC-06.

> No se crea cuenta, aplicación ni lanzamiento (CM-03). Los requisitos de la tienda cambian: la fila «Verificado» indica fuente oficial y fecha; todo lo demás **se verifica al ejecutar** (CM-15).

## 1. Requisitos de tienda verificados el 2026-11-03

| Requisito | Estado | Fuente | Efecto en el proyecto |
|---|---|---|---|
| Aplicaciones y actualizaciones nuevas deben apuntar a **Android 16 (API 36)** desde 2026-08-31 | **Verificado (oficial)** | Ayuda de Play Console, «Target API level requirements» (`support.google.com/googleplay/android-developer/answer/11926878`) | `targetSdk` 36 obligatorio; condiciona ADR-M001 y la interfaz de borde a borde (MV-A05-R10) |
| Cuentas **personales** creadas tras el 2023-11-13: prueba cerrada con **≥ 12 testers inscritos de forma continua durante 14 días** antes de solicitar acceso a producción | **Verificado (oficial)** | Ayuda de Play Console, «App testing requirements for new personal developer accounts» (`support.google.com/googleplay/android-developer/answer/14151465`) | Calendario crítico (ADR-M005, DEC-M01) |
| Formato de publicación `.aab` para apps nuevas | Por verificar | Documentación de Play | Artefacto de INFM-002 |
| Código nativo compatible con páginas de memoria de 16 KB (apps que apuntan a Android 15+) | Por verificar (fuente secundaria: fecha reportada 2027-02-01) | Documentación de Android | Revisar módulos nativos al elegirlos (INFM-003) |
| Política de privacidad pública, formulario de Seguridad de los datos, eliminación de cuenta (en la app **y** en un recurso web), reporte/bloqueo en contenido de usuarios, declaraciones de contenido | Por verificar al ejecutar | Políticas de Play | Secciones 5 y 6 |

## 2. Requisitos

| ID | Requisito (DEBE) | Norma |
|---|---|---|
| MV-I04-R01 | Identificar **antes de cualquier trabajo de publicación** el tipo de cuenta (personal u organización) y su fecha de creación, y registrar si aplica la prueba cerrada de 14 días | DEC-M01 |
| MV-I04-R02 | Si aplica la prueba cerrada, iniciarla **de inmediato** con un paquete instalable y mantener ≥ 12 testers inscritos de forma continua durante 14 días; reclutar y registrar testers con anticipación | ADR-M005 |
| MV-I04-R03 | Confirmar con el docente si instalar desde una pista de pruebas satisface el lineamiento 1, y qué evidencia se aceptará para la evaluación del 2026-12-02 | MM-011 |
| MV-I04-R04 | Habilitar **Play App Signing**; la llave de carga cumple `ARQM-002` R13 y `INFM-005` | THM-07 |
| MV-I04-R05 | El identificador de aplicación definitivo se decide **una vez** y no cambia tras publicar; permanece **en blanco** en esta spec | CM-16 |
| MV-I04-R06 | `targetSdk` 36 y compatibilidad con Android 16 verificadas antes de cada envío; la versión mínima de Android la decide DEC-M02 | MM-016 |
| MV-I04-R07 | La **política de privacidad** es una URL pública (landing) y coincide con el aviso que muestra la app; la URL queda en blanco aquí | THM-12 |
| MV-I04-R08 | La declaración de **Seguridad de los datos** refleja exactamente los datos de F01/F02 (nombre, correo, fecha de nacimiento, género, credenciales) y su cifrado en tránsito y eliminación; se revisa en cada versión que cambie datos | CM-07 |
| MV-I04-R09 | **Eliminación de cuenta:** debe existir en la app y en un recurso web público (URL en blanco); se coordina con el backend (`EP-M01-09`) | Lineamiento 16 |
| MV-I04-R10 | El **público objetivo** y la clasificación de contenido se declaran de forma coherente con DEC-10 (registro de menores) y DEC-M10; no se declara una edad que contradiga el comportamiento de la app | DEC-M10 |
| MV-I04-R11 | Si existe contenido de usuarios (chat, reportes), la app ofrece **reportar y bloquear** antes de publicar esa funcionalidad | Políticas de Play |
| MV-I04-R12 | La sección de **acceso a la app** incluye una cuenta de revisión ficticia y dedicada con instrucciones; sus credenciales no se versionan | MV-I05-R06 |
| MV-I04-R13 | Permisos sensibles: **ninguno previsto** en F01/F02; cada permiso nuevo requiere declaración y aprobación (`ARQM-002` R10) | THM-08 |
| MV-I04-R14 | El **lanzamiento a producción** es escalonado y sigue `INFM-002`; no hay publicación automática | CM-15 |
| MV-I04-R15 | Antes de cada envío se revisa el informe previo al lanzamiento y la salud de la app en la consola, y se corrigen bloqueos | CM-13 |
| MV-I04-R16 | La ficha de la tienda (nombre, descripciones en es-MX, ícono, capturas, gráfico de funciones, contacto) se redacta **sin datos personales reales** y con capturas generadas de datos ficticios | CM-07 |
| MV-I04-R17 | Los tiempos de revisión de Google **no se asumen** en el calendario; se registra un margen y un plan alternativo | RC-06 |
| MV-I04-R18 | Las declaraciones sobre funciones financieras, anuncios y servicios externos se completan según el comportamiento real verificado (los pagos de UniHome son solo informativos) | CM-04 |

## 3. Calendario y riesgo (estimación, no garantía)

| Hecho | Valor |
|---|---|
| Fecha de la evaluación | 2026-12-02 |
| Fecha de este análisis | 2026-11-03 |
| Prueba cerrada requerida (si aplica) | 14 días continuos con ≥ 12 testers |
| Límite teórico para completar la prueba antes de la evaluación | 2026-11-18 (2026-12-02 menos 14 días) |
| Tiempo de revisión de Google | **No fijado**; sin margen incluido |

Conclusión: si la cuenta es personal y posterior al 2023-11-13, el calendario es **muy ajustado** y no admite demoras. Alternativas (ADR-M005): cuenta personal anterior a esa fecha, cuenta de organización (requisitos propios y plazos de verificación) o confirmar con el docente un canal de evaluación alternativo. La decisión es del equipo y del docente.

## 4. Flujo por pistas (resumen; detalle en INFM-002)
`Interna → Cerrada → (solicitud de acceso a producción, si aplica) → Producción escalonada`. El primer paquete debe subirse manualmente a la consola para crear la aplicación (por verificar); después puede automatizarse hasta la pista interna y cerrada con aprobación.

## 5. Lista de verificación previa a cada envío (documental)
- [ ] Versión y `versionCode` conforme a INFM-002. - [ ] `targetSdk` 36. - [ ] Manifiesto sin permisos nuevos no aprobados. - [ ] Seguridad de los datos al día. - [ ] Política de privacidad (URL) coincide con el aviso de la app. - [ ] Eliminación de cuenta (app y web). - [ ] Cuenta de revisión vigente. - [ ] Clasificación de contenido y público objetivo coherentes. - [ ] Notas de versión es-MX. - [ ] Informe previo al lanzamiento revisado.

## 6. Datos que F01/F02 declaran (insumo de Seguridad de los datos)
| Dato | Origen | Finalidad (según backend, Propuesto) | Cifrado en tránsito |
|---|---|---|---|
| Nombre | F01 | Identificación de la cuenta | Sí (HTTPS) |
| Correo electrónico | F01, F02 | Identificación, confirmación y acceso | Sí |
| Fecha de nacimiento | F01 | Reglas de edad de la plataforma (DEC-10) | Sí |
| Género | F01 | Datos de la cuenta | Sí |
| Credenciales (contraseña) | F01, F02 | Autenticación; **no se guarda en el dispositivo** | Sí |
| Tokens de sesión | F02 | Mantener la sesión | Sí |

## Criterios de salida
Tipo de cuenta identificado, calendario aprobado con el docente, política de privacidad y eliminación de cuenta publicadas (landing), declaraciones coherentes y checklist revisada con fuente oficial vigente.
