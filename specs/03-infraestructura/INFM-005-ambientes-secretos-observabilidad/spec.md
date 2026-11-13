# INFM-005 — Ambientes, secretos y observabilidad del cliente móvil

**Versión:** 0.2.0 | **Estado:** Nombres y gates preparados; environments y secretos no configurados | **Depende de:** `../../constitution.md` (CM-05, CM-07, CM-13, CM-15), `ARQM-002`, `ARQM-004` | **Lineamientos:** 15 (observabilidad, del backend), 16 | **Contraparte backend:** `INF-004-ambientes-secretos-observabilidad` (Propuesto, backend).

> Todos los valores de ambiente (direcciones, identificadores, claves) están **en blanco** hasta acuerdo (CM-06, CM-16). No se crearon cuentas, secretos ni credenciales.

## Estado 2026-11-12

- Environments definidos por nombre: `android-release`, `play-internal`, `play-closed`, `play-production`; su protección debe configurarse y comprobarse en GitHub.
- Secretos requeridos, solo por nombre: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`, `ANDROID_UPLOAD_CERT_SHA256`, `PLAY_SERVICE_ACCOUNT_JSON`.
- Variables de habilitación: `RELEASE_BUILD_ENABLED`, `PLAY_PUBLISHING_ENABLED`, `PLAY_PRODUCTION_ENABLED`, `PLAY_PRODUCTION_ROLLOUT_ENABLED`.
- Variable de pista cerrada: `PLAY_CLOSED_TRACK` con el identificador real de Play Console; no es un secreto.
- No hay valores reales en el repositorio ni en el historial. La limpieza del keystore ocurre con `if: always()`.
- Observabilidad y diagnóstico del cliente siguen sin implementación; no se modificó lógica funcional.

## Ambientes del cliente

| Ambiente | Pista de Play (INFM-002) | Backend objetivo | ID de aplicación | Datos |
|---|---|---|---|---|
| `dev` | Interna | Desarrollo | `(en blanco) + sufijo de ambiente` (Propuesta) | Ficticios |
| `staging` | Cerrada | Validación | `(en blanco) + sufijo de ambiente` (Propuesta) | Ficticios o anonimizados |
| `prod` | Producción | Producción | `(en blanco)` — definitivo, no cambia tras publicar | Reales |

## Configuración pública por ambiente (todo distribuido en la app es público)

| Clave | Ejemplo de uso | Valor |
|---|---|---|
| Dirección base de la API | Capa de acceso a API (`ARQM-004`) | *(en blanco)* |
| Dirección de salud del backend | Verificación de CD (MV-I02-R06) | *(en blanco)* |
| URL pública del aviso de privacidad | Pantalla de registro (F01) | *(en blanco)* |
| URL de eliminación de cuenta (web) | Requisito de Google Play | *(en blanco)* |
| Identificadores públicos de servicios | Notificaciones, mapas (si se autorizan) | *(en blanco)* |

## Inventario de secretos (solo nombres; sin valores)

| Secreto | Uso | Dónde vive | Custodia / rotación |
|---|---|---|---|
| Llave de carga (keystore) y alias/contraseñas | Firmar el `.aab` | Secreto de ambiente del CI/CD (cifrado); copia offline | ≥ 2 personas; plan de recuperación con Play |
| Cuenta de servicio de la API de publicación | Subir a pistas de Play | Secreto de ambiente del CD | Alcance mínimo; rotación; revocación documentada |
| Token del servicio de compilación (si se elige ADR-M004 A) | Compilar en la nube | Secreto de ambiente | Rotación; alcance mínimo |
| Credenciales de la cuenta de revisión de Play | Acceso de revisores a la app | **Solo** en la consola de Play | Cuenta ficticia dedicada; datos ficticios |
| Token del proveedor de diagnóstico (si se elige) | Reporte de fallos | Configuración pública restringida o secreto según proveedor | Por definir (DEC-M08) |

## Requisitos

| ID | Requisito (DEBE) | Norma |
|---|---|---|
| MV-I05-R01 | Existen tres ambientes (`dev`, `staging`, `prod`) con configuración separada inyectada en compilación; ninguna dirección de producción aparece en `dev` ni `staging` | CM-15 |
| MV-I05-R02 | Los valores de ambiente permanecen **en blanco** en este paquete y no se copian de otros documentos | CM-16 |
| MV-I05-R03 | Todo secreto vive en el gestor de secretos del CI/CD por ambiente con alcance mínimo; ninguno en repositorio, binario, registros ni documentos | CM-07 |
| MV-I05-R04 | La llave de carga tiene custodia de al menos dos personas, copia offline y procedimiento de recuperación documentado | THM-07 |
| MV-I05-R05 | La rotación y revocación de cada secreto se documentan **antes** de usarlo | CM-15 |
| MV-I05-R06 | La cuenta de revisión de Google Play es ficticia y dedicada; sus credenciales **no** se versionan | THM-13 |
| MV-I05-R07 | **Registros del cliente:** niveles por ambiente; en `prod` solo eventos técnicos mínimos; **nunca** datos personales, contraseñas, tokens ni códigos | MV-A02-R05 |
| MV-I05-R08 | El diagnóstico de fallos parte de la información que ofrece la consola de Play (estabilidad); un proveedor adicional requiere decisión (DEC-M08), minimización de datos y aviso de privacidad | CM-07 |
| MV-I05-R09 | El cliente conserva el `traceId` de errores de red para soporte, sin datos personales asociados (ver `ARQM-004` R10) | CM-07 |
| MV-I05-R10 | Las señales a observar se definen sin umbrales inventados: estabilidad de la app, errores por tipo (5xx, 429), arranques fallidos de sesión | CM-08 |
| MV-I05-R11 | Los registros y artefactos de CI tienen retención corta y no contienen datos sensibles | CM-07 |

## Criterios de salida
Inventario de secretos y custodia aprobados, ambientes y sufijos definidos, decisión de diagnóstico (DEC-M08) y valores de ambiente entregados por el equipo.
