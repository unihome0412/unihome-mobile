---
name: verificar-alineacion-backend
description: Compara el SDD móvil con el SDD de backend (carpeta hermana, solo lectura) y reporta decisiones contradictorias o acuerdos pendientes.
---
# Verificar alineación con el backend

## Cuándo utilizar

Antes de aprobar decisiones de contrato, autenticación, moderación, notificaciones, privacidad, ML/IA, entornos o CI/CD, y al cerrar cada fase.

## Procedimiento (solo lectura)

1. Leer la tabla de alineación del `plan.md` móvil y la sección de reconciliación de `memoria.md`.
2. Si existe la carpeta hermana del SDD de backend, leer su `constitution.md`, `memoria.md`, `spec.md` y `plan.md` **sin modificarlos**.
3. Comparar decisiones (Confirmada/Propuesta/Por definir), requisitos y supuestos de contrato.
4. Registrar cada diferencia con ambas fuentes y proponer, para decisión humana, qué paquete se actualiza.
5. Si el paquete de backend no está disponible, declarar la verificación **Indeterminada**.

No editar ninguno de los dos paquetes ni resolver conflictos de forma autónoma (CM-14).

## Alcance vigente

La enmienda 1.2.0 extiende esta revisión a `FT-01`, `FT-02`, `FT-05` y `FT-06`. Sigue siendo documental y de solo lectura (CM-03, CM-11).
