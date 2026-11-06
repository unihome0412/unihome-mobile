# Decisiones pendientes — cliente móvil (TODAS RESUELTAS Y APROBADAS EL 2026-11-05)

> **Actualización 2026-11-05 (Fase 2 autorizada):** La titular del proyecto aprobó las 5 decisiones restantes y dio luz verde para el desarrollo del frontend en React Native (Expo) consumiendo los endpoints publicados en Azure Container Apps (`https://unihome-api.agreeablesky-4cd63e24.eastus.azurecontainerapps.io`).

| ID | Pregunta | Decisión Confirmada (2026-11-05) | Estado |
|---|---|---|---|
| DEC-M01 | Tipo de cuenta de Google Play y calendario | Ejecución mantenida en entorno **LOCAL** por ahora; publicación diferida (`MM-023`) | **Confirmada (Modo Local)** |
| DEC-M02 | Versión mínima de Android (`minSdkVersion`) | `minSdkVersion 24` (Android 7.0) y `targetSdk 36` para tienda (`MM-016`) | **Confirmada** |
| DEC-M03 | Repositorios y organización de GitHub | Repositorios separados en una sola cuenta de GitHub (`MM-017`) | **Confirmada** |
| DEC-M04 | CI/CD, firma y compilación | Desarrollo local con Expo/React Native; plantillas CI/CD listas para futura entrega (`MM-023`) | **Confirmada** |
| DEC-M05 | `versionAvisoPrivacidad` y visualización del Aviso de Privacidad | Enviar valor fijo `"1.0"` a `POST /api/v1/auth/registro`; mostrar el aviso de privacidad localmente en la app (modal o ruta `/legal` de la maqueta) | **Confirmada (2026-11-05)** |
| DEC-M06 | Destino tras login (`POST /api/v1/auth/login`) | Dirigir al recorrido de primer ingreso (`FT-06`), mostrando el correo de la sesión en Perfil temporalmente mientras no exista `EP-M02-01` | **Confirmada (2026-11-05)** |
| DEC-M07 | Formato de la matriz de versionamiento | `SemVer` (`MAJOR.MINOR.PATCH`) + `versionCode` entero incremental (`MM-018`) | **Confirmada** |
| DEC-M08 | Diagnóstico/reporte de fallos | Logger sanitizado sin datos personales + `traceId` (`MM-206`) | **Confirmada** |
| DEC-M09 | Respuesta `403` en Login por correo sin confirmar | Mostrar el mensaje `detail` del backend y un botón directo para `"Ingresar código de confirmación"` (`/codigo`) | **Confirmada (2026-11-05)** |
| DEC-M10 / DEC-10 | Regla de edad en Registro (`Fecha de nacimiento`) | Respetar `HU-001`: permitir el registro a **cualquier edad** (cualquier fecha de nacimiento pasada válida, sin restringir a 18 años en el registro) | **Confirmada (2026-11-05)** |
| DEC-M11 | Proveedores de moderación, ML e IA | Consumidos a través del backend | **Confirmada** |
| DEC-M12 | Fijación de certificados (*pinning*) | No adoptar en esta fase (`ARQM-002` R04) | **Confirmada** |
| MM-104 / ADR-M002 | Librería para sesión siempre viva | Aprobado **`expo-secure-store`** para guardar `refreshToken` de forma segura en Keystore y `accessToken` en memoria | **Confirmada (2026-11-05)** |
| DEC-09 (backend) | Error `409` en Registro (correo ya registrado) | Mostrar mensaje amigable indicando que el correo ya está registrado y ofrecer botón directo para `"Iniciar sesión"` (`/acceso`) | **Confirmada (2026-11-05)** |
