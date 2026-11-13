# Evidencias CI/CD — 2026-11-12

> Registro de ejecuciones reales. Un YAML válido no equivale a un run exitoso. Lo no ejecutado se marca `NO EJECUTADO` o `BLOQUEADO`.

## Rama y base

- Repositorio: `unihome0412/unihome-mobile`.
- Rama: `feature/mobile-cicd-android-delivery`.
- Base observada: `cd622ada92928dd7317ec0a1d13a92e3a0e7afb7`.
- PR: [#11](https://github.com/unihome0412/unihome-mobile/pull/11).
- Merge: no realizado.
- Publicación Google Play: no realizada.

## Validaciones locales ejecutadas

| Fecha | Comando | Resultado real |
|---|---|---|
| 2026-11-12 | `npm ci --legacy-peer-deps` | Instalación reproducible correcta |
| 2026-11-12 | `npx tsc --noEmit` | Sin errores |
| 2026-11-12 | `npm test -- --ci --runInBand` | 4 suites, 13 pruebas, 13 correctas |
| 2026-11-12 | `npm run test:coverage -- --runInBand` | 4 suites, 13 pruebas; cobertura global 13.43% statements, 7.75% branches, 11.4% functions, 13.94% lines |
| 2026-11-12 | `npm run lint` | Sin errores ni warnings |
| 2026-11-12 | `npm run format:check` | Formato correcto en configuración, workflows y scripts |
| 2026-11-12 | `npm run verify:workflows` | Workflows con permisos, eventos y acciones fijadas |
| 2026-11-12 | `npm run test:pipeline` | 5 pruebas del validador, 5 correctas |
| 2026-11-12 | `actionlint` | Workflows sin errores de sintaxis ni expresiones |
| 2026-11-12 | `npx expo export --platform android --no-bytecode --output-dir dist` | Bundle JS de 1.5 MB, 980 módulos, 19 assets |
| 2026-11-12 | `npm audit --json` + validador | 23 hallazgos: 6 low, 17 moderate, 0 high, 0 critical |
| 2026-11-12 | `npm sbom --sbom-format=cyclonedx --omit=dev` | SBOM CycloneDX 1.5 con 324 componentes |
| 2026-11-12 | `gitleaks detect` y `gitleaks dir` (v8.30.1, checksum verificado) | 0 fugas; reporte `[]` |
| 2026-11-12 | `node scripts/verify-android-manifest.mjs --manifest android/app/src/main/AndroidManifest.xml --profile release-source` | Manifiesto fuente válido; permisos peligrosos marcados para eliminación |
| 2026-11-12 | `npm run test:pipeline` tras la corrección de Play | 30 pruebas de workflows, promoción y provenance; 30 correctas |
| 2026-11-12 | `node --check` sobre los scripts nuevos de Play | Sin errores de sintaxis |
| 2026-11-12 | `actionlint` 1.7.12 sobre los cinco workflows | Sin hallazgos |
| 2026-11-12 | `node scripts/verify-android-manifest.mjs --manifest <sintético> --profile release` | Manifiesto con versionCode/versionName/targetSdk aceptado; manifiesto sin versionCode rechazado; fuente `release-source` sigue válida |

La cobertura no se declara suficiente: solo protege la línea base medida. Las pruebas de UI e integración siguen pendientes.

## Corrección final del workflow Play — 2026-11-12

- `play-publish.yml` ya no usa `r0adkll/upload-google-play`: descarga metadatos del run antes del checkout, hace checkout del `head_sha` exacto del AAB y verifica run, artefacto, SHA256, tamaño, package, versionName, versionCode, `runId`, `runAttempt` y `ref`.
- La promoción usa un edit de la API de Google Play: reutiliza el bundle si el SHA256 y el versionCode ya existen; solo sube un AAB nuevo a `internal` o `closed`. Un AAB nuevo no se sube directo a producción.
- `closed` usa `PLAY_CLOSED_TRACK` y comprueba que la pista exista; no asume el nombre `closed`.
- Producción queda en `draft` por defecto, sin `userFraction`. `staged` exige `PLAY_PRODUCTION_ROLLOUT_ENABLED=true`, confirmación específica y fracción `0 < f < 1`; el estado compatible es `inProgress`. La promoción solo cuenta lanzamientos `completed` o `inProgress` en pistas de pruebas; `draft` y `halted` no acreditan prueba.
- Se añadieron pruebas de checkout obligatorio, doble guardia de `main`, `tracks` frente a `track`, compatibilidad estado/rollout, promoción por versionCode y correspondencia artefacto/commit.
- Se corrigió un defecto adicional: `jarsigner -verify -strict` rechaza una upload key autofirmada. Ahora se verifica sin `-strict`, se exige la salida `jar verified` y se rechazan entradas sin firmar; en release se conserva el pin SHA256 del certificado.
- El validador de manifiesto exige `versionCode`, `versionName` y `targetSdk` en el perfil `release`; se probó con un manifiesto sintético válido y otro sin `versionCode` (rechazado).
- El resumen de Play se escribe en `RUNNER_TEMP` y no en el checkout, para no leer un archivo preexistente. La concurrencia `play-publish` es única para evitar edits simultáneos.
- **NO EJECUTADO:** `play-publish.yml` no se ejecutó con credenciales reales. No se generó ni descargó un AAB release en esta corrección, no se creó cuenta de servicio, environment ni secreto, y no se publicó en ninguna pista de Google Play. Los tests usan un cliente falso y una clave RSA efímera; no acreditan una publicación.

## Build Android local

**NO EJECUTADO localmente.** El equipo Windows no tiene `java` instalado. No se instaló una toolchain Android masiva sin autorización. La compilación nativa se valida en GitHub Actions mediante `android-build.yml`.

## GitHub Actions

| Workflow | Run ID | Commit | Estado | Artefacto |
|---|---|---|---|---|
| CI UniHome Mobile | [`43311255547`](https://github.com/unihome0412/unihome-mobile/actions/runs/43311255547) | `ecd6960168a7cfe1bae2c746cb644ef99ec1272e` | **success** | Cobertura, SCA, SBOM y Gitleaks |
| Android Debug Build | [`43311253954`](https://github.com/unihome0412/unihome-mobile/actions/runs/43311253954) | `ecd6960168a7cfe1bae2c746cb644ef99ec1272e` | **success** (9m 44s) | APK debug + SHA256 |
| Android Release AAB | NO EJECUTADO | — | Bloqueado por secretos/environment y autorización | — |
| Google Play | NO EJECUTADO | — | Bloqueado por autorización y cuentas | — |

Los seis checks obligatorios y el check opcional de Android concluyeron en `success` sobre el head `ecd6960`. El metadata del APK registró `3d9587c2718dcd786ca1655ac87fbc1c8bb137bf`, SHA de merge propio del evento `pull_request`; el run pertenece al head indicado. Un commit documental posterior no cambia código: los checks se revalidan en cada push y el resultado vigente se consulta en el PR.

Artefactos descargados y verificados:

| Artefacto | ID | Tamaño ZIP | Contenido verificable |
|---|---:|---:|---|
| `unihome-debug-apk` | `13985963609` | 60,380,654 bytes | APK de 189,143,015 bytes; SHA256 `634cce44f300d573491239fa57f0686e3509e2862d954f31e0a2fbbc4089fd50` |
| `coverage-report` | `13986162446` | 115,941 bytes | `lcov.info` y `coverage-summary.json` |
| `sca-sbom-reports` | `13985787519` | 68,161 bytes | Auditorías runtime/completa y SBOM CycloneDX |
| `gitleaks-report` | `13986237013` | 159 bytes | Reporte JSON `[]` (sin fugas) |

El APK debug se generó con `expo prebuild` y `:app:assembleDebug`; se verificó con `aapt2`: package `mx.unihome.app`, `versionCode=1000000`, `targetSdk=36`. Su firma es **debug y no sirve para Google Play**.

## Bloqueos reales

1. **AAB firmado:** no existen upload key ni secretos; no se crean en este PR. Requiere custodia humana y environment protegido.
2. **Google Play:** no hay cuenta, service account, política de privacidad publicada ni autorización de publicación.
3. **G-M06:** ratificación docente global pendiente; no se declara cierre.
4. **Cobertura y pruebas funcionales:** las pruebas actuales son de seguridad; elevar cobertura requiere PR funcional separado.
