# ADR-M005 · Canal de publicación y calendario en Google Play

- Estado: **Diferido para publicación / Confirmado entorno LOCAL actual** (2026-11-05: por decisión formal, el proyecto se mantiene en entorno **LOCAL** y no se publicará todavía; la especificación de Google Play se conserva lista en `FT-04` / `INFM-004`) · Relacionado: MM-023, DEC-M01, RC-06

## Contexto
La evaluación (2026-12-02) parte de descargar la app desde Google Play (lineamiento 1). Para cuentas **personales** creadas después del 2023-11-13, Play exige una prueba cerrada con al menos 12 testers inscritos de forma continua durante 14 días antes de solicitar acceso a producción (fuente oficial, verificada 2026-11-03). Además hay tiempos de revisión de Google sin garantía.

## Alternativas
**A:** Cuenta personal + prueba cerrada inmediata. **B:** Cuenta de organización (exenta; requiere D-U-N-S y verificación, puede tardar semanas). **C:** Cuenta personal anterior a 2023-11-13 (exenta), si algún integrante la tiene.

## Propuesta (NO ratificada)
Confirmar **hoy** el tipo y fecha de creación de la cuenta (DEC-M01). Si aplica el requisito, iniciar la prueba cerrada **de inmediato**: restar 14 días a la evaluación deja como límite teórico el 2026-11-18, **sin margen** para revisiones. Preguntar al docente si una instalación desde la pista de pruebas satisface el lineamiento 1.

## Consecuencias
Adelanta la entrega de un primer artefacto instalable (aunque solo cubra F01/F02) y condiciona el orden de trabajo y la matriz de versionamiento.

## Criterios de aprobación
- [ ] Se identifica el tipo de cuenta. - [ ] El docente confirma el criterio de la evaluación. - [ ] Se fija fecha de inicio de la prueba cerrada.
