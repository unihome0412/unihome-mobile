# CI/CD móvil — runbook operativo

**Vigencia:** 2026-11-12. **Alcance:** CI/CD, DevSecOps, pruebas y builds Android del cliente móvil. **Fuera de alcance:** cambios funcionales, backend, Docker, EAS Build cloud y publicación no autorizada.

> `G-M06` sigue pendiente de ratificación docente global. La autorización de equipo cubre únicamente este PR de infraestructura. La publicación en Google Play no se ejecutó y no se declara probada. Evidencia vigente: CI `43311255547` y APK debug `43311253954`, ambos `success` sobre `ecd6960`; ver `EVIDENCIAS.md`.

## 1. Estado y decisiones

| Tema | Decisión implementada |
|---|---|
| Build Android | Expo Managed + Continuous Native Generation (`expo prebuild`) y Gradle en Ubuntu |
| JDK | Eclipse Temurin 17, compatible con AGP 9.2.1 y Expo SDK 58 |
| SDK Android | `compileSdk` 37 generado por Expo SDK 58; `targetSdk` 36 |
| Node | `22.23.5`, fijado en `.nvmrc`; lockfile v3 |
| Firma release | Upload key externa; secreto de environment; nunca en Git, caché, reporte o artifact |
| Publicación | `workflow_dispatch` exclusivamente desde `main`; gates por environment, variables y confirmación |
| Promoción Play | Reutiliza el `versionCode` ya cargado mediante la API; no vuelve a subir el mismo AAB |
| Docker / EAS cloud | Prohibidos y no usados |

Fuentes oficiales consultadas el 2026-11-12:

- Expo SDK 58 y toolchain: `https://docs.expo.dev/versions/latest/` y notas de SDK 58.
- Requisito `targetSdk` 36: `https://support.google.com/googleplay/android-developer/answer/11926878`.
- AGP/Gradle/JDK: `https://developer.android.com/build/releases/gradle-plugin` y `https://docs.gradle.org/current/userguide/compatibility.html`.
- Play App Signing y pistas: `https://support.google.com/googleplay/android-developer/answer/9842756`.
- API de pistas y bundles: `https://developers.google.com/android-publisher/api-ref/rest/v3/edits.tracks` y `https://developers.google.com/android-publisher/api-ref/rest/v3/edits.bundles/list`.

Los requisitos de Play pueden cambiar; deben reverificarse antes de publicar.

## 2. Reproducción local sin Docker

### 2.1 Validaciones de aplicación

En Windows PowerShell o Linux:

```bash
npm ci --legacy-peer-deps
npm run typecheck
npx tsc --project __tests__/tsconfig.json --noEmit
npm run lint
npm run format:check
npm run test:coverage -- --runInBand
npm run verify:workflows
npm run test:pipeline
npx expo export --platform android --no-bytecode --output-dir dist
```

`dist/` es un bundle JavaScript: **no es un APK ni un AAB**.

### 2.2 APK debug nativo

Requisitos locales: JDK 17, Android SDK con plataforma 37, Build Tools 36.0.0, NDK 27.1.12297006 y `ANDROID_HOME` definido. No se instaló esta toolchain en el equipo Windows durante este PR.

```bash
npm ci --legacy-peer-deps
npx expo prebuild --platform android --clean --no-install
node scripts/verify-android-manifest.mjs --manifest android/app/src/main/AndroidManifest.xml --profile release-source
cd android
./gradlew :app:assembleDebug --no-daemon
cd ..
node scripts/verify-android-manifest.mjs --apk android/app/build/outputs/apk/debug/app-debug.apk --profile debug
sha256sum android/app/build/outputs/apk/debug/app-debug.apk
```

En Windows, el wrapper se invoca como `gradlew.bat`. La firma debug no sirve para Google Play.

### 2.3 AAB release

El AAB firmado solo se genera en el workflow protegido. Para una reproducción local autorizada se necesitan las mismas variables de firma; no se documentan valores:

```bash
export ANDROID_KEYSTORE_PATH=/ruta/fuera/del/repositorio/upload.jks
export ANDROID_KEYSTORE_PASSWORD='...'
export ANDROID_KEY_ALIAS='...'
export ANDROID_KEY_PASSWORD='...'
npx expo prebuild --platform android --clean --no-install
node scripts/configure-android-signing.mjs
cd android
./gradlew :app:bundleRelease --no-daemon
```

