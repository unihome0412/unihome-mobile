# Plan — FT-03 infraestructura-cicd-devsecops

**ID:** PLAN-MOV-CICD-001  
**Estado:** planificación documentada, **no ejecutada** (ejecución actual en modo **LOCAL**).  
**Base:** `spec.md` y paquete `../03-infraestructura/`.

## 1. Estrategia por fases
1. **Entorno local (activo para desarrollo cuando se apruebe G-M06):** Ejecución local de verificación de tipos TypeScript, linter, pruebas unitarias/integración con Jest + React Native Testing Library y consumo de endpoints implementados sin exponer secretos.
2. **Activación futura de CI (`INFM-001` e `INFM-003`):** Copiar `ci-movil-pr.yml.example` a `.github/workflows/` únicamente tras aprobación humana, fijando los SHA de las acciones.
3. **Activación futura de CD (`INFM-002` e `INFM-005`):** Configurar secretos en GitHub Environments y promover el `.aab` cuando se autorice pasar del entorno local a tienda.
