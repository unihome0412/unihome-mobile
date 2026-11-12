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
| CI UniHome Mobile | Pendiente | Pendiente | Pendiente | Cobertura, SCA y SBOM |
| Android Debug Build | Pendiente | Pendiente | Pendiente | APK debug + SHA256 |
| Android Release AAB | NO EJECUTADO | — | Bloqueado por secretos/environment y autorización | — |
| Google Play | NO EJECUTADO | — | Bloqueado por autorización y cuentas | — |

## Bloqueos reales

1. **AAB firmado:** no existen upload key ni secretos; no se crean en este PR. Requiere custodia humana y environment protegido.
2. **Google Play:** no hay cuenta, service account, política de privacidad publicada ni autorización de publicación.
3. **G-M06:** ratificación docente global pendiente; no se declara cierre.
4. **Cobertura y pruebas funcionales:** las pruebas actuales son de seguridad; elevar cobertura requiere PR funcional separado.
