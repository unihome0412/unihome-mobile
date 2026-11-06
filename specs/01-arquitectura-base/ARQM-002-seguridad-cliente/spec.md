# ARQM-002 — Seguridad del cliente móvil

**Versión:** 0.1.0 | **Estado:** Propuesto — requiere aprobación | **Depende de:** `../../../constitution.md` (CM-05, CM-07, CM-11, CM-15), `ARQM-001`, `docs/modelo-amenazas-movil.md` | **Amplía:** ARM-005, ARM-008, ARM-009, ARM-010, ARM-011 | **Contraparte backend:** `ARQ-002-seguridad-transversal`.

## Propósito
Establecer los requisitos transversales de seguridad y privacidad del cliente móvil de UniHome (Android / React Native) bajo el principio de **dispositivo no confiable** (CM-05) y el marco de verificación **OWASP MASVS v2** (`STORAGE`, `CRYPTO`, `AUTH`, `NETWORK`, `PLATFORM`, `CODE`, `RESILIENCE`, `PRIVACY`).

## Requisitos

| ID | Requisito (DEBE) | Norma / amenaza | Tareas | Pruebas |
|---|---|---|---|---|
| MV-A02-R01 | Toda credencial de sesión (`refreshToken` y, si aplica según ADR-M002, `accessToken`) **DEBE** almacenarse únicamente en el almacenamiento seguro del sistema respaldado por Android Keystore; nunca en almacenamiento plano, caché de consultas ni respaldos | CM-07, THM-01 | MV-A02-T01, MV-A02-T02 | ST-TRANS-001 |
| MV-A02-R02 | El paquete distribuido de la aplicación (`.aab`/APK) y el repositorio **NO DEBEN** contener secretos de servidor, llaves privadas, tokens de terceros con privilegios ni cadenas de conexión; todo valor empacado en el cliente se considera público | CM-05, CM-07, THM-02 | MV-A02-T01, MV-A02-T03 | ST-TRANS-005 |
| MV-A02-R03 | Toda comunicación en entornos de validación y producción **DEBE** usar exclusivamente HTTPS con validación TLS estándar activa (`cleartextTrafficPermitted=false`). En entorno de desarrollo local (`local`), cualquier excepción hacia el backend local se restringe exclusivamente a configuración de desarrollo y nunca se incluye en builds de release | CM-07, THM-03 | MV-A02-T01, MV-A02-T04 | ST-TRANS-002 |
| MV-A02-R04 | La fijación de certificados (*certificate pinning*) **NO DEBE** activarse sin un ADR aprobado y un plan operativo de rotación de certificados (DEC-M12), para evitar bloquear a los usuarios ante renovaciones de TLS | CM-09, THM-03 | MV-A02-T01, MV-A02-T04 | — |
| MV-A02-R05 | Los registros del cliente (*logs*), reportes de diagnóstico y trazas **NO DEBEN** incluir datos personales (nombre, correo, teléfono, fecha de nacimiento), contraseñas, códigos de verificación ni tokens de sesión | CM-07, THM-05, INFM-005 | MV-A02-T01, MV-A02-T05 | ST-TRANS-003 |
| MV-A02-R06 | Los mensajes mostrados en registro, inicio de sesión y recuperación **NO DEBEN** permitir enumerar si un correo o cuenta existe cuando el contrato del backend lo oculta deliberadamente (antienumeración) | CM-07, THM-04 | MV-A02-T01, MV-A02-T08 | ST-F01-002, ST-F02-001 |
| MV-A02-R07 | Los campos de contraseña y código de confirmación **DEBEN** deshabilitar sugerencias inseguras de teclado, evitar copia al portapapeles de valores ocultos y limpiarse de memoria al abandonar la pantalla | CM-07, THM-05 | MV-A02-T01, MV-A02-T05 | ST-F01-004, ST-F02-005 |
| MV-A02-R08 | El manifiesto de Android **DEBE** excluir del respaldo automático (`allowBackup=false` o reglas de extracción equivalentes en Android 12+) cualquier archivo local que pueda contener estado de sesión o caché | CM-07, THM-01, THM-05 | MV-A02-T01, MV-A02-T04 | ST-TRANS-004 |
| MV-A02-R09 | La aplicación **DEBE** declarar únicamente los permisos del sistema estrictamente necesarios para las funciones activas, solicitándolos en contexto y con explicación previa; en `F01` y `F02` no se solicita ningún permiso peligroso | CM-07, Lineamiento 16, THM-08 | MV-A02-T01, MV-A02-T06 | ST-TRANS-004 |
| MV-A02-R10 | Todo componente de Android (`Activity`, `Service`, `BroadcastReceiver`, `ContentProvider`) **DEBE** declarar `android:exported="false"` salvo el punto de entrada principal y los enlaces profundos explícitamente aprobados y validados | CM-07, THM-08 | MV-A02-T01, MV-A02-T06 | ST-TRANS-004 |
| MV-A02-R11 | Las compilaciones de distribución (`release`) **NO DEBEN** ser depurables (`android:debuggable="false"`) ni exponer herramientas de desarrollo de React Native | CM-07, CM-15 | MV-A02-T01, MV-A02-T07 | ST-TRANS-004 |
| MV-A02-R12 | Las dependencias de terceros (npm y módulos nativos) **DEBEN** fijarse mediante archivo de bloqueo (*lockfile*), auditarse contra vulnerabilidades conocidas y generar inventario SBOM en cada entrega conforme a `INFM-003` | CM-09, THM-06 | MV-A02-T01, MV-A02-T07 | ST-TRANS-006 |
| MV-A02-R13 | La llave de carga (*upload keystore*) utilizada para firmar el paquete de distribución **DEBE** custodiarse fuera del repositorio en secretos de ambiente conforme a `INFM-002` e `INFM-005` | CM-15, THM-07 | MV-A02-T01, MV-A02-T03 | — |
| MV-A02-R14 | El código fuente y el paquete **NO DEBEN** depender de la ofuscación como único control de seguridad; la autoridad de reglas de negocio, permisos y validación reside siempre en el backend | CM-05, THM-02 | MV-A02-T01, MV-A02-T07 | — |
| MV-A02-R15 | La recolección de datos en registro y el aviso de privacidad **DEBEN** alinearse con la decisión sobre mayoría de edad y público objetivo (`DEC-10` del backend y `DEC-M10`), exigiendo consentimiento expreso antes de crear la cuenta | CM-07, Lineamiento 16, THM-12 | MV-A02-T01, MV-A02-T08 | ST-F01-005 |

## Referencias de trazabilidad
- **Plan:** [plan.md](plan.md)
- **Tareas:** [task.md](task.md) (`MV-A02-T01` a `MV-A02-T08`)
- **Modelo de amenazas:** `../../../docs/modelo-amenazas-movil.md` (`THM-01` a `THM-13`)
- **Pruebas:** `../../../tests/seguridad/ST-transversal-movil.md`, `ST-F01.md`, `ST-F02.md`