`scripts/configure-android-signing.mjs` solo modifica el proyecto `android/` generado, que está ignorado por Git. El AAB no debe copiarse al repositorio.

## 3. Workflows

| Workflow | Disparo | Propósito | Gate |
|---|---|---|---|
| `ci.yml` | PR/push a `main`, manual | Seis checks obligatorios | Rama protegida |
| `android-build.yml` | Manual y PR con rutas relevantes | APK debug real, sin secretos | Check opcional, no requerido |
| `android-release.yml` | Manual desde `main` | AAB firmado y metadata | Environment `android-release`, variable y secretos |
| `play-publish.yml` | Manual desde `main` | Mismo AAB a Play, promoción por `versionCode` | Environments de pista, variables, revisores y confirmación |
| `scheduled-security.yml` | Semanal y manual | SCA y SBOM | Falla ante high/critical |

Los seis nombres que no deben cambiarse:

1. `Análisis Estático y Tipos`
2. `CodeQL - SAST JavaScript y TypeScript`
3. `Pruebas de Seguridad y Cobertura`
4. `Gitleaks - Detección de Secretos`
5. `Auditoría de Dependencias (SCA)`
6. `Verificación de Empaquetado (Dry-Run)`

`Android APK Debug (sin secretos)` es un séptimo check **opcional**. No debe añadirse a branch protection hasta comprobar estabilidad, duración y costo.

### 3.1 Controles de `play-publish.yml`

1. El job solo se ejecuta con `github.ref == refs/heads/main`; además, el primer paso vuelve a comprobar `WORKFLOW_REF`.
2. Descarga los metadatos del run de release antes del checkout y guarda los JSON en `RUNNER_TEMP` para que el checkout no los borre.
3. Hace `actions/checkout` del **head SHA exacto** del run de release, con `persist-credentials: false`. Así `app.json` pertenece al mismo commit que generó el AAB.
4. Exige que el run sea un `workflow_dispatch` exitoso de `android-release.yml`, de `main` y del repositorio autorizado. Comprueba que el artefacto vigente pertenece a ese run y a ese SHA.
5. Verifica SHA256, tamaño, package, versionName, versionCode, `runId`, `runAttempt` y `ref` del metadata; después verifica que el AAB tenga firma (`jar verified`, sin entradas sin firmar) y su manifiesto con `bundletool`. El perfil `release` exige `versionCode`, `versionName` y `targetSdk` presentes. La upload key es autofirmada: no se usa `jarsigner -strict`; el release fija el SHA256 del certificado.
6. Abre un edit de Google Play, comprueba el SHA256 del bundle ya cargado y reutiliza el `versionCode` para asignarlo o promoverlo. Solo sube el AAB si no existe y el destino es una pista de prueba. Nunca sube un AAB nuevo directo a producción.
7. Para producción exige que el `versionCode` ya esté asignado a una pista de pruebas (excluye `production` y `*:production`) con un lanzamiento `completed` o `inProgress`; `draft` y `halted` no cuentan. El estado por defecto es `draft`, sin `userFraction`; el rollout `inProgress` solo se permite con autorización adicional y una fracción válida.
8. Si el destino es una pista cerrada, usa el identificador exacto de `PLAY_CLOSED_TRACK`; no asume que se llame `closed`. Rechaza `internal`, `production` y pistas de producción por factor de forma (`*:production`).
9. Serializa las ejecuciones con `concurrency: play-publish` y escribe el resumen en `RUNNER_TEMP`, no en el checkout, para evitar edits simultáneos y archivos preexistentes.

El workflow no usa `r0adkll/upload-google-play`: esa acción vuelve a subir el archivo en cada ejecución. La promoción se hace con la API de Google Play y `versionCodes`, y las pruebas unitarias cubren la diferencia entre primera carga, asignación y promoción.

> El AAB debe haberse generado en un commit que incluya `scripts/play-release.mjs` y `scripts/verify-play-provenance.mjs`; el workflow hace checkout de ese commit para leer `app.json` y los validadores. No se puede promover un release anterior a esta corrección con el workflow nuevo.

## 4. Environments de GitHub

Crear manualmente, con revisores obligatorios, restricción a `main` y sin autoaprobación:

