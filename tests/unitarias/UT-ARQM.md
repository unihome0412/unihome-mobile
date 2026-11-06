# Pruebas unitarias — arquitectura base del cliente (especificación, no ejecutada)

| ID | Requisito | Unidad | Pasos | Resultado esperado | Tipo |
|---|---|---|---|---|---|
| UT-ARQM-001 | MV-A05-R02 | Catálogo de textos | Recorrer claves usadas por F01 y F02 | Ninguna clave falta; sin cadenas literales en pantallas | Éxito |
| UT-ARQM-002 | MV-A04-R02 | Mapeo HTTP → estado | 400, 401, 403, 404, 409, 410, 422, 429, 5xx, sin red | Cada código produce el estado de la tabla de `ARQM-004` | Éxito |
| UT-ARQM-003 | MV-A03-R03, MV-A03-R05 | Renovación de sesión | Dos peticiones reciben 401 a la vez | **Una sola** renovación en vuelo; ambas se reintentan una vez; el token se reemplaza de forma atómica | Seguridad |
| UT-ARQM-004 | MV-A03-R01 | Máquina de sesión | Intentar transiciones fuera del diagrama | Las transiciones inválidas se rechazan | Error |
| UT-ARQM-005 | MV-A04-R03 | Lector de respuestas | Campo y valor de enumeración desconocidos | No falla; se trata como «desconocido» | Éxito |
| UT-ARQM-006 | MV-A03-R11 | Vocabulario de estados | Enumerar estados | Existen los diez estados definidos y ninguno extra | Éxito |
| UT-ARQM-007 | MV-A05-R08 | Componentes base | Revisar controles básicos | Todos exponen rol y etiqueta accesibles | Accesibilidad |
| UT-ARQM-008 | MV-A03-R06 | Cierre de sesión | Servidor no responde | Se limpian credenciales, caché y estado locales de todos modos | Seguridad |
