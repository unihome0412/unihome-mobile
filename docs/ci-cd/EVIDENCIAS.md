# Evidencias CI/CD — 2026-11-12

> Registro de ejecuciones reales. Un YAML válido no equivale a un run exitoso. Lo no ejecutado se marca `NO EJECUTADO` o `BLOQUEADO`.

## Rama y base

- Repositorio: `unihome0412/unihome-mobile`.
- Rama: `feature/mobile-cicd-android-delivery`.
- Base observada: `cd622ada92928dd7317ec0a1d13a92e3a0e7afb7`.
- PR: pendiente de registrar al publicar la rama.
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

La cobertura no se declara suficiente: solo protege la línea base medida. Las pruebas de UI e integración siguen pendientes.

## Build Android local

**NO EJECUTADO localmente.** El equipo Windows no tiene `java` instalado. No se instaló una toolchain Android masiva sin autorización. La compilación nativa se valida en GitHub Actions mediante `android-build.yml`.

## GitHub Actions

| Workflow | Run ID | Commit | Estado | Artefacto |
|---|---|---|---|---|
| CI UniHome Mobile | [`43308889841`](https://github.com/unihome0412/unihome-mobile/actions/runs/43308889841) | `800e14cd1f0e12fb19fa5ee5f3a633e592671634` | **success** | Cobertura, SCA, SBOM y Gitleaks |
| Android Debug Build | [`43308890225`](https://github.com/unihome0412/unihome-mobile/actions/runs/43308890225) | `800e14cd1f0e12fb19fa5ee5f3a633e592671634` | **success** (10m 37s) | APK debug + SHA256 |
| Android Release AAB | NO EJECUTADO | — | Bloqueado por secretos/environment y autorización | — |
| Google Play | NO EJECUTADO | — | Bloqueado por autorización y cuentas | — |

Los seis checks obligatorios y el check opcional de Android concluyeron en `success` sobre el head `800e14c`. El metadata del APK registró `18847f08f6890a7f0ea66a29575a84b5b0befa22`, SHA de merge propio del evento `pull_request`; el run pertenece al head indicado.

Artefactos descargados y verificados:

| Artefacto | ID | Tamaño ZIP | Contenido verificable |
|---|---:|---:|---|
| `unihome-debug-apk` | `13986111545` | 60,380,655 bytes | APK de 189,143,015 bytes; SHA256 `88f84b47b87946be5fd7b7055a4f91352aee8739590d5cabd6c09ae5bb3ec9ec` |
| `coverage-report` | `13984593522` | 115,934 bytes | `lcov.info` y `coverage-summary.json` |
| `sca-sbom-reports` | `13984922082` | 68,161 bytes | Auditorías runtime/completa y SBOM CycloneDX |
| `gitleaks-report` | `13985970291` | 159 bytes | Reporte JSON `[]` (sin fugas) |

El APK debug se generó con `expo prebuild` y `:app:assembleDebug`; se verificó con `aapt2`: package `mx.unihome.app`, `versionCode=1000000`, `targetSdk=36`. Su firma es **debug y no sirve para Google Play**.

## Bloqueos reales

1. **AAB firmado:** no existen upload key ni secretos; no se crean en este PR. Requiere custodia humana y environment protegido.
2. **Google Play:** no hay cuenta, service account, política de privacidad publicada ni autorización de publicación.
3. **G-M06:** ratificación docente global pendiente; no se declara cierre.
4. **Cobertura y pruebas funcionales:** las pruebas actuales son de seguridad; elevar cobertura requiere PR funcional separado.
