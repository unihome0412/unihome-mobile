# Plan — FT-03 infraestructura-cicd-devsecops

**ID:** PLAN-MOV-CICD-001  
**Estado:** implementación CI/CD iniciada el 2026-11-12 en `feature/mobile-cicd-android-delivery`; publicación no ejecutada y aprobación global pendiente.  
**Base:** `spec.md` y paquete `../03-infraestructura/`.

## 1. Estrategia por fases
1. **Validación local ejecutada (2026-11-12):** tipos, lint, formato, 13 pruebas de seguridad, cobertura y export JS, sin secretos.
2. **CI activo (`INFM-001` e `INFM-003`):** `.github/workflows/ci.yml` conserva seis checks, acciones fijadas por SHA y validadores de seguridad.
3. **CD preparado (`INFM-002` e `INFM-005`):** workflows de AAB y Play con environments/secretos externos; no se ejecutó publicación ni se crearon credenciales.
