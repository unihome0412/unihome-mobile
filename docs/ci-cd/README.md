# CI/CD móvil — runbook operativo

**Vigencia:** 2026-11-12. **Alcance:** CI/CD, DevSecOps, pruebas y builds Android del cliente móvil. **Fuera de alcance:** cambios funcionales, backend, Docker, EAS Build cloud y publicación no autorizada.

> `G-M06` sigue pendiente de ratificación docente global. La autorización de equipo cubre únicamente este PR de infraestructura. La publicación en Google Play no se ejecutó y no se declara probada.

## 1. Estado y decisiones

| Tema | Decisión implementada |
|---|---|
| Build Android | Expo Managed + Continuous Native Generation (`expo prebuild`) y Gradle en Ubuntu |
| JDK | Eclipse Temurin 17, compatible con AGP 9.2.1 y Expo SDK 58 |
| SDK Android | `compileSdk` 37 generado por Expo SDK 58; `targetSdk` 36 |
| Node | `22.23.5`, fijado en `.nvmrc`; lockfile v3 |
| Firma release | Upload key externa; secreto de environment; nunca en Git, caché, reporte o artifact |
| Publicación | `workflow_dispatch` exclusivamente; gates por environment, variable y confirmación |
| Docker / EAS cloud | Prohibidos y no usados |

Fuentes oficiales consultadas el 2026-11-12:

- Expo SDK 58 y toolchain: `https://docs.expo.dev/versions/latest/` y notas de SDK 58.
- Requisito `targetSdk` 36: `https://support.google.com/googleplay/android-developer/answer/11926878`.
- AGP/Gradle/JDK: `https://developer.android.com/build/releases/gradle-plugin` y `https://docs.gradle.org/current/userguide/compatibility.html`.
- Play App Signing y pistas: `https://support.google.com/googleplay/android-developer/answer/9842756`.

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
| `play-publish.yml` | Manual | Mismo AAB a Play | Environments de pista, variables y confirmación |
| `scheduled-security.yml` | Semanal y manual | SCA y SBOM | Falla ante high/critical |

Los seis nombres que no deben cambiarse:

1. `Análisis Estático y Tipos`
2. `CodeQL - SAST JavaScript y TypeScript`
3. `Pruebas de Seguridad y Cobertura`
4. `Gitleaks - Detección de Secretos`
5. `Auditoría de Dependencias (SCA)`
6. `Verificación de Empaquetado (Dry-Run)`

`Android APK Debug (sin secretos)` es un séptimo check **opcional**. No debe añadirse a branch protection hasta comprobar estabilidad, duración y costo.

## 4. Environments de GitHub

Crear manualmente, con revisores obligatorios, restricción a `main` y sin autoaprobación:

| Environment | Uso | Secretos/alcance |
|---|---|---|
| `android-release` | Build firmado | Upload key y certificado |
| `play-internal` | Pista interna | Cuenta de servicio Play |
| `play-closed` | Pista cerrada | Cuenta de servicio Play |
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

Variables de repositorio, todas deshabilitadas hasta autorización:

- `RELEASE_BUILD_ENABLED`
- `PLAY_PUBLISHING_ENABLED`
- `PLAY_PRODUCTION_ENABLED`

No se creó ningún secreto, keystore, cuenta de servicio ni valor real en este PR.

## 6. Activación futura de Google Play

1. Confirmar tipo y fecha de la cuenta de Play; verificar si aplica prueba cerrada de 12 testers durante 14 días.
2. Crear la app y completar la primera carga manual si Play Console la exige antes de automatizar.
3. Configurar Play App Signing y custodiar la upload key fuera del repositorio.
4. Publicar política de privacidad y eliminación de cuenta web; completar Data Safety, acceso de revisión y ficha.
5. Crear los environments y protegerlos con revisores.
6. Ejecutar `android-release.yml` desde `main` y conservar AAB, SHA256 y metadata.
7. Ejecutar `play-publish.yml` con el `release_run_id`, pista y confirmación; usar el **mismo AAB** en todas las pistas.
8. Antes de producción, revisar el informe previo al lanzamiento y aplicar rollout escalonado.

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
