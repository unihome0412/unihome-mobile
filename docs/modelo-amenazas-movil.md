# Modelo de amenazas del cliente móvil (borrador)

**Estado:** Propuesto — requiere aprobación. **Marco de verificación sugerido:** OWASP MASVS v2 (categorías STORAGE, CRYPTO, AUTH, NETWORK, PLATFORM, CODE, RESILIENCE, PRIVACY). Sin escaneos ejecutados. Las amenazas del backend están en su propio `modelo-amenazas.md` (TH-xx); aquí se citan cuando el cliente participa.

| ID | Superficie | Amenaza | Mitigación propuesta (documental) | Spec | Verificación futura |
|---|---|---|---|---|---|
| THM-01 | Sesión en el dispositivo | Robo o lectura de access/refresh token | Almacenamiento seguro del sistema; nunca en caché simple, registros ni respaldos; borrado al cerrar sesión | ARQM-002, ARQM-003 | ST-F02-004, ST-TRANS-001 |
| THM-02 | Paquete de la app | Extracción de secretos o URLs privilegiadas por ingeniería inversa | Cero secretos en el binario; solo configuración pública; no se promete ofuscación como control de seguridad | ARQM-002 | Escaneo de secretos, revisión de manifiesto |
| THM-03 | Red | Intercepción (MITM) | Solo HTTPS; sin tráfico en claro; validación TLS estándar; *pinning* por decidir (DEC-M12) | ARQM-002, ARQM-004 | ST-TRANS-002 |
| THM-04 | Formularios | Enumeración de cuentas desde mensajes del cliente (TH-01) | Mensajes idénticos; el cliente no distingue casos que el servidor no distingue | F01, F02 | ST-F01-002, ST-F02-001 |
| THM-05 | Interfaz | Fuga de PII/contraseñas por registros, capturas, portapapeles, teclado o respaldo | No registrar datos personales; campos de contraseña sin autocompletado inseguro; exclusión de respaldos; ocultar el correo parcialmente en confirmación | ARQM-002, ARQM-005 | ST-F01-004, ST-F02-005 |
| THM-06 | Cadena de suministro | Dependencia npm/nativa maliciosa o vulnerable | Lockfile, versiones fijas, auditoría, Dependabot con aprobación humana, SBOM | INFM-003 | Gates de INFM-003 |
| THM-07 | CI/CD | Acción comprometida, filtración de llave de firma o de cuenta de servicio | Acciones por SHA, permisos mínimos, secretos por ambiente, firma fuera del repositorio, aprobación manual a producción | INFM-001…003, INFM-005 | Revisión de workflow |
| THM-08 | Plataforma Android | Enlaces profundos / intents / WebView manipulados | Validar origen y parámetros; mínimo de componentes exportados; WebView solo para páginas propias | ARQM-002 | Revisión de manifiesto |
| THM-09 | Fuerza bruta | Credential stuffing contra el login | Control en servidor (rate limit, 429); el cliente respeta `Retry-After` y no reintenta automáticamente | ARQM-004, F02 | ST-F02-003 |
| THM-10 | Distribución | App clonada o phishing | Publicar solo por Google Play; nombre de paquete y firma controlados | INFM-004 | — |
| THM-11 | Refresh | Reutilización de refresh rotado | Una sola renovación en vuelo; reemplazo atómico del token almacenado; ante 401 de refresh, cierre de sesión local | ARQM-003 | UT-ARQM-003, ST-F02-004 |
| THM-12 | Privacidad | Tratamiento de datos de menores y consentimiento (LINDDUN) | Aviso de privacidad visible y versionado; sin recolección extra; decisión DEC-10 | F01 | ST-F01-005 |
| THM-13 | Tienda | Rechazo o retiro por incumplir políticas (privacidad, datos, contenido de usuarios, eliminación de cuenta) | Lista de verificación de cumplimiento verificada con fuente oficial | INFM-004 | Revisión previa a cada envío |

Revisión: cuando cambie el contrato de autenticación, se agregue un permiso del dispositivo, una dependencia nativa o una herramienta de CI/CD.
