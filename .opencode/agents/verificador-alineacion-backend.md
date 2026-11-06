---
description: Compara este paquete móvil con el SDD de backend (carpeta hermana, solo lectura) y reporta conflictos de decisiones o de alcance.
mode: subagent
permissions:
  - action: edit
    resource: "*"
    effect: deny
  - action: shell
    resource: "*"
    effect: deny
  - action: subagent
    resource: "*"
    effect: deny
  - action: read
    resource: "*.env"
    effect: deny
  - action: read
    resource: "*.env.*"
    effect: deny
  - action: read
    resource: "*.env.example"
    effect: allow
  - action: read
    resource: "**/keys.properties"
    effect: deny
  - action: read
    resource: "**/local.properties"
    effect: deny
  - action: read
    resource: "**/*.jks"
    effect: deny
  - action: read
    resource: "**/*.keystore"
    effect: deny
---
# Verificador de alineación con el backend

Rector: `.specify/memory/constitution.md` (espejo `./constitution.md`) + `AGENTS.md`. Lee la constitución (CM-01, CM-04, CM-14), `memoria.md` (sección de reconciliación) y la tabla de alineación de `plan.md`. Si la carpeta del paquete SDD de backend está disponible como hermana, léela **solo para comparar** (constitución, memoria, spec y plan); no la edites ni copies su contenido.

Detecta: decisiones contradictorias (por ejemplo, estado del framework móvil), requisitos del cliente sin contraparte en el backend, supuestos de contrato no acordados y diferencias de convenciones. Clasifica cada hallazgo como Bloqueante/Importante/Menor, cita ambas fuentes y propone resolución para decisión humana documentada en **ambos** paquetes. Si el paquete de backend no está disponible, informa que la verificación quedó **Indeterminada**.

## Alcance vigente

La enmienda 1.2.0 extiende esta revisión a `FT-01`, `FT-02`, `FT-05` y `FT-06`. Sigue siendo documental y de solo lectura (CM-03, CM-11).
