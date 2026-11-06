# Pruebas de seguridad transversales del cliente (especificación, no ejecutada)

| ID | Amenaza | Requisito | Pasos | Resultado esperado |
|---|---|---|---|---|
| ST-TRANS-001 | THM-01 | MV-A02-R01 | Inspeccionar dónde se guarda cualquier credencial de sesión | Solo almacenamiento seguro del sistema |
| ST-TRANS-002 | THM-03 | MV-A02-R03 | Revisar configuración de red de producción y tráfico de pruebas | Sin tráfico en claro; validación TLS activa |
| ST-TRANS-003 | THM-05 | MV-A02-R05 | Ejecutar flujos de F01/F02 y revisar registros | Sin datos personales, contraseñas, tokens ni códigos |
| ST-TRANS-004 | THM-08 | MV-A02-R09, R10 | Comparar el manifiesto con la línea base aprobada | Sin permisos nuevos no aprobados; sin componentes exportados innecesarios; compilación de producción no depurable; respaldos excluidos |
| ST-TRANS-005 | THM-02 | MV-A02-R02 | Escanear repositorio y binario de producción | Sin secretos |
| ST-TRANS-006 | THM-06 | MV-A02-R12 | Auditar dependencias y licencias | Sin vulnerabilidades de severidad bloqueante (umbrales de INFM-003); SBOM generado |
