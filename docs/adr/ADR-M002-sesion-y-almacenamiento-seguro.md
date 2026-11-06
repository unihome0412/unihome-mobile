# ADR-M002 · Sesión y almacenamiento seguro de credenciales

- Estado: **Confirmado** (2026-11-05: Aprobada opción **B** con **`expo-secure-store`** para guardar el `refreshToken` de forma segura en Android Keystore y mantener el `accessToken` en memoria, garantizando que la sesión **deberá** estar siempre viva salvo logout explícito) · Relacionado: MM-104, CM-07, CM-13, THM-01, THM-11

## Contexto
La sesión debe permanecer viva hasta cierre explícito (lineamientos 10 y 16). El backend entrega access y refresh token (`LoginResponse`) y rota el refresh con detección de reutilización.

## Alternativas
**A:** Almacenamiento seguro respaldado por el Keystore de Android para ambos tokens. **B:** Solo el refresh en almacenamiento seguro y el access en memoria. **C:** Almacenamiento simple/caché local (rechazada por CM-07).

## Propuesta (NO ratificada)
**B**: refresh token en almacenamiento seguro del sistema; access token en memoria (se recupera con una renovación al abrir la app). Reduce la exposición a cambio de una petición extra al iniciar. Biblioteca concreta por definir al aprobar.

## Consecuencias
La política de renovación única en vuelo y de borrado al cerrar sesión se detalla en ARQM-003. El tamaño y la disponibilidad del almacenamiento seguro varían por dispositivo: probar en la matriz de dispositivos.

## Criterios de aprobación
- [ ] Revisor de seguridad valida. - [ ] Se elige biblioteca justificada (CM-09).
