# Plantilla de especificación funcional del cliente móvil (v2)

Usar para cada `specs/02-funcionalidades/Fxx-<nombre>/spec.md`. No copiar prosa entre funcionalidades.

1. **Encabezado:** ID `Fxx`, versión, estado (`Propuesto — requiere aprobación`), origen (HU del backend), endpoints del backend por ID (`EP-Mxx-NN`), dependencias (`ARQM-00x`), decisiones bloqueantes.
2. **Contexto y resultado observable.**
3. **HU vinculadas:** tabla HU / RF / texto **literal** tomado de `docs/trazabilidad-hu.md` del backend (no alterar).
4. **Alcance:** qué incluye y qué no (otras funcionalidades por ID).
5. **Campos y validaciones del cliente** (solo de experiencia; el servidor es la autoridad).
6. **Contrato con el backend:** una ficha por endpoint (ver `contrato-endpoint-template.md`) con **URL en blanco**, JSON de solicitud y respuesta, errores y su mapeo a estados de interfaz.
7. **Estados de interfaz y mensajes** (vocabulario de `ARQM-004`/`ARQM-005`).
8. **Reglas específicas de seguridad y privacidad** (CM-07).
9. **Criterios de aceptación en Gherkin** (éxito y error por HU; derivados literalmente del backend + escenarios propios del cliente).
10. **Referencias a pruebas:** `tests/unitarias|integracion|seguridad/*-Fxx.md`.
11. **Exclusiones / preguntas abiertas / DEC y ADR relacionados.**
12. **Aprobación:** casillas sin marcar; solo una persona revisora puede aprobar.

Todo contenido nuevo tiene estado **Propuesto — requiere aprobación**.