| Environment | Uso | Secretos/alcance |
|---|---|---|
| `android-release` | Build firmado | Upload key y certificado |
| `play-internal` | Pista interna | Cuenta de servicio Play |
| `play-closed` | Pista cerrada | Cuenta de servicio Play y `PLAY_CLOSED_TRACK` |
| `play-production` | Producción | Cuenta de servicio Play y revisor adicional |

Una referencia `environment:` en YAML **no crea protección por sí sola**. Debe configurarse en GitHub y comprobarse con un run que el gate detiene la ejecución.

## 5. Secretos y variables (solo nombres)

Secretos de `android-release`:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`
- `ANDROID_UPLOAD_CERT_SHA256`

Secreto de `play-internal`, `play-closed` y `play-production`:

- `PLAY_SERVICE_ACCOUNT_JSON`

Variables de repositorio o de environment, todas deshabilitadas hasta autorización:

- `RELEASE_BUILD_ENABLED`
- `PLAY_PUBLISHING_ENABLED`
- `PLAY_PRODUCTION_ENABLED`
- `PLAY_PRODUCTION_ROLLOUT_ENABLED` (solo para `production_release=staged`)
- `PLAY_CLOSED_TRACK` (identificador real de la pista cerrada, no un secreto)

No se creó ningún secreto, keystore, cuenta de servicio ni valor real en este PR. Tampoco se crearon los environments protegidos.

## 6. Activación futura de Google Play

1. Confirmar tipo y fecha de la cuenta de Play; verificar si aplica prueba cerrada de 12 testers durante 14 días.
2. Crear la app y completar la primera carga manual si Play Console la exige antes de automatizar.
3. Configurar Play App Signing y custodiar la upload key fuera del repositorio.
4. Publicar política de privacidad y eliminación de cuenta web; completar Data Safety, acceso de revisión y ficha.
5. Crear los environments y protegerlos con revisores.
6. Ejecutar `android-release.yml` desde `main` y conservar AAB, SHA256 y metadata.
7. Ejecutar `play-publish.yml` con el `release_run_id`, `target` y confirmación. Para `closed`, definir `PLAY_CLOSED_TRACK` con el identificador exacto que muestra Play Console. El workflow verifica que `app.json` pertenece al mismo commit del AAB y que el artefacto, SHA256, metadata y `versionCode` coinciden.
8. Para la primera carga, usar `internal` o `closed`; el workflow sube el AAB solo si el versionCode aún no existe. Para promover, usar el mismo `release_run_id`: reutiliza el bundle ya cargado y actualiza la pista por `versionCode`.
9. Antes de producción, revisar el informe previo al lanzamiento. Producción exige un versionCode ya probado y queda en `draft` por defecto, sin `userFraction`. Un rollout escalonado (`staged`) exige `PLAY_PRODUCTION_ROLLOUT_ENABLED=true`, confirmación específica y una fracción entre 0 y 1; sigue sujeto a revisión de Play.

La primera publicación no se probó. Si Play Console no está disponible, el bloqueo es externo y no debe simularse.

## 7. Reversión

Google Play no ofrece rollback binario automático. Ante un fallo: pausar o detener el rollout y publicar una versión corregida con `versionCode` mayor, usando el mismo pipeline y una nueva aprobación. No se recompila el mismo `versionCode` para simular una promoción.

## 8. Costos y retención

El repositorio es público y los workflows usan runners estándar de GitHub; no se contrató EAS ni un servicio de pago. Antes de aumentar frecuencia o usar runners mayores debe revisarse la facturación y cuota vigente de GitHub. Artefactos: 7 días (coverage, SCA, APK/AAB); 14 días (reportes semanales). No se almacenan secretos en artefactos.

## 9. Limitaciones conocidas

- No hay pruebas de UI ni integración contra backend; las 13 pruebas actuales son de seguridad.
- La cobertura global inicial es baja y se protege solo contra regresión; no cumple un 80% ficticio.
- El gate de manifiesto cubre permisos, tráfico claro, depuración, backup y componentes exportados; no sustituye un análisis del binario.
- La licencia de dependencias y el análisis estático del AAB quedan pendientes.
- El APK debug y los runs de GitHub se registran en `EVIDENCIAS.md`; lo no ejecutado se marca como tal.
- `play-publish.yml` está validado estáticamente y con pruebas unitarias de checkout, provenance, pista, estado y `versionCode`; **no se ejecutó con credenciales ni publicó en Play**. La primera ejecución real seguirá siendo una validación pendiente.
