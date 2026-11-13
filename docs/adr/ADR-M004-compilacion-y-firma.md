# ADR-M004 · Compilación y firma del artefacto

- Estado: **Diferido para publicación / Confirmado modo LOCAL actual** (2026-11-05: por ahora el proyecto se mantiene en entorno **LOCAL** sin publicar todavía; para entrega futura a tienda se mantiene propuesta Play App Signing + CI) · Relacionado: MM-023, INFM-002, INFM-004, INFM-005, THM-07

## Contexto
Google Play requiere un paquete de aplicación (`.aab`) firmado; con Play App Signing, el equipo conserva una **llave de carga** y Google custodia la de distribución. La compilación puede hacerse en un servicio en la nube del ecosistema Expo (con cola y cuotas gratuitas **por verificar**) o localmente en el runner de GitHub Actions con Gradle.

## Alternativas
**A:** Servicio de compilación en la nube (menos configuración, dependencia de un tercero y de cuotas). **B:** Compilación en Actions con Gradle (reproducible y bajo control, más mantenimiento, minutos de CI). **C:** Compilación manual en equipo local (rechazada: no reproducible, viola CM-15).

## Propuesta (NO ratificada)
**B** si el repositorio es público o los minutos alcanzan; **A** como respaldo. Verificar cuotas vigentes antes de decidir. La llave de carga **no** entra al repositorio; vive en secretos de ambiente y con custodia de al menos dos personas.

## Consecuencias
Define plantillas de INFM-002, el inventario de secretos de INFM-005 y los minutos de CI necesarios.

## Criterios de aprobación
- [ ] Se verifican cuotas y costos vigentes. - [ ] Revisor de seguridad valida la custodia de llaves.

## Nota de implementación (2026-11-12)

Se implementó la alternativa **B** como preparación: Expo Prebuild + Gradle en GitHub Actions, AAB firmado con upload key leída de un environment protegido y borrada al terminar. El workflow no se ejecutó por falta de keystore y autorización; la decisión formal y la verificación de costos siguen pendientes. No se creó ninguna llave ni se publicó en Play.
