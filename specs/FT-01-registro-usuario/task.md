# Task — FT-01 registro-usuario

**Estado general:** **NO INICIADO**. Ninguna casilla se marca sin autorización (CM-03).

## FM-11 · Preparación

- [ ] **TM-101** · Definir el contrato de cliente para registro, confirmación y reenvío, con la corrección de `Gender`. **Req:** REG-03, REG-04, REG-09, REG-11. **Dep.:** G-M06.
- [ ] **TM-102** · Definir la fuente de `versionAvisoPrivacidad` y el enlace del aviso. **Req:** REG-01, REG-03. **Dep.:** —.
- [ ] **TM-103** · Aprobar el diseño de `Confirmar correo` en la maqueta o con componentes de `FT-05`. **Req:** REG-08 a REG-12. **Dep.:** —.

## FM-12 · Implementación futura

- [ ] **TM-104** · Construir el formulario `Crea tu cuenta`. **Req:** REG-01, REG-02, REG-05, REG-06. **Dep.:** TM-101.
- [ ] **TM-105** · Conectar el registro y manejar `201`, `400`, `409` y `503`. **Req:** REG-03, REG-07, REG-08, REG-14. **Dep.:** TM-104.
- [ ] **TM-106** · Construir la confirmación y conectar `200`, `400`, `410` y `429`. **Req:** REG-09, REG-10, REG-13. **Dep.:** TM-103, TM-105.
- [ ] **TM-107** · Conectar el reenvío y limpiar el código anterior. **Req:** REG-11, REG-12. **Dep.:** TM-106.

## FM-13 · Verificación futura

- [ ] **TM-108** · Pruebas unitarias e integración del flujo. **Req:** REG-03 a REG-14. **Dep.:** TM-107.
- [ ] **TM-109** · Revisión de seguridad de logs y almacenamiento. **Req:** sección 3. **Dep.:** TM-107.
- [ ] **TM-110** · Prueba real de registro y correo en Android. **Req:** todos. **Dep.:** TM-108, TM-109.
